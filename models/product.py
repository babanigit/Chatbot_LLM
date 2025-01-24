from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.db_connection import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String)
    price = Column(Float)
    category = Column(String)
    description = Column(String)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))

    # Relationship with Supplier
    supplier = relationship("Supplier", back_populates="products")

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "price": self.price,
            "category": self.category,
            "description": self.description,
            "supplier_id": self.supplier_id,
        }
