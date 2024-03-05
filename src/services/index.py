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
        if (type(user_encoding) != None):
            compare = app_controller.app.compare_encodings(user_encoding, group_id)
            return compare
        return { 'status': False }
    if request.method == 'PUT':
        photo = request.form.get('path')
        user_id = request.form.get('user_id')
        user_encoding = app_controller.app.load_user_encodings(photo)

        if (not user_encoding):
            return { 'status': False }
        
        groups_to_search = app_controller.app.encodings.keys()

        for group_id in groups_to_search:
            for user in app_controller.app.encodings[group_id]:
                if user_id == user['user_id']:
                    user['encode_photo'] = user_encoding
                    return { 'status': True }
        
        return { 'status': False }

@app.route('/group', methods=['POST'])
def addUser():
    if request.method == 'POST':
        print('group')
        user_id = request.form.get('user_id')
        group_id = request.form.get('group_id')
        status = app_controller.app.add_user_to_group(user_id, group_id)
        print(status)
        return status
    
@app.route('/hasFace', methods=['POST'])
def hasFace():
    if request.method == 'POST':
        photo_path = request.form.get('photo_path')
        status = app_controller.app.hasFace(photo_path)
        print(status)
        return status

proccess_photos = Thread(target=app_controller.app.load_all_encodings())
app.run(port=8080)
