import os
from dotenv import load_dotenv

# Find the project root directory
backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.dirname(backend_dir)

# Load environment variables from .env.local at the project root
load_dotenv(os.path.join(root_dir, '.env.local'))
load_dotenv(os.path.join(root_dir, '.env'))

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/humhelp')
    JWT_SECRET = os.getenv('JWT_SECRET', 'supersecretjwtkeyforhumhelpngo123')
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '').strip()
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '').strip()
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
