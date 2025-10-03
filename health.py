#!/usr/bin/env python3
"""
Simple health check test for the Medical RAG Bot
"""
import requests
import sys

def test_health_endpoint():
    try:
        response = requests.get('http://localhost:5000/health', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"   Timestamp: {data['timestamp']}")
            return True
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the application. Is it running on localhost:5000?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_health_endpoint()
    sys.exit(0 if success else 1)