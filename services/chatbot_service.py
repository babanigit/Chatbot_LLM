from sqlalchemy.orm import Session
from models.product import Product
from models.supplier import Supplier
from services.llm_service import LLMService
import re

class ChatbotService:
    def __init__(self, db: Session):
        self.db = db
        self.llm_service = LLMService()

    def process_query(self, query: str):
        """
        Process user query and return relevant results

        :param query: User's natural language query
        :return: Processed results
        """
        # Basic query parsing (can be enhanced with NLP techniques)
        query = query.lower()

        # Clean the query
        query = query.strip()  # Remove leading/trailing whitespace
        query = re.sub(r"[?!.]+$", "", query)  # Remove trailing punctuation (?, !, .)

        if "products under brand" in query:
            brand = query.split("brand")[-1].strip()
            print("after split - ", brand)
            return self._get_products_by_brand(brand)

        elif "suppliers provide" in query:
            category = query.split("provide")[-1].strip()
            print("after split - ", category)
            return self._get_suppliers_by_category(category)

        elif "details of product" in query:
            product_name = query.split("product")[-1].strip()
            print("after split - ", product_name)
            return self._get_product_details(product_name)

        return {"error": "Could not understand the query"}

    def _get_products_by_brand(self, brand):
        """Fetch products by brand"""
        products = (
            self.db.query(Product).filter(Product.brand.ilike(f"%{brand}%")).all()
        )
        results = [product.to_dict() for product in products]

        # Add LLM summary
        summary = self.llm_service.generate_summary(
            f"Products under {brand} brand: {str(results)}"
        )

        return {"products": results, "summary": summary}

    def _get_suppliers_by_category(self, category):
        """Fetch suppliers by product category"""
        suppliers = (
            self.db.query(Supplier)
            .filter(Supplier.product_categories.ilike(f"%{category}%"))
            .all()
        )
        results = [supplier.to_dict() for supplier in suppliers]

        # Add LLM summary
        summary = self.llm_service.generate_summary(
            f"Suppliers providing {category}: {str(results)}"
        )

        return {"suppliers": results, "summary": summary}

    def _get_product_details(self, product_name):
        """Fetch specific product details"""
        product = (
            self.db.query(Product)
            .filter(Product.name.ilike(f"%{product_name}%"))
            .first()
        )

        if not product:
            return {"error": "Product not found"}

        product_details = product.to_dict()
        supplier_details = product.supplier.to_dict()

        # Add LLM summary
        summary = self.llm_service.generate_summary(
            f"Product details: {str(product_details)}"
        )

        return {
            "product": product_details,
            "supplier": supplier_details,
            "summary": summary,
        }
