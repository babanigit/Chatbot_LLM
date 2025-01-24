from flask import Blueprint, jsonify, request
from database.db_connection import get_db
from models.supplier import Supplier

supplier_routes = Blueprint('supplier_routes', __name__)

@supplier_routes.route('/suppliers', methods=['GET'])
def get_all_suppliers():
    """
    Retrieve all suppliers
    """
    db = next(get_db())
    
    try:
        suppliers = db.query(Supplier).all()
        return jsonify([supplier.to_dict() for supplier in suppliers]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@supplier_routes.route('/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier_by_id(supplier_id):
    """
    Retrieve a specific supplier by ID
    """
    db = next(get_db())
    
    try:
        supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
        
        if not supplier:
            return jsonify({"error": "Supplier not found"}), 404
        
        return jsonify(supplier.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()