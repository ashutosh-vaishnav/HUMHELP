from flask import Blueprint, request, jsonify
from models.db import stories_col
from utils.auth_helper import token_required
from bson.objectid import ObjectId
import datetime

stories_bp = Blueprint('stories', __name__)

def serialize_story(story):
    if not story:
        return None
    return {
        "id": str(story['_id']),
        "title": story.get('title', ''),
        "description": story.get('description', ''),
        "category": story.get('category', ''),
        "image": story.get('image', ''),
        "status": story.get('status', 'published'),
        "created_at": story.get('created_at').isoformat() if isinstance(story.get('created_at'), datetime.datetime) else str(story.get('created_at', ''))
    }

@stories_bp.route('', methods=['GET'])
def get_stories():
    show_all = request.args.get('all', 'false').lower() == 'true'
    query = {}
    if not show_all:
        query['status'] = 'published'
        
    stories = list(stories_col.find(query).sort('created_at', -1))
    return jsonify({
        "success": True,
        "data": [serialize_story(s) for s in stories]
    })

@stories_bp.route('/<story_id>', methods=['GET'])
def get_story(story_id):
    try:
        story = stories_col.find_one({"_id": ObjectId(story_id)})
        if not story:
            return jsonify({"success": False, "message": "Success story not found"}), 404
        return jsonify({
            "success": True,
            "data": serialize_story(story)
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid story ID"}), 400

@stories_bp.route('', methods=['POST'])
@token_required
def create_story():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    category = data.get('category', '').strip()
    image = data.get('image', '').strip()
    status = data.get('status', 'published').strip()

    if not title or not description or not category:
        return jsonify({
            "success": False,
            "message": "Title, Description, and Category are required"
        }), 400

    new_story = {
        "title": title,
        "description": description,
        "category": category,
        "image": image or "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
        "status": status,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = stories_col.insert_one(new_story)
    new_story['_id'] = result.inserted_id
    
    return jsonify({
        "success": True,
        "message": "Success story published successfully",
        "data": serialize_story(new_story)
    }), 201

@stories_bp.route('/<story_id>', methods=['PUT'])
@token_required
def update_story(story_id):
    try:
        story = stories_col.find_one({"_id": ObjectId(story_id)})
        if not story:
            return jsonify({"success": False, "message": "Story not found"}), 404
    except Exception:
        return jsonify({"success": False, "message": "Invalid story ID"}), 400

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

    if not updates:
        return jsonify({"success": False, "message": "No updates provided"}), 400

    stories_col.update_one({"_id": ObjectId(story_id)}, {"$set": updates})
    updated_story = stories_col.find_one({"_id": ObjectId(story_id)})
    
    return jsonify({
        "success": True,
        "message": "Success story updated successfully",
        "data": serialize_story(updated_story)
    })

@stories_bp.route('/<story_id>', methods=['DELETE'])
@token_required
def delete_story(story_id):
    try:
        result = stories_col.delete_one({"_id": ObjectId(story_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Story not found"}), 404
        return jsonify({
            "success": True,
            "message": "Success story deleted successfully"
        })
    except Exception:
        return jsonify({"success": False, "message": "Invalid story ID"}), 400
