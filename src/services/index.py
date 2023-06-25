from flask import Flask, request
import app as app_controller
from threading import Thread

app = Flask(__name__)

@app.route('/face', methods=['POST'])
def face_route():
    if request.method == 'POST':
        data = request.form.get('data')
        user_encoding = app_controller.app.load_user_encodings(data.file)
        return 'Rota /face'

@app.route('/biomether', methods=['POST'])
def biomether_route():
    if request.method == 'POST':
        data = request.form.get('data')
        return 'Rota /biomether'
    
@app.route('/add_encoding', methods=['POST'])
def add_encoding_route():
    if request.method == 'POST':
        data = request.form.get('data')
        app_controller.app.add_encoding(data)
proccess_photos = Thread(target=app_controller.app.load_all_encodings())
app.run(port=8080)