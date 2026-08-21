from flask import Blueprint, request, jsonify
from models.db import donations_col, causes_col
from utils.auth_helper import token_required
from bson.objectid import ObjectId
import datetime
import random

donations_bp = Blueprint('donations', __name__)

def generate_donation_id():
    return f"DON-{random.randint(100000, 999999)}"

def serialize_donation(d):
    if not d:
        return None
    return {
        "id": str(d['_id']),
        "donation_id": d.get('donation_id', ''),
        "donor_name": d.get('donor_name', ''),
        "email": d.get('email', ''),
        "phone": d.get('phone', ''),
        "category": d.get('category', ''),
        "amount": float(d.get('amount', 0)),
        "anonymous": d.get('anonymous', False),
        "message": d.get('message', ''),
        "payment_id": d.get('payment_id', ''),
        "payment_status": d.get('payment_status', 'pending'),
        "cause_id": str(d.get('cause_id')) if d.get('cause_id') else None,
        "created_at": d.get('created_at').isoformat() if isinstance(d.get('created_at'), datetime.datetime) else str(d.get('created_at', ''))
    }

@donations_bp.route('', methods=['POST'])
def create_pending_donation():
    data = request.get_json() or {}
    donor_name = data.get('donor_name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    category = data.get('category', '').strip()
    
    try:
        amount = float(data.get('amount', 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Amount must be a valid number"}), 400

    anonymous = bool(data.get('anonymous', False))
    message = data.get('message', '').strip()
    order_id = data.get('order_id', '').strip()
    cause_id = data.get('cause_id')

    if not email or amount <= 0 or not category or not order_id:
        return jsonify({
            "success": False,
            "message": "Email, category, positive amount, and transaction order ID are required"
        }), 400

    donation_id = generate_donation_id()
    
    pending_donation = {
        "donation_id": donation_id,
        "donor_name": "Anonymous" if anonymous else (donor_name or "Anonymous Donor"),
        "email": email,
        "phone": phone,
        "category": category,
        "amount": amount,
        "anonymous": anonymous,
        "message": message,
        "payment_id": "",
        "payment_status": "pending",
        "order_id": order_id,
        "created_at": datetime.datetime.utcnow()
    }
    
    if cause_id:
        try:
            pending_donation['cause_id'] = ObjectId(cause_id)
        except Exception:
            pass

    donations_col.insert_one(pending_donation)

    # Convert ObjectId to string for JSON output
    pending_donation['id'] = str(pending_donation['_id'])
    del pending_donation['_id']
    if 'cause_id' in pending_donation:
        pending_donation['cause_id'] = str(pending_donation['cause_id'])

    return jsonify({
        "success": True,
        "message": "Pending donation registered",
        "data": pending_donation
    }), 201

@donations_bp.route('/confirm', methods=['POST'])
def confirm_donation():
    data = request.get_json() or {}
    order_id = data.get('order_id', '').strip()
    payment_id = data.get('payment_id', '').strip()
    
    if not order_id or not payment_id:
        return jsonify({
            "success": False,
            "message": "Order ID and verified payment ID are required to confirm donation"
        }), 400

    donation = donations_col.find_one({"order_id": order_id})
    if not donation:
        return jsonify({
            "success": False,
            "message": "Donation record not found for this transaction"
        }), 404

    if donation['payment_status'] == 'success':
        return jsonify({
            "success": True,
            "message": "Donation already completed",
            "data": serialize_donation(donation)
        })

    # Update donation details
    donations_col.update_one(
        {"_id": donation['_id']},
        {"$set": {"payment_status": "success", "payment_id": payment_id}}
    )
    
    # Increment raised amount on cause
    cause_id = donation.get('cause_id')
    amount = donation['amount']
    
    if cause_id:
        causes_col.update_one(
            {"_id": ObjectId(cause_id)},
            {"$inc": {"raised_amount": amount}}
        )
    else:
        # Fallback: Increment the first active cause matching that category
        matching_cause = causes_col.find_one({"category": donation['category'], "status": "active"})
        if matching_cause:
            causes_col.update_one(
                {"_id": matching_cause['_id']},
                {"$inc": {"raised_amount": amount}}
            )

    updated_donation = donations_col.find_one({"_id": donation['_id']})
    
    return jsonify({
        "success": True,
        "message": "Thank you for supporting HUMHELP NGO.",
        "data": serialize_donation(updated_donation)
    })

@donations_bp.route('', methods=['GET'])
@token_required
def get_donations():
    category = request.args.get('category', '').strip()
    status = request.args.get('status', 'success').strip() # Default to success to list completed donations
    search = request.args.get('search', '').strip()
    
    query = {}
    if status:
        query['payment_status'] = status
    if category:
        query['category'] = category
    if search:
        query['$or'] = [
            {"donor_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"donation_id": {"$regex": search, "$options": "i"}},
            {"payment_id": {"$regex": search, "$options": "i"}}
        ]
        
    donations = list(donations_col.find(query).sort('created_at', -1))
    return jsonify({
        "success": True,
        "data": [serialize_donation(d) for d in donations]
    })

@donations_bp.route('/<donation_id>', methods=['GET'])
def get_donation_receipt(donation_id):
    query = {}
    if donation_id.startswith("DON-"):
        query = {"donation_id": donation_id}
    else:
        try:
            query = {"_id": ObjectId(donation_id)}
        except Exception:
            return jsonify({"success": False, "message": "Invalid transaction ID"}), 400

    donation = donations_col.find_one(query)
    if not donation:
        return jsonify({"success": False, "message": "Donation record not found"}), 404
        
    return jsonify({
        "success": True,
        "data": serialize_donation(donation)
    })

@donations_bp.route('/stats/public', methods=['GET'])
def get_public_stats():
    donation_pipeline = [
        {"$match": {"payment_status": "success"}},
        {"$group": {
            "_id": None,
            "total_amount": {"$sum": "$amount"},
            "total_count": {"$sum": 1}
        }}
    ]
    from models.db import volunteers_col
    
    donation_stats = list(donations_col.aggregate(donation_pipeline))
    total_amount = float(donation_stats[0]['total_amount']) if donation_stats else 0.0
    total_count = int(donation_stats[0]['total_count']) if donation_stats else 0
    
    total_volunteers = volunteers_col.count_documents({"status": "approved"})
    total_causes = causes_col.count_documents({"status": "active"})
    
    return jsonify({
        "success": True,
        "data": {
            "total_donation_amount": total_amount,
            "total_donations_count": total_count,
            "total_volunteers": total_volunteers,
            "active_causes_count": total_causes,
            "people_supported": int(total_amount / 200) + 50
        }
    })

