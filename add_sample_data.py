from sqlalchemy.orm import Session
from database.db_connection import engine, SessionLocal
from models.supplier import Supplier
from models.product import Product

def add_sample_data():
    """
    Populate database with sample suppliers and products
    """
    # Create a new database session
    db: Session = SessionLocal()

    try:
        # Clear existing data
        db.query(Product).delete()
        db.query(Supplier).delete()

        # Create Suppliers
        suppliers = [
            Supplier(
                name="TechGiant Electronics", 
                contact_info="contact@techgiant.com", 
                product_categories="Laptops, Smartphones, Tablets"
            ),
            Supplier(
                name="Global Computing", 
                contact_info="sales@globalcomputing.com", 
                product_categories="Desktops, Servers, Workstations"
            ),
            Supplier(
                name="Mobile World", 
                contact_info="support@mobileworld.com", 
                product_categories="Smartphones, Accessories"
            )
        ]

        # Add suppliers to the session
        db.add_all(suppliers)
        db.commit()

        # Create Products
        products = [
            Product(
                name="UltraBook Pro X1", 
                brand="TechGiant", 
                price=1299.99, 
                category="Laptop",
                description="High-performance ultrabook with latest Intel processor",
                supplier_id=suppliers[0].id
            ),
            Product(
                name="SmartPhone Elite", 
                brand="MobileMax", 
                price=799.99, 
                category="Smartphone",
                description="Advanced smartphone with quad-camera setup",
                supplier_id=suppliers[2].id
            ),
            Product(
                name="PowerDesk 5000", 
                brand="GlobalTech", 
                price=1499.99, 
                category="Desktop",
                description="Powerful desktop for professional workloads",
                supplier_id=suppliers[1].id
            )
        ]

        # Add products to the session
        db.add_all(products)
        db.commit()

        print("Sample data added successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error adding sample data: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if not exists
    from database.db_connection import Base
    Base.metadata.create_all(bind=engine)
    
    # Add sample data
    add_sample_data()