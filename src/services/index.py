from flask import Flask
import app as app_controller
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

app.run(port=8080)