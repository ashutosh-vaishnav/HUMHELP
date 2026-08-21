from flask import Blueprint, request, jsonify
from models.db import admins_col
from utils.auth_helper import verify_password, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    admin = admins_col.find_one({"email": email})
    if not admin or not verify_password(admin['password_hash'], password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    token = generate_token(admin['_id'], admin['email'], admin['name'], admin.get('role', 'admin'))

    return jsonify({
        "success": True,
        "message": "Login successful",
        "data": {
            "token": token,
            "admin": {
                "id": str(admin['_id']),
                "name": admin['name'],
                "email": admin['email'],
                "role": admin.get('role', 'admin')
            }
        }
    })
