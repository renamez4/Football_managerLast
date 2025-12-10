
from app import create_app
from models import Team
import re

app = create_app()
print("DEBUG: App created", flush=True)

def extract_position_key(name):
    if not name: return ""
    match = re.search(r'\(([^)]+)\)', name)
    if match:
        return match.group(1).strip().lower()
    return name.strip().lower()

with app.app_context():
    team = Team.query.get(11)
    if team:
        with open('debug_output.txt', 'w', encoding='utf-8') as f:
            f.write(f"Team: {team.name}\n")
            try:
                positions = eval(team.positions)
                f.write("Positions:\n")
                for pid, info in positions.items():
                    name = info.get('name', '')
                    key = extract_position_key(name)
                    player = info.get('player')
                    f.write(f"  {pid}: '{name}' (Key: '{key}') - Player: {player}\n")
            except Exception as e:
                f.write(f"Error parsing positions: {e}\n")

    else:
        print("Team 11 not found")
