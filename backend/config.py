
import os

class Config:
    # สำหรับ XAMPP ที่ไม่มีรหัสผ่าน ให้ใช้แบบนี้ครับ:
    # mysql+mysqlconnector://root:@localhost/ชื่อฐานข้อมูล
    
    # ผมแก้ให้เลยครับ: ใช้ root และ ไม่ใส่รหัสผ่าน (หลัง : ว่างไว้)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+mysqlconnector://root:@localhost/football_manager'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret key for JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-key-change-this'
