from flask import Flask
from flask_cors import CORS
from database.db_connection import Base, engine
from routes.product_routes import product_routes
from routes.supplier_routes import supplier_routes


def create_app():
    """
    Create and configure the Flask application
    """
    # Create Flask app
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Create database tables
    Base.metadata.create_all(bind=engine)

    # Register Routes
    app.register_blueprint(product_routes, url_prefix="/api")
    app.register_blueprint(supplier_routes, url_prefix="/api")

    return app


# Create app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
