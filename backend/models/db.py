from pymongo import MongoClient
from config import Config
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize PyMongo Client
try:
    # Use config Mongo URI
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
    # Ping database to verify connection
    client.admin.command('ping')
    db = client.get_database()
    logger.info("Successfully connected to MongoDB at %s", Config.MONGO_URI)
except Exception as e:
    logger.error("Failed to connect to MongoDB: %s. Falling back to local localhost URI.", e)
    # Fallback default client
    client = MongoClient('mongodb://localhost:27017/humhelp', serverSelectionTimeoutMS=3000)
    db = client.get_database()

# Expose collection handles
admins_col = db['admins']
donations_col = db['donations']
volunteers_col = db['volunteers']
causes_col = db['causes']
stories_col = db['stories']
contacts_col = db['contacts']
newsletters_col = db['newsletters']

def init_db_indexes():
    """Creates indexes for collections to ensure constraints and speed up queries."""
    try:
        admins_col.create_index("email", unique=True)
        volunteers_col.create_index("email", unique=True)
        volunteers_col.create_index("volunteer_id", unique=True)
        donations_col.create_index("donation_id", unique=True)
        newsletters_col.create_index("email", unique=True)
        logger.info("MongoDB indexes created successfully.")
    except Exception as e:
        logger.warning("Could not create database indexes: %s", e)
