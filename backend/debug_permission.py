
from app import create_app
from extensions import db
from models import Team, User

app = create_app()

with app.app_context():


    users = User.query.filter_by(username='myname').all()
    print(f"COUNT: {len(users)}")
    for u in users:
        print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}")


