from flask import Blueprint, jsonify, request
from database.db_connection import get_db
from services.chatbot_service import ChatbotService
from typing import List

product_routes = Blueprint("product_routes", __name__)


@product_routes.route("/query", methods=["POST"])
def process_query():
    """
    Process user query for products and suppliers
    """
    # Get database session
    db = next(get_db())

    try:
        # Get query from request
        data = request.get_json()

        query = data.get("query", "").strip()

        if not query:
            return jsonify({"error": "No query provided"}), 400

        # Initialize chatbot service
        chatbot_service = ChatbotService(db)

        # Process query
        result = chatbot_service.process_query(query)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
