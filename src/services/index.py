from flask import Flask, request
import app as app_controller
from threading import Thread

app = Flask(__name__)

@app.route('/face', methods=['GET', 'POST'])
def face_route():
    if request.method == 'POST':
        print(request.form)
        print(request.form.get('path'))
        photo = request.form.get('path')
        group_id = request.form.get('group_id')
        user_encoding = app_controller.app.load_user_encodings(photo)
        compare = app_controller.app.compare_encodings(user_encoding, group_id)
        return compare
'''
@app.route('/biomether', methods=['POST'])
def biomether_route():
    if request.method == 'POST':
        data = request.form.get('data')
        return 'Rota /biomether'
'''   
@app.route('/add_encoding', methods=['POST'])
def add_encoding_route():
    if request.method == 'POST':
        photo = request.form.get('path')
        app_controller.app.add_encoding(photo)

proccess_photos = Thread(target=app_controller.app.load_all_encodings())
app.run(port=8080)