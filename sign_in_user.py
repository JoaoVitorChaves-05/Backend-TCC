import requests

url = 'http://localhost:3000/user/signIn'
data = {
    'cpf': '39897883886',
    'password': 'senha123'
}

x = requests.post(url, json = data)

print(x.text)