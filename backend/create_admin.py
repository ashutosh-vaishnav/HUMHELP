import sys
import os
import getpass
import datetime

# Add current folder to path to resolve imports when running directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.db import admins_col
from utils.auth_helper import hash_password

def create_admin_cli():
    print("=" * 40)
    print("   HUMHELP NGO - Create Admin CLI")
    print("=" * 40)
    
    name = input("Enter Name: ").strip()
    email = input("Enter Email: ").strip().lower()
    
    if not name or not email:
        print("Error: Name and Email are required fields.")
        return

    # Check for duplicate
    existing = admins_col.find_one({"email": email})
    if existing:
        print(f"Error: An admin with email '{email}' already exists.")
        return

    # Read password securely
    password = getpass.getpass("Enter Password: ")
    confirm_password = getpass.getpass("Confirm Password: ")

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    if len(password) < 6:
        print("Error: Password must be at least 6 characters.")
        return

    password_hash = hash_password(password)
    
    admin = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "role": "admin",
        "created_at": datetime.datetime.utcnow()
    }
    
    try:
        admins_col.insert_one(admin)
        print(f"\nSuccess: Admin account '{name}' ({email}) created successfully.")
    except Exception as e:
        print(f"\nError: Could not write admin to database: {e}")

if __name__ == '__main__':
    create_admin_cli()
