import sys
import os
import datetime
import random

# Add current folder to path to resolve imports when running directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.db import causes_col, stories_col, volunteers_col, donations_col

def seed():
    print("=" * 45)
    print("   HUMHELP NGO - Database Seeding Utility")
    print("=" * 45)
    
    # 1. Clear existing seed data (only clear dynamic data we seed)
    causes_col.delete_many({})
    stories_col.delete_many({})
    volunteers_col.delete_many({})
    donations_col.delete_many({})
    
    print("Cleared existing Causes, Stories, Volunteers, and Donations.")

    # 2. Seed Causes
    causes = [
        {
            "title": "Primary Education for Rural Children",
            "description": "Provide school books, stationery, uniforms, and digital tablets to children in underprivileged rural schools to keep them engaged in learning and prevent dropout rates.",
            "category": "Education",
            "target_amount": 150000.0,
            "raised_amount": 45000.0,
            "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=60)
        },
        {
            "title": "Clean Water Filtration Facilities",
            "description": "Establish community-owned solar-powered water filtration plants in saline water affected areas, providing thousands with safe drinking water and stopping waterborne illnesses.",
            "category": "Clean Water",
            "target_amount": 120000.0,
            "raised_amount": 90000.0,
            "image": "https://images.unsplash.com/photo-1548858860-822852dec49b?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=50)
        },
        {
            "title": "Daily Community Food Distribution Kitchen",
            "description": "Support our community kitchen feeding daily wage earners, homeless people, and families in poverty. A small help guarantees a nutritious, hot meal.",
            "category": "Food & Hunger",
            "target_amount": 80000.0,
            "raised_amount": 35000.0,
            "image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=40)
        },
        {
            "title": "Rural Mobile Medical Clinics",
            "description": "Funding free healthcare clinics, primary health checkups, and necessary medicines to remote rural regions lacking basic hospital infrastructure.",
            "category": "Healthcare",
            "target_amount": 200000.0,
            "raised_amount": 65000.0,
            "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=35)
        },
        {
            "title": "Tailoring & Handloom Skills for Women",
            "description": "Provide training in tailoring, embroidery, and handloom work to rural women, empowering them to become financially self-sufficient and start local enterprises.",
            "category": "Women Empowerment",
            "target_amount": 100000.0,
            "raised_amount": 75000.0,
            "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=30)
        },
        {
            "title": "Disaster Relief Essential Packets",
            "description": "Provide immediate aid kits containing dry food, tarpaulins, clothes, and basic hygiene products to families affected by sudden flood and rain disasters.",
            "category": "Disaster Relief",
            "target_amount": 250000.0,
            "raised_amount": 120000.0,
            "image": "https://images.unsplash.com/photo-1469571486040-7a9b13de3d67?w=800",
            "status": "active",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=20)
        }
    ]
    
    inserted_causes = causes_col.insert_many(causes)
    cause_ids = inserted_causes.inserted_ids
    print(f"Seeded {len(cause_ids)} Causes.")

    # 3. Seed Success Stories
    stories = [
        {
            "title": "Anjali's Journey Back to School",
            "description": "Anjali was about to drop out of 7th grade due to financial constraints. Thanks to our education kits program, she received books, uniforms, and a local sponsor. Today, she is the class topper and dreams of becoming a doctor.",
            "category": "Education",
            "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
            "status": "published",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=45)
        },
        {
            "title": "Pure Water Flows in Sundarbans Villages",
            "description": "For years, drinking saline water caused severe kidney diseases in Rampur village. Our team installed a reverse-osmosis filtration unit. Now, 300+ families have daily access to clean, sweet water.",
            "category": "Clean Water",
            "image": "https://images.unsplash.com/photo-1548858860-822852dec49b?w=800",
            "status": "published",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=30)
        },
        {
            "title": "Self-Reliance Through Skill Centers",
            "description": "Rehana, a mother of two, completed our 6-month sewing machine training program. She has opened a small boutique in her house and earns an independent income of ₹8,000 per month, supporting her children's schooling.",
            "category": "Women Empowerment",
            "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            "status": "published",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=15)
        }
    ]
    stories_col.insert_many(stories)
    print(f"Seeded {len(stories)} Success Stories.")

    # 4. Seed Volunteers
    volunteers = [
        {
            "volunteer_id": "VOL-874211",
            "name": "Amit Sharma",
            "email": "amit.sharma@example.com",
            "phone": "9876543210",
            "age": 24,
            "city": "Mumbai",
            "skills": ["Teaching", "Communication", "English"],
            "interests": ["Education", "Social Media"],
            "availability": "weekends",
            "reason": "I want to teach underprivileged kids during my free weekend hours to make an impact on their lives.",
            "status": "approved",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=25)
        },
        {
            "volunteer_id": "VOL-325987",
            "name": "Pooja Patel",
            "email": "pooja.patel@example.com",
            "phone": "9812345678",
            "age": 22,
            "city": "Ahmedabad",
            "skills": ["Management", "Public Relations"],
            "interests": ["Healthcare", "Event Management"],
            "availability": "flexible",
            "reason": "Helping organize medical camps gives me peace of mind and allows me to give back to the society.",
            "status": "approved",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=18)
        },
        {
            "volunteer_id": "VOL-105648",
            "name": "Rohan Deshmukh",
            "email": "rohan.desh@example.com",
            "phone": "9765432109",
            "age": 28,
            "city": "Pune",
            "skills": ["Web Development", "Social Media Marketing"],
            "interests": ["Technology", "Fundraising"],
            "availability": "weekdays",
            "reason": "I want to use my software engineering and marketing skills to help build digital platforms for charity events.",
            "status": "pending",
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=5)
        }
    ]
    volunteers_col.insert_many(volunteers)
    print(f"Seeded {len(volunteers)} Volunteers.")

    # 5. Seed Donations (dates range across months for admin charts verification)
    donors = [
        ("Rahul Mehta", "rahul.mehta@example.com", 2500, "Education", 90),
        ("Suresh Nair", "suresh.nair@example.com", 5000, "Clean Water", 75),
        ("Komal Shah", "komal.shah@example.com", 1000, "Food & Hunger", 60),
        ("Dr. Alok Verma", "alok.verma@example.com", 10000, "Healthcare", 45),
        ("Meena Kumari", "meena.k@example.com", 2500, "Women Empowerment", 35),
        ("Anonymous", "donor@example.com", 500, "Education", 25),
        ("Vikram Singh", "vikram.s@example.com", 15000, "Disaster Relief", 18),
        ("Anita Desai", "anita@example.com", 2000, "Clean Water", 10),
        ("Rajesh Gupta", "rajesh.gupta@example.com", 1000, "Food & Hunger", 5),
        ("Sneha Patil", "sneha.patil@example.com", 3000, "Healthcare", 2)
    ]
    
    donations = []
    for name, email, amt, cat, days_ago in donors:
        don_id = f"DON-{random.randint(100000, 999999)}"
        pay_id = f"pay_mock_{random.randint(100000, 999999)}"
        ord_id = f"order_mock_{random.randint(100000, 999999)}"
        
        # Link to seeded cause
        matching_cause = causes_col.find_one({"category": cat})
        c_id = matching_cause['_id'] if matching_cause else None
        
        donation_doc = {
            "donation_id": don_id,
            "donor_name": "Anonymous" if name == "Anonymous" else name,
            "email": email,
            "phone": "9876543210",
            "category": cat,
            "amount": float(amt),
            "anonymous": name == "Anonymous",
            "message": "Keep up the good work!" if name != "Anonymous" else "",
            "payment_id": pay_id,
            "payment_status": "success",
            "order_id": ord_id,
            "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=days_ago)
        }
        if c_id:
            donation_doc["cause_id"] = c_id
            
        donations.append(donation_doc)

    donations_col.insert_many(donations)
    print(f"Seeded {len(donations)} Donations.")
    print("=" * 45)
    print("   Seeding completed successfully.")

if __name__ == '__main__':
    seed()
