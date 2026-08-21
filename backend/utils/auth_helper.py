from functools import wraps
from flask import request, jsonify
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from models.db import admins_col
from bson.objectid import ObjectId

def hash_password(password):
    """Generate secure password hash."""
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    """Verify standard text password against hash."""
    return check_password_hash(hashed_password, password)

def generate_token(admin_id, email, name, role='admin'):
    """Generate JWT access token valid for 7 days."""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': str(admin_id),
        'email': email,
        'name': name,
        'role': role
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

def token_required(f):
    """Decorator to protect routes requiring admin access."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({
                "success": False,
                "message": "Token is missing"
            }), 401
            
        try:
            # Decode token
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            current_admin = admins_col.find_one({"_id": ObjectId(data['sub'])})
            if not current_admin:
                return jsonify({
                    "success": False,
                    "message": "Invalid token or user does not exist"
                }), 401
            
            # Inject admin details into flask request context
            request.admin = data
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Token has expired"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Token is invalid"
            }), 401
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Authentication failed: {str(e)}"
            }), 401
            
        return f(*args, **kwargs)
    return decorated
