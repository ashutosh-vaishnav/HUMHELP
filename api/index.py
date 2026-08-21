import sys
import os

# Add the parent directory and backend directory to sys.path so Flask imports work correctly on Vercel
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.app import app
