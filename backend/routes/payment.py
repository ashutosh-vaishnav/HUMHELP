from flask import Blueprint, request, jsonify
import razorpay
from config import Config
import random

payment_bp = Blueprint('payment', __name__)

# Initialize Razorpay Client if keys are configured
razorpay_client = None
if Config.RAZORPAY_KEY_ID and Config.RAZORPAY_KEY_SECRET:
    try:
        razorpay_client = razorpay.Client(auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET))
    except Exception as e:
        print(f"Razorpay Client failed to initialize: {e}")

@payment_bp.route('/create', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    try:
        amount_rupees = float(data.get('amount', 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Amount must be a valid number"}), 400

    if amount_rupees <= 0:
        return jsonify({"success": False, "message": "Amount must be greater than zero"}), 400

    amount_paise = int(amount_rupees * 100)
    currency = "INR"
    
    # Use real Razorpay SDK if client is initialized
    if razorpay_client:
        try:
            order_data = {
                'amount': amount_paise,
                'currency': currency,
                'payment_capture': 1
            }
            razorpay_order = razorpay_client.order.create(data=order_data)
            return jsonify({
                "success": True,
                "is_mock": False,
                "data": {
                    "order_id": razorpay_order['id'],
                    "amount": razorpay_order['amount'],
                    "currency": razorpay_order['currency'],
                    "key_id": Config.RAZORPAY_KEY_ID
                }
            })
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Razorpay order creation failed: {str(e)}"
            }), 500
    else:
        # Fallback to simulated test flow order
        mock_order_id = f"order_mock_{random.randint(100000, 999999)}"
        return jsonify({
            "success": True,
            "is_mock": True,
            "data": {
                "order_id": mock_order_id,
                "amount": amount_paise,
                "currency": currency,
                "key_id": "rzp_test_mockkey123"
            }
        })

@payment_bp.route('/verify', methods=['POST'])
def verify_payment():
    data = request.get_json() or {}
    razorpay_order_id = data.get('razorpay_order_id', '').strip()
    razorpay_payment_id = data.get('razorpay_payment_id', '').strip()
    razorpay_signature = data.get('razorpay_signature', '').strip()
    is_mock = data.get('is_mock', False)

    if not razorpay_order_id or not razorpay_payment_id:
        return jsonify({"success": False, "message": "Order ID and Payment ID are required"}), 400

    # If it is mock or we have no configured keys, accept mock transaction
    if is_mock or not razorpay_client:
        if razorpay_order_id.startswith("order_mock_"):
            simulated_pay_id = f"pay_mock_{random.randint(100000, 999999)}"
            return jsonify({
                "success": True,
                "message": "Simulated payment verified successfully",
                "payment_id": simulated_pay_id
            })
        return jsonify({"success": False, "message": "Invalid simulated order reference"}), 400

    # Real Razorpay verification
    try:
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        return jsonify({
            "success": True,
            "message": "Payment signature verified successfully",
            "payment_id": razorpay_payment_id
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Signature verification failed: {str(e)}"
        }), 400
