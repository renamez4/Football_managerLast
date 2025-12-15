
from app import app
from extensions import db
from models import MatchHistory

with app.app_context():
    db.create_all()
    print("Database tables created successfully.")
