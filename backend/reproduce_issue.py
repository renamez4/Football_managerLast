
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:5000/api/auth"

def make_request(url, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    req = urllib.request.Request(url, method=method, headers=headers)
    if data:
        req.data = json.dumps(data).encode('utf-8')
        
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())
    except Exception as e:
        print(f"Network error: {e}")
        return 500, {}

def test_flow():
    # 1. Register/Login
    username = "testuser_repro_v2"
    password = "password123"
    email = "test_repro_v2@example.com"
    
    print(f"Attempting to login as {username}...")
    status, data = make_request(f"{BASE_URL}/login", "POST", {
        "username": username, "password": password
    })
    
    if status != 200:
        print("Login failed, trying to register...")
        status, reg_data = make_request(f"{BASE_URL}/register", "POST", {
            "username": username, "password": password, "email": email, "phone": "0000000000"
        })
        print(f"Register status: {status}")
        
        status, data = make_request(f"{BASE_URL}/login", "POST", {
            "username": username, "password": password
        })

    if status == 200:
        token = data.get('token')
        print(f"Login successful. Token: {token[:20]}...")
    else:
        print(f"Login failed: {status}")
        print(data)
        return

    # 2. Use token
    print("Requesting /me with token...")
    status, me_data = make_request(f"{BASE_URL}/me", "GET", token=token)
    print(f"/me Status: {status}")
    print(me_data)
    
if __name__ == "__main__":
    test_flow()
