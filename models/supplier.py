from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from database.db_connection import Base

class Supplier(Base):
    __tablename__ = 'suppliers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    contact_info = Column(Text, nullable=True)
    product_categories = Column(Text, nullable=True)

    # Relationship with Products
    products = relationship("Product", back_populates="supplier")

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'contact_info': self.contact_info,
            'product_categories': self.product_categories
        }