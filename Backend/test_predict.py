import requests

url = "http://localhost:8000/predict"

with open("test.jpg", "rb") as f:
    files = {"image": f}
    res = requests.post(url, files=files)

print(res.status_code)
print(res.text)
