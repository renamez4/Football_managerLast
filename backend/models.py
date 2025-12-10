
from extensions import db

# ตารางเชื่อมนักกีฬากับทีม (Many-to-Many)
team_members = db.Table('team_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('teams.id'), primary_key=True)
)

class User(db.Model):
    """
    ตารางเก็บข้อมูลผู้ใช้งาน (Users)
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)  # รหัสประจำตัว (Auto)
    username = db.Column(db.String(80), unique=True, nullable=False) # ชื่อผู้ใช้ (ห้ามซ้ำ)
    email = db.Column(db.String(120), unique=True, nullable=False) # อีเมล (ห้ามซ้ำ)
    password_hash = db.Column(db.String(255), nullable=False) # รหัสผ่าน (เข้ารหัสแล้ว)
    phone = db.Column(db.String(20)) # เบอร์โทรศัพท์
    profile_image = db.Column(db.Text) # ลิงก์รูปโปรไฟล์ หรือ Base64

    # ความสัมพันธ์: User 1 คน เป็นเจ้าของทีมได้หลายทีม
    teams_owned = db.relationship('Team', backref='owner', lazy=True)
    
    # ความสัมพันธ์: User 1 คน อยู่ได้หลายทีม (และทีมหนึ่งมีได้หลายคน)
    teams_joined = db.relationship('Team', secondary=team_members, lazy='subquery',
        backref=db.backref('members', lazy=True))

    def to_dict(self):
        """แปลงข้อมูล User เป็น Dictionary เพื่อส่งกลับไปให้หน้าเว็บ"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'profileImage': self.profile_image,
            'history': [h.to_dict() for h in self.history]
        }

class Team(db.Model):
    """
    ตารางเก็บข้อมูลทีมกีฬา (Teams)
    """
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True) # รหัสทีม
    name = db.Column(db.String(100), nullable=False) # ชื่อทีม
    logo = db.Column(db.String(255)) # โลโก้ทีม
    time = db.Column(db.String(50)) # เวลาแข่ง
    details = db.Column(db.Text) # รายละเอียด
    max_players = db.Column(db.Integer, default=0) # รับสมัครกี่คน
    status = db.Column(db.String(20), default='Open') # สถานะ (Open/Full)
    positions = db.Column(db.Text) # เก็บข้อมูลตำแหน่ง (JSON String)
    match_records = db.Column(db.Text, default='{}') # เก็บสถิติผลการแข่ง {'wins':0, 'losses':0, 'draws':0}
    
    # ใครเป็นคนสร้างทีมนี้ (Foreign Key)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        """แปลงข้อมูล Team เป็น Dictionary"""
        pos_dict = eval(self.positions) if self.positions else {}
        match_stats = eval(self.match_records) if self.match_records else {'wins': 0, 'losses': 0, 'draws': 0}
        
        # Calculate counts
        total_starters = sum(1 for k in pos_dict.keys() if not k.startswith('sub'))
        total_subs = sum(1 for k in pos_dict.keys() if k.startswith('sub'))
        filled_starters = sum(1 for k, v in pos_dict.items() if not k.startswith('sub') and v.get('player'))
        filled_subs = sum(1 for k, v in pos_dict.items() if k.startswith('sub') and v.get('player'))

        return {
            'id': self.id,
            'name': self.name,
            'logo': self.logo,
            'time': self.time,
            'details': self.details,
            'owner': self.owner.username if self.owner else None,
            'players': self.max_players, # Total slots
            'currentPlayers': filled_starters + filled_subs,
            'status': self.status,
            'members': [{
                'username': member.username,
                'email': member.email,
                'phone': member.phone
            } for member in self.members],
            'positions': pos_dict,
            # Helper counts for UI
            'stats': {
                'starters': {'filled': filled_starters, 'total': total_starters or 11},
                'subs': {'filled': filled_subs, 'total': total_subs or 5}
            },
            'matchStats': match_stats
        }

class TeamHistory(db.Model):
    """
    ตารางเก็บประวัติการย้ายทีม (History)
    """
    __tablename__ = 'team_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    team_name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(50)) # ตำแหน่งที่เคยเล่น
    left_date = db.Column(db.DateTime, default=db.func.current_timestamp()) # วันที่ออก
    match_stats = db.Column(db.Text, default='{"wins": 0, "draws": 0, "losses": 0}') # สถิติตอนที่อยู่

    # Link back to user
    user = db.relationship('User', backref=db.backref('history', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'teamName': self.team_name,
            'position': self.position,
            'leftDate': self.left_date.isoformat(),
            'matchStats': eval(self.match_stats) if self.match_stats else {'wins': 0, 'draws': 0, 'losses': 0}
        }
