from app import create_app
from extensions import db
from sqlalchemy import text

def add_column():
    app = create_app()
    with app.app_context():
        # Execute raw SQL to alter table
        with db.engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE teams ADD COLUMN match_records TEXT DEFAULT '{}';"))
                print("Added match_records column successfully")
            except Exception as e:
                print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    add_column()
