
import re

def extract_position_key(name):
    if not name: return ""
    match = re.search(r'\(([^)]+)\)', name)
    if match:
        return match.group(1).strip().lower()
    return name.strip().lower()

def check_match(starter_name, sub_name):
    starter_name_clean = starter_name.lower().strip()
    sub_name_clean = sub_name.lower().strip()
    
    starter_key = extract_position_key(starter_name)
    sub_key = extract_position_key(sub_name)

    print(f"Checking: Starter='{starter_name}' (Key='{starter_key}') vs Sub='{sub_name}' (Key='{sub_key}')")

    # 1. Exact Key Match
    if sub_key and starter_key and sub_key == starter_key:
        return "MATCH (Rule 1: Exact Key)"

    # 2. Substring Key Match
    if starter_key and starter_key in sub_name_clean:
         return f"MATCH (Rule 2: Key '{starter_key}' in Sub Name)"

    # 3. Token Match
    tokens = starter_name_clean.split()
    if any(token in sub_name_clean for token in tokens if len(token) > 1):
        return "MATCH (Rule 3: Token Match)"
        
    return "NO MATCH"

# Test Cases
test_cases = [
    ("ST", "st"),                # Case Insensitive
    ("GK", "gk (GK)"),           # Parentheses
    ("Gong Na (ST)", "ST"),      # Parentheses extraction
    ("ST", "ตัวสำรอง 1 ST"),      # Thai mixed with English Key
    ("Center Back (CB)", "CB"),  # Complex Name
    ("CB", "กองหลัง (CB)"),       # Thai Parens
    ("O", "O"),                  # Single char
    ("กองหน้า", "ตัวสำรอง กองหน้า"), # Thai full name substring match
    ("กองหลัง", "กองหลัง"),         # Thai exact match
    ("ผู้รักษาประตู", "ตัวสำรอง ผู้รักษาประตู 1"), # Long Thai name
]

for s, sub in test_cases:
    print(f"Result: {check_match(s, sub)}\n")
