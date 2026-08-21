from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models.db import init_db_indexes

# Import Blueprints
from routes.auth import auth_bp
from routes.causes import causes_bp
from routes.volunteers import volunteers_bp
from routes.donations import donations_bp
from routes.payment import payment_bp
from routes.stories import stories_bp
from routes.contacts import contacts_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(causes_bp, url_prefix='/api/causes')
app.register_blueprint(volunteers_bp, url_prefix='/api/volunteers')
app.register_blueprint(donations_bp, url_prefix='/api/donations')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(stories_bp, url_prefix='/api/stories')
app.register_blueprint(contacts_bp, url_prefix='/api/contact')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Initialize database indexes
with app.app_context():
    init_db_indexes()

@app.route('/')
def index():
    return jsonify({
        "success": True,
        "message": "Welcome to HUMHELP NGO API Gateway. 'Small Help. Big Change.'"
    })

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({
        "success": False,
        "message": "API endpoint or resource not found"
    }), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({
        "success": False,
        "message": "An internal server error occurred"
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
