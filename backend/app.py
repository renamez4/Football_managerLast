
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, jwt
from routes.auth import auth_bp
from routes.teams import teams_bp

def create_app():
    # สร้าง Flask App Instance
    app = Flask(__name__)
    
    # โหลดค่า Config จากไฟล์ config.py
    app.config.from_object(Config)

    # เริ่มต้นการทำงานของ Extensions ต่างๆ
    db.init_app(app)      # เริ่มระบบ Database
    migrate.init_app(app, db) # เริ่มระบบ Migration
    jwt.init_app(app)     # เริ่มระบบ Login

    # อนุญาตให้หน้าเว็บ (Frontend) เรียกใช้ API ได้ (CORS)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # ลงทะเบียน Blueprint (Routes)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(teams_bp, url_prefix='/api/teams')

    @app.route('/')
    def index():
        return {"message": "Sport Manager Backend API is running!"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
