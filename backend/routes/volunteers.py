from flask import Blueprint, request, jsonify
from models.db import volunteers_col
from utils.auth_helper import token_required
from bson.objectid import ObjectId
import datetime
import random

volunteers_bp = Blueprint('volunteers', __name__)

def generate_volunteer_id():
    return f"VOL-{random.randint(100000, 999999)}"

def serialize_volunteer(v):
    if not v:
        return None
    return {
        "id": str(v['_id']),
        "volunteer_id": v.get('volunteer_id', ''),
        "name": v.get('name', ''),
        "email": v.get('email', ''),
        "phone": v.get('phone', ''),
        "age": v.get('age', 0),
        "city": v.get('city', ''),
        "skills": v.get('skills', []),
        "interests": v.get('interests', []),
        "availability": v.get('availability', ''),
        "reason": v.get('reason', ''),
        "status": v.get('status', 'pending'),
        "created_at": v.get('created_at').isoformat() if isinstance(v.get('created_at'), datetime.datetime) else str(v.get('created_at', ''))
    }

@volunteers_bp.route('', methods=['POST'])
def register_volunteer():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    try:
        age = int(data.get('age', 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Age must be a number"}), 400
        
    city = data.get('city', '').strip()
    skills = data.get('skills', '')
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(',') if s.strip()]
    elif not isinstance(skills, list):
        skills = []
        
    interests = data.get('interests', [])
    availability = data.get('availability', '').strip()
    reason = data.get('reason', '').strip()

    if not name or not email or not phone or age <= 0 or not city:
        return jsonify({
            "success": False,
            "message": "Name, email, phone, age, and city are required fields"
        }), 400

    # Check for duplicate email
    existing = volunteers_col.find_one({"email": email})
    if existing:
        return jsonify({
            "success": False,
            "message": "This email is already registered as a volunteer"
        }), 409

    volunteer_id = generate_volunteer_id()
    new_vol = {
        "volunteer_id": volunteer_id,
        "name": name,
        "email": email,
        "phone": phone,
        "age": age,
        "city": city,
        "skills": skills,
        "interests": interests,
        "availability": availability,
        "reason": reason,
        "status": "pending",
        "created_at": datetime.datetime.utcnow()
    }
    
    volunteers_col.insert_one(new_vol)
    
    return jsonify({
        "success": True,
        "message": "Thank you for joining HUMHELP NGO.",
        "data": {
            "volunteer_id": volunteer_id,
            "name": name
        }
    }), 201

@volunteers_bp.route('', methods=['GET'])
@token_required
def get_volunteers():
    status = request.args.get('status', '').strip()
    interest = request.args.get('interest', '').strip()
    search = request.args.get('search', '').strip()
    
    query = {}
    if status:
        query['status'] = status
    if interest:
        query['interests'] = interest
    if search:
        query['$or'] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"volunteer_id": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}}
        ]
        
    vols = list(volunteers_col.find(query).sort('created_at', -1))
    return jsonify({
        "success": True,
        "data": [serialize_volunteer(v) for v in vols]
    })

@volunteers_bp.route('/<vol_id>', methods=['PUT'])
@token_required
def update_volunteer(vol_id):
    try:
        vol = volunteers_col.find_one({"_id": ObjectId(vol_id)})
        if not vol:
            return jsonify({"success": False, "message": "Volunteer not found"}), 404
    except Exception:
        return jsonify({"success": False, "message": "Invalid volunteer ID"}), 400

    data = request.get_json() or {}
    updates = {}
    
    if 'status' in data:
        status = data['status'].strip().lower()
        if status not in ['pending', 'approved', 'rejected']:
            return jsonify({"success": False, "message": "Status must be pending, approved or rejected"}), 400
        updates['status'] = status
        
    if 'name' in data:
        updates['name'] = data['name'].strip()
    if 'phone' in data:
        updates['phone'] = data['phone'].strip()
    if 'city' in data:
        updates['city'] = data['city'].strip()
    if 'availability' in data:
        updates['availability'] = data['availability'].strip()
    if 'skills' in data:
        updates['skills'] = data['skills']
    if 'interests' in data:
        updates['interests'] = data['interests']

    if not updates:
        return jsonify({"success": False, "message": "No updates provided"}), 400

    volunteers_col.update_one({"_id": ObjectId(vol_id)}, {"$set": updates})
    updated_vol = volunteers_col.find_one({"_id": ObjectId(vol_id)})
    
    return jsonify({
        "success": True,
        "message": "Volunteer updated successfully",
        "data": serialize_volunteer(updated_vol)
    })

@volunteers_bp.route('/<vol_id>', methods=['DELETE'])
@token_required
def delete_volunteer(vol_id):
    try:
        result = volunteers_col.delete_one({"_id": ObjectId(vol_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Volunteer not found"}), 404
        return jsonify({
            "success": True,
            "message": "Volunteer record deleted successfully"
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid volunteer ID"}), 400
