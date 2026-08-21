from flask import Blueprint, request, jsonify
from models.db import causes_col
from utils.auth_helper import token_required
from bson.objectid import ObjectId
import datetime

causes_bp = Blueprint('causes', __name__)

def serialize_cause(cause):
    if not cause:
        return None
    return {
        "id": str(cause['_id']),
        "title": cause.get('title', ''),
        "description": cause.get('description', ''),
        "category": cause.get('category', ''),
        "target_amount": float(cause.get('target_amount', 0)),
        "raised_amount": float(cause.get('raised_amount', 0)),
        "image": cause.get('image', ''),
        "status": cause.get('status', 'active'),
        "created_at": cause.get('created_at').isoformat() if isinstance(cause.get('created_at'), datetime.datetime) else str(cause.get('created_at', ''))
    }

@causes_bp.route('', methods=['GET'])
def get_causes():
    # Accept a query parameter 'all' to show all causes for the admin panel, otherwise show only active.
    show_all = request.args.get('all', 'false').lower() == 'true'
    query = {}
    if not show_all:
        query['status'] = 'active'
        
    causes = list(causes_col.find(query).sort('created_at', -1))
    return jsonify({
        "success": True,
        "data": [serialize_cause(c) for c in causes]
    })

@causes_bp.route('/<cause_id>', methods=['GET'])
def get_cause(cause_id):
    try:
        cause = causes_col.find_one({"_id": ObjectId(cause_id)})
        if not cause:
            return jsonify({"success": False, "message": "Cause not found"}), 404
        return jsonify({
            "success": True,
            "data": serialize_cause(cause)
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid cause ID"}), 400

@causes_bp.route('', methods=['POST'])
@token_required
def create_cause():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    category = data.get('category', '').strip()
    try:
        target_amount = float(data.get('target_amount', 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Target amount must be a number"}), 400

    image = data.get('image', '').strip()
    status = data.get('status', 'active').strip()

    if not title or not category or target_amount <= 0:
        return jsonify({
            "success": False,
            "message": "Title, Category, and a positive Target Amount are required"
        }), 400

    new_cause = {
        "title": title,
        "description": description,
        "category": category,
        "target_amount": target_amount,
        "raised_amount": 0.0,
        "image": image or "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
        "status": status,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = causes_col.insert_one(new_cause)
    new_cause['_id'] = result.inserted_id
    
    return jsonify({
        "success": True,
        "message": "Cause created successfully",
        "data": serialize_cause(new_cause)
    }), 201

@causes_bp.route('/<cause_id>', methods=['PUT'])
@token_required
def update_cause(cause_id):
    try:
        cause = causes_col.find_one({"_id": ObjectId(cause_id)})
        if not cause:
            return jsonify({"success": False, "message": "Cause not found"}), 404
    except Exception:
        return jsonify({"success": False, "message": "Invalid cause ID"}), 400

    data = request.get_json() or {}
    updates = {}
    
    if 'title' in data:
        updates['title'] = data['title'].strip()
    if 'description' in data:
        updates['description'] = data['description'].strip()
    if 'category' in data:
        updates['category'] = data['category'].strip()
    if 'image' in data:
        updates['image'] = data['image'].strip()
    if 'status' in data:
        updates['status'] = data['status'].strip()
        
    if 'target_amount' in data:
        try:
            updates['target_amount'] = float(data['target_amount'])
        except (ValueError, TypeError):
            return jsonify({"success": False, "message": "Target amount must be a number"}), 400
            
    if 'raised_amount' in data:
        try:
            updates['raised_amount'] = float(data['raised_amount'])
        except (ValueError, TypeError):
            return jsonify({"success": False, "message": "Raised amount must be a number"}), 400

    if not updates:
        return jsonify({"success": False, "message": "No updates provided"}), 400

    causes_col.update_one({"_id": ObjectId(cause_id)}, {"$set": updates})
    updated_cause = causes_col.find_one({"_id": ObjectId(cause_id)})

    return jsonify({
        "success": True,
        "message": "Cause updated successfully",
        "data": serialize_cause(updated_cause)
    })

@causes_bp.route('/<cause_id>', methods=['DELETE'])
@token_required
def delete_cause(cause_id):
    try:
        result = causes_col.delete_one({"_id": ObjectId(cause_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Cause not found"}), 404
        return jsonify({
            "success": True,
            "message": "Cause deleted successfully"
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid cause ID"}), 400
