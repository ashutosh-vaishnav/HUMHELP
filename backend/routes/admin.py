from flask import Blueprint, jsonify
from models.db import donations_col, volunteers_col, causes_col, contacts_col
from utils.auth_helper import token_required
import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard_stats():
    # 1. Total donations and amount (only success payments)
    donation_pipeline = [
        {"$match": {"payment_status": "success"}},
        {"$group": {
            "_id": None,
            "total_amount": {"$sum": "$amount"},
            "total_count": {"$sum": 1}
        }}
    ]
    donation_stats = list(donations_col.aggregate(donation_pipeline))
    total_donation_amount = float(donation_stats[0]['total_amount']) if donation_stats else 0.0
    total_donations_count = int(donation_stats[0]['total_count']) if donation_stats else 0

    # 2. Total volunteers
    total_volunteers = volunteers_col.count_documents({})
    pending_volunteers = volunteers_col.count_documents({"status": "pending"})
    approved_volunteers = volunteers_col.count_documents({"status": "approved"})

    # 3. Causes
    total_causes = causes_col.count_documents({})
    active_causes = causes_col.count_documents({"status": "active"})

    # 4. Contact messages
    total_messages = contacts_col.count_documents({})
    new_messages = contacts_col.count_documents({"status": "new"})

    # --- Charts Aggregations ---

    # A. Donations by category
    category_pipeline = [
        {"$match": {"payment_status": "success"}},
        {"$group": {
            "_id": "$category",
            "amount": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"amount": -1}}
    ]
    category_stats = list(donations_col.aggregate(category_pipeline))
    donations_by_category = [{"category": item["_id"], "amount": float(item["amount"]), "count": int(item["count"])} for item in category_stats]

    # B. Donations over time (past 12 months)
    time_pipeline = [
        {"$match": {"payment_status": "success"}},
        {"$group": {
            "_id": {
                "year": {"$year": "$created_at"},
                "month": {"$month": "$created_at"}
            },
            "amount": {"$sum": "$amount"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    time_stats = list(donations_col.aggregate(time_pipeline))
    donations_by_month = []
    for item in time_stats:
        year = int(item["_id"]["year"])
        month = int(item["_id"]["month"])
        try:
            month_name = datetime.date(year, month, 1).strftime("%b %Y")
        except Exception:
            month_name = f"{month}/{year}"
        donations_by_month.append({
            "label": month_name,
            "amount": float(item["amount"])
        })

    # C. Campaign Progress
    campaigns = list(causes_col.find({"status": "active"}, {"title": 1, "target_amount": 1, "raised_amount": 1}))
    campaign_progress = [{
        "title": c.get("title", ""),
        "target": float(c.get("target_amount", 0)),
        "raised": float(c.get("raised_amount", 0)),
        "percentage": min(100, int((float(c.get("raised_amount", 0)) / max(1, float(c.get("target_amount", 1)))) * 100))
    } for c in campaigns]

    # D. Volunteer interest statistics
    interest_pipeline = [
        {"$unwind": "$interests"},
        {"$group": {
            "_id": "$interests",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}}
    ]
    interest_stats = list(volunteers_col.aggregate(interest_pipeline))
    volunteers_by_interest = [{"interest": item["_id"], "count": int(item["count"])} for item in interest_stats]

    return jsonify({
        "success": True,
        "data": {
            "overview": {
                "total_donation_amount": total_donation_amount,
                "total_donations_count": total_donations_count,
                "total_volunteers": total_volunteers,
                "pending_volunteers": pending_volunteers,
                "approved_volunteers": approved_volunteers,
                "total_causes": total_causes,
                "active_causes": active_causes,
                "total_messages": total_messages,
                "new_messages": new_messages
            },
            "charts": {
                "donations_by_category": donations_by_category,
                "donations_by_month": donations_by_month,
                "campaign_progress": campaign_progress,
                "volunteers_by_interest": volunteers_by_interest
            }
        }
    })
