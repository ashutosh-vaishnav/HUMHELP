from flask import Blueprint, request, jsonify
from models.db import contacts_col, newsletters_col
from utils.auth_helper import token_required
from bson.objectid import ObjectId
import datetime

contacts_bp = Blueprint('contacts', __name__)

def serialize_contact(c):
    if not c:
        return None
    return {
        "id": str(c['_id']),
        "name": c.get('name', ''),
        "email": c.get('email', ''),
        "phone": c.get('phone', ''),
        "subject": c.get('subject', ''),
        "message": c.get('message', ''),
        "status": c.get('status', 'new'),
        "created_at": c.get('created_at').isoformat() if isinstance(c.get('created_at'), datetime.datetime) else str(c.get('created_at', ''))
    }

@contacts_bp.route('', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message or not subject:
        return jsonify({
            "success": False,
            "message": "Name, Email, Subject, and Message are required fields"
        }), 400

    new_msg = {
        "name": name,
        "email": email,
        "phone": phone,
        "subject": subject,
        "message": message,
        "status": "new",
        "created_at": datetime.datetime.utcnow()
    }
    
    contacts_col.insert_one(new_msg)
    return jsonify({
        "success": True,
        "message": "Message sent successfully. We will contact you soon."
    }), 201

@contacts_bp.route('', methods=['GET'])
@token_required
def get_contacts():
    status = request.args.get('status', '').strip()
    
    query = {}
    if status:
        query['status'] = status
        
    messages = list(contacts_col.find(query).sort('created_at', -1))
    return jsonify({
        "success": True,
        "data": [serialize_contact(m) for m in messages]
    })

@contacts_bp.route('/<msg_id>', methods=['PUT'])
@token_required
def update_contact_status(msg_id):
    try:
        msg = contacts_col.find_one({"_id": ObjectId(msg_id)})
        if not msg:
            return jsonify({"success": False, "message": "Message not found"}), 404
    except Exception:
        return jsonify({"success": False, "message": "Invalid message ID"}), 400

    data = request.get_json() or {}
    status = data.get('status', '').strip().lower()
    if status not in ['new', 'read', 'replied']:
        return jsonify({"success": False, "message": "Invalid status value"}), 400

    contacts_col.update_one({"_id": ObjectId(msg_id)}, {"$set": {"status": status}})
    updated_msg = contacts_col.find_one({"_id": ObjectId(msg_id)})
    
    return jsonify({
        "success": True,
        "message": "Message status updated successfully",
        "data": serialize_contact(updated_msg)
    })

@contacts_bp.route('/<msg_id>', methods=['DELETE'])
@token_required
def delete_contact(msg_id):
    try:
        result = contacts_col.delete_one({"_id": ObjectId(msg_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Message not found"}), 404
        return jsonify({
            "success": True,
            "message": "Message deleted successfully"
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid message ID"}), 400

@contacts_bp.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    # Check duplicate
    existing = newsletters_col.find_one({"email": email})
    if existing:
        return jsonify({
            "success": True,
            "message": "You are already subscribed to our newsletter."
        })

    newsletters_col.insert_one({
        "email": email,
        "subscribed_at": datetime.datetime.utcnow()
    })
    
    return jsonify({
        "success": True,
        "message": "Thank you for subscribing to our newsletter!"
    })
