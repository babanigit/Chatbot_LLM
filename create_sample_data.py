from sqlalchemy.orm import Session
from database.db_connection import engine
from models.supplier import Supplier
from models.product import Product

# Create the tables in the database
from database.db_connection import Base
Base.metadata.create_all(bind=engine)

# Sample data for Suppliers and Products
def create_sample_data():
    session = Session(bind=engine)

    # Create sample suppliers
    supplier1 = Supplier(
        name="TechSupply Co.",
        contact_info="techsupply@example.com, +123456789",
        product_categories="Electronics, Gadgets"
    )
    supplier2 = Supplier(
        name="HomeGoods Supplier",
        contact_info="homegoods@example.com, +987654321",
        product_categories="Furniture, Kitchenware"
    )

    # Add suppliers to the session
    session.add_all([supplier1, supplier2])
    session.commit()

    # Create sample products
    product1 = Product(
        name="Wireless Headphones",
        brand="SoundMax",
        price=89.99,
        category="Electronics",
        description="Noise-cancelling over-ear headphones.",
        supplier_id=supplier1.id  # Assign supplier1 to product1
    )
    product2 = Product(
        name="Smartphone Stand",
        brand="FlexiHold",
        price=19.99,
        category="Accessories",
        description="Adjustable smartphone stand.",
        supplier_id=supplier1.id  # Assign supplier1 to product2
    )
    product3 = Product(
        name="Wooden Dining Table",
        brand="HomeCraft",
        price=299.99,
        category="Furniture",
        description="Solid wood dining table, seats 6.",
        supplier_id=supplier2.id  # Assign supplier2 to product3
    )
    product4 = Product(
        name="Non-stick Frying Pan",
        brand="ChefMate",
        price=29.99,
        category="Kitchenware",
        description="Durable non-stick frying pan with heat-resistant handle.",
        supplier_id=supplier2.id  # Assign supplier2 to product4
    )

    # Add products to the session
    session.add_all([product1, product2, product3, product4])
    session.commit()

    # Close the session
    session.close()

    print("Sample data has been successfully added to the database!")

# Call the function to populate the database with sample data
if __name__ == "__main__":
    create_sample_data()
