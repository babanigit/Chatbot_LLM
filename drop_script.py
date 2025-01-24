from database.db_connection import Base, engine

# Drop all tables
Base.metadata.drop_all(bind=engine)

# Recreate tables
Base.metadata.create_all(bind=engine)

print("Database schema updated. All tables recreated.")
