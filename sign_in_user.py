import requests

url = 'http://localhost:3000/user/signIn'
data = {
    'cpf': '39897883887',
    'password': 'senha1234'
}

x = requests.post(url, json = data)

print(x.text)