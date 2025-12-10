
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# สร้าง object สำหรับจัดการ Database
db = SQLAlchemy()

# สร้าง object สำหรับจัดการการเปลี่ยนโครงสร้าง Database (Migration)
migrate = Migrate()

# สร้าง object สำหรับจัดการระบบ Login (JWT)
jwt = JWTManager()
