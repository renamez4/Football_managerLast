
from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

# สร้าง Blueprint ชื่อ 'auth'
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    API สำหรับสมัครสมาชิก
    รับค่า: username, email, password, phone (Optional)
    """
    data = request.get_json()
    
    # ตรวจสอบว่ามีข้อมูลครบไหม
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "กรุณากรอกข้อมูลให้ครบถ้วน"}), 400
    
    # ตรวจสอบว่าชื่อผู้ใช้ซ้ำไหม
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"}), 400

    # ตรวจสอบว่าอีเมลซ้ำไหม
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "อีเมลนี้ถูกใช้งานแล้ว"}), 400

    # สร้าง User ใหม่
    # TODO: ในการใช้งานจริง ต้องเข้ารหัส Password ด้วย (เช่น bcrypt) แต่ตอนนี้ใส่แบบ Plain text ไปก่อนเพื่อความง่ายในการทดสอบ
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=data['password'], # จำไว้: ควร Hashing ก่อนเก็บ
        phone=data.get('phone')
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "สมัครสมาชิกสำเร็จ"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    API สำหรับเข้าสู่ระบบ
    รับค่า: username, password
    คืนค่า: JWT Token สำหรับใช้ยืนยันตัวตน
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # ค้นหา User ตาม Username
    user = User.query.filter_by(username=username).first()

    # ตรวจสอบว่ามี User และรหัสผ่านถูกต้อง (แบบง่าย)
    if not user or user.password_hash != password:
        return jsonify({"message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}), 401

    # สร้าง Access Token (อายุ 7 วัน)
    access_token = create_access_token(identity=str(user.id), expires_delta=datetime.timedelta(days=7))

    return jsonify({
        "message": "เข้าสู่ระบบสำเร็จ",
        "token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """
    API สำหรับดึงข้อมูลตัวเอง (ต้องแนบ Token มาด้วย)
    """
    # ดึง User ID จาก Token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "ไม่พบผู้ใช้งาน"}), 404

    return jsonify(user.to_dict()), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    """
    API สำหรับแก้ไขข้อมูลส่วนตัว
    รับค่า: email, phone, profileImage (Optional)
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "ไม่พบผู้ใช้งาน"}), 404

    data = request.get_json()

    # อัปเดตข้อมูล (ถ้ามีส่งมา)
    if 'email' in data:
        # ตรวจสอบอีเมลซ้ำ (ถ้าเปลี่ยนอีเมล)
        if data['email'] != user.email:
             if User.query.filter_by(email=data['email']).first():
                 return jsonify({"message": "อีเมลนี้ถูกใช้งานแล้ว"}), 400
        user.email = data['email']
    
    if 'phone' in data:
        user.phone = data['phone']

    if 'profileImage' in data:
        # Handle Base64 Upload
        if data['profileImage'].startswith('data:image'):
            try:
                import base64
                import os
                import uuid

                # Format: "data:image/png;base64,iVBORw0KGgoAAA..."
                header, encoded = data['profileImage'].split(",", 1)
                ext = header.split(';')[0].split('/')[1]
                
                # Create uploads directory if not exists
                # Assuming auth_bp is in routes/, so root_path/.. points to backend/
                upload_folder = os.path.join(auth_bp.root_path, '..', 'static', 'uploads')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)

                filename = f"user_{user.id}_{uuid.uuid4()}.{ext}"
                file_path = os.path.join(upload_folder, filename)

                with open(file_path, "wb") as f:
                    f.write(base64.b64decode(encoded))
                
                # Save URL to DB
                # CAUTION: Hardcoded localhost URL. In prod use relative or env var.
                user.profile_image = f"http://127.0.0.1:5000/static/uploads/{filename}"
            except Exception as e:
                print(f"Error saving profile image: {e}")
                # Don't update if failed
        else:
            # Assume it's a URL or clear
            user.profile_image = data['profileImage']

    if 'password' in data and data['password']:
        # TODO: Encrypt password in production
        user.password_hash = data['password']

    try:
        db.session.commit()
        return jsonify({
            "message": "อัปเดตข้อมูลสำเร็จ",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"เกิดข้อผิดพลาด: {str(e)}"}), 500
