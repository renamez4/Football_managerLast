
from flask import Blueprint, request, jsonify
from extensions import db
from models import Team, User, team_members, TeamHistory

from flask_jwt_extended import jwt_required, get_jwt_identity
import json

# สร้าง Blueprint ชื่อ 'teams'
teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/', methods=['GET'], strict_slashes=False)
def get_teams():
    """
    API สำหรับดึงรายชื่อทีมทั้งหมด
    """
    teams = Team.query.all()
    # Handle DB entries that might not have positions (legacy)
    result = []
    result = []
    for team in teams:


        t_dict = team.to_dict()
        if not t_dict.get('positions'): 
            t_dict['positions'] = {}
        result.append(t_dict)
    return jsonify(result), 200

@teams_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_team():
    """
    API สำหรับสร้างทีมใหม่ (ต้อง Login)
    รับค่า: name, time, details, max_players, logo, starterNames, substituteNames
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get('name'):
        return jsonify({"message": "กรุณาระบุชื่อทีม"}), 400

    # สร้างโครงสร้าง positions
    positions = {}
    starter_names = data.get('starterNames', [])
    sub_names = data.get('substituteNames', [])

    for i, name in enumerate(starter_names):
        positions[f"starter{i}"] = { "name": name, "player": None }
    
    for i, name in enumerate(sub_names):
        positions[f"sub{i}"] = { "name": name, "player": None }

    # Handle Logo Upload (Base64 -> File)
    logo_path = None
    if data.get('logo') and data['logo'].startswith('data:image'):
        try:
            import base64
            import os
            import uuid

            # Format: "data:image/png;base64,iVBORw0KGgoAAA..."
            header, encoded = data['logo'].split(",", 1)
            ext = header.split(';')[0].split('/')[1]
            
            # Create uploads directory if not exists
            upload_folder = os.path.join(teams_bp.root_path, '..', 'static', 'uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)

            filename = f"{uuid.uuid4()}.{ext}"
            file_path = os.path.join(upload_folder, filename)

            with open(file_path, "wb") as f:
                f.write(base64.b64decode(encoded))
            
            logo_path = f"http://127.0.0.1:5000/static/uploads/{filename}"
        except Exception as e:
            print(f"Error saving logo: {e}")
            logo_path = None # Fail gracefully or fallback
            
    new_team = Team(
        name=data['name'],
        time=data.get('time'),
        details=data.get('details'),
        max_players=len(starter_names) + len(sub_names), # Override max_players with total slots
        logo=logo_path,
        owner_id=current_user_id,
        status='Open',
        positions=str(positions) # Store as string because we used Text type (eval in model relies on python dict string repr)
    )

    db.session.add(new_team)
    db.session.commit()

    return jsonify(new_team.to_dict()), 201

@teams_bp.route('/<int:team_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def update_team(team_id):
    """
    API สำหรับแก้ไขข้อมูลทีม
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"message": "ไม่พบทีม"}), 404
        
    if team.owner_id != current_user_id:
        return jsonify({"message": "คุณไม่มีสิทธิ์แก้ไขทีมนี้"}), 403

    # Update Basic Info
    if 'name' in data: team.name = data['name']
    if 'time' in data: team.time = data['time']
    if 'details' in data: team.details = data['details']
    
    # Update Logo
    if data.get('logo') and data['logo'].startswith('data:image'):
        try:
            import base64
            import os
            import uuid
            
            header, encoded = data['logo'].split(",", 1)
            ext = header.split(';')[0].split('/')[1]
            
            upload_folder = os.path.join(teams_bp.root_path, '..', 'static', 'uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)

            filename = f"{uuid.uuid4()}.{ext}"
            file_path = os.path.join(upload_folder, filename)

            with open(file_path, "wb") as f:
                f.write(base64.b64decode(encoded))
            
            team.logo = f"http://127.0.0.1:5000/static/uploads/{filename}"
        except Exception as e:
            print(f"Error saving logo: {e}")

    # Update Position Names (Preserve Players)
    try:
        positions = eval(team.positions) if team.positions else {}
    except:
        positions = {}
        


    starter_names = data.get('starterNames', [])
    sub_names = data.get('substituteNames', [])
    
    # Update starters
    for i, name in enumerate(starter_names):
        key = f"starter{i}"
        if key in positions:
            positions[key]['name'] = name
        else:
            # Add new slot if size increased (though UI seems fixed to 11)
            positions[key] = { "name": name, "player": None }
            
    # Update subs
    for i, name in enumerate(sub_names):
        key = f"sub{i}"
        if key in positions:
            positions[key]['name'] = name
        else:
             positions[key] = { "name": name, "player": None }
             
    team.positions = str(positions)
    db.session.commit()
    
    return jsonify({"message": "บันทึกการแก้ไขเรียบร้อย", "team": team.to_dict()}), 200

@teams_bp.route('/<int:team_id>', methods=['GET'])
def get_team_detail(team_id):
    """
    API สำหรับดูรายละเอียดทีม
    """
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"message": "ไม่พบทีมที่ต้องการ"}), 404
        
    return jsonify(team.to_dict()), 200

@teams_bp.route('/<int:team_id>/join-position', methods=['POST'])
@jwt_required()
def join_team_position(team_id):
    """
    API สำหรับขอเข้าร่วมทีมในตำแหน่งที่ระบุ
    รับค่า: positionId
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    position_id = data.get('positionId')

    team = Team.query.get(team_id)
    user = User.query.get(current_user_id)

    if not team:
        return jsonify({"message": "ไม่พบทีมที่ต้องการ"}), 404
    
    # Parse positions
    try:
        positions = eval(team.positions) if team.positions else {}
    except:
        positions = {}

    if position_id not in positions:
        return jsonify({"message": "ไม่พบตำแหน่งนี้"}), 400
    
    if positions[position_id]['player']:
        return jsonify({"message": "ตำแหน่งนี้มีคนจองแล้ว"}), 400

    # ตรวจสอบว่า user จองตำแหน่งอื่นในทีมไปแล้วหรือยัง
    for pid, info in positions.items():
        if info['player'] == user.username:
             return jsonify({"message": "คุณอยู่ในทีมนี้แล้ว (ตำแหน่งอื่น)"}), 400

    # Update Position
    positions[position_id]['player'] = user.username
    team.positions = str(positions)

    # Add to members if not present
    if user not in team.members:
        team.members.append(user)

    # Check status
    total_slots = len(positions)
    filled_slots = sum(1 for p in positions.values() if p['player'])
    if filled_slots >= total_slots:
        team.status = 'Full'

    db.session.commit()

    return jsonify({"message": f"เข้าร่วมตำแหน่ง {positions[position_id]['name']} สำเร็จ", "team": team.to_dict()}), 200

@teams_bp.route('/<int:team_id>/leave-position', methods=['POST'])
@jwt_required()
def leave_team_position(team_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    position_id = data.get('positionId')

    team = Team.query.get(team_id)
    user = User.query.get(current_user_id)

    if not team: return jsonify({"message": "Not found"}), 404

    try:
        positions = eval(team.positions) if team.positions else {}
    except:
        positions = {}

    if position_id not in positions:
         return jsonify({"message": "Position invalid"}), 400

    if positions[position_id]['player'] != user.username:
        return jsonify({"message": "Not your position"}), 403

    # Record History
    try:
        current_stats_str = team.match_records if team.match_records else '{"wins": 0, "draws": 0, "losses": 0}'
        stats_dict = eval(current_stats_str)
        total_matches = stats_dict.get('wins', 0) + stats_dict.get('losses', 0) + stats_dict.get('draws', 0)
        
        if total_matches > 0:
            history = TeamHistory(
                user_id=user.id,
                team_name=team.name,
                position=positions[position_id].get('name', 'Unknown'),
                match_stats=current_stats_str
            )
            db.session.add(history)
    except Exception as e:
        print(f"Error recording history: {e}")

    # Clear position
    positions[position_id]['player'] = None
    
    # Auto-promotion logic: if starter left, try to promote a sub
    if not position_id.startswith('sub'):
        try_auto_promote(team, position_id, positions)

    team.positions = str(positions)
    team.status = 'Open'

    # Note: We might want to keep them in members list or remove them. 
    # For now, let's remove them from members if they hold no other positions.
    # (Simplified: Remove from members list)
    if user in team.members:
        team.members.remove(user)

    db.session.commit()

    return jsonify({"message": "ออกจากการแข่งขันเรียบร้อย", "team": team.to_dict()}), 200

# Legacy join for backward compatibility (optional, or remove)
@teams_bp.route('/<int:team_id>/join', methods=['POST'])
@jwt_required()
def join_team(team_id):
    return jsonify({"message": "Please use join-position endpoint"}), 400

# --- Helper Functions ---

def extract_position_key(name):
    """
    Extracts key for matching starter <-> sub positions.
    E.g. "กองหน้า (ST)" -> "st"
    """
    if not name: return ""
    import re
    match = re.search(r'\(([^)]+)\)', name)
    if match:
        return match.group(1).strip().lower()
    return name.strip().lower()

def try_auto_promote(team, empty_starter_id, positions):
    """
    Attempts to find a substitute to fill an empty starter slot.
    """
    starter_pos = positions.get(empty_starter_id)
    if not starter_pos: return None

    starter_key = extract_position_key(starter_pos.get('name'))
    
    # Find candidates
    candidates = []
    for pid, pos in positions.items():
        # Check if it's a sub (starts with 'sub') and has a player
        if pid.startswith('sub') and pos.get('player'):
            sub_key = extract_position_key(pos.get('name'))
            if sub_key == starter_key:
                candidates.append((pid, pos))
    
    if candidates:
        # Pick first one
        sub_id, sub_pos = candidates[0]
        player_to_promote = sub_pos['player']
        
        # Move player
        positions[empty_starter_id]['player'] = player_to_promote
        positions[sub_id]['player'] = None
        
        print(f"Auto-promoted {player_to_promote} from {sub_pos['name']} to {starter_pos['name']}")
        return player_to_promote
    return None

# --- New Endpoints ---

@teams_bp.route('/<int:team_id>/kick', methods=['POST'])
@jwt_required()
def kick_member(team_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    member_username = data.get('username')
    
    team = Team.query.get(team_id)
    owner = User.query.get(current_user_id)
    
    if not team: return jsonify({"message": "Not found"}), 404
    if team.owner_id != owner.id: return jsonify({"message": "Permission denied"}), 403
    
    try:
        positions = eval(team.positions) if team.positions else {}
    except:
        positions = {}
        
    kicked = False
    for pid, pos in positions.items():
        if pos.get('player') == member_username:
            # Record History for kicked member
            member = User.query.filter_by(username=member_username).first()
            if member:
                try:
                    current_stats_str = team.match_records if team.match_records else '{"wins": 0, "draws": 0, "losses": 0}'
                    stats_dict = eval(current_stats_str)
                    total_matches = stats_dict.get('wins', 0) + stats_dict.get('losses', 0) + stats_dict.get('draws', 0)

                    if total_matches > 0:
                        history = TeamHistory(
                            user_id=member.id,
                            team_name=team.name,
                            position=pos.get('name', 'Unknown'),
                            match_stats=current_stats_str
                        )
                        db.session.add(history)
                except Exception as e:
                    print(f"Error recording history: {e}")

            pos['player'] = None
            kicked = True
            
            # Auto promote if starter
            if not pid.startswith('sub'):
                try_auto_promote(team, pid, positions)
                
            break
            
    if not kicked:
         return jsonify({"message": "Member not found in any position"}), 400
         
    # Remove from members list if needed (simplified)
    member = User.query.filter_by(username=member_username).first()
    if member and member in team.members:
        team.members.remove(member)
        
    team.positions = str(positions)
    team.status = 'Open'
    db.session.commit()
    
    return jsonify({"message": f"Kicked {member_username}", "team": team.to_dict()}), 200

@teams_bp.route('/<int:team_id>/match-records', methods=['PUT'])
@jwt_required()
def update_match_records(team_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    result = data.get('result') # 'win', 'loss', 'draw'
    
    team = Team.query.get(team_id)
    owner = User.query.get(current_user_id)
    
    if not team: return jsonify({"message": "Not found"}), 404
    if team.owner_id != owner.id: return jsonify({"message": "Permission denied"}), 403
    
    try:
        stats = eval(team.match_records) if team.match_records else {'wins': 0, 'losses': 0, 'draws': 0}
    except:
        stats = {'wins': 0, 'losses': 0, 'draws': 0}
        
    # Ensure keys exist
    stats.setdefault('wins', 0)
    stats.setdefault('losses', 0)
    stats.setdefault('draws', 0)

    if result == 'win': stats['wins'] += 1
    elif result == 'loss': stats['losses'] += 1
    elif result == 'draw': stats['draws'] += 1
    
    team.match_records = str(stats)
    db.session.commit()
    
    return jsonify({"message": "Records updated", "team": team.to_dict()}), 200

@teams_bp.route('/<int:team_id>', methods=['DELETE'])
@jwt_required()
def delete_team(team_id):
    current_user_id = get_jwt_identity()
    team = Team.query.get(team_id)
    owner = User.query.get(current_user_id)

    if not team: return jsonify({"message": "Not found"}), 404
    if team.owner_id != owner.id: return jsonify({"message": "Permission denied"}), 403

    # Clear associations (optional, but good practice if no cascade)
    team.members = []
    
    db.session.delete(team)
    db.session.commit()

    return jsonify({"message": "ลบทีมเรียบร้อยแล้ว"}), 200
