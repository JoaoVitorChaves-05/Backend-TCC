import cv2
import face_recognition as fr
import mysql.connector

class App:

    def __init__(self):
        self.encodings = {}
        self.photos = {}
        self.conn = mysql.connector.connect(
            host='localhost',
            port='3306',
            user='root',
            password='root',
            database='security_system'
        )
    
    def add_encoding(self, user_data):
        cursor = self.conn.cursor()
        cursor.execute(f"SELECT * FROM Photo WHERE user_id = {user_data.user_id}")

        result = cursor.fetchOne()
        photo = fr.load_image_file(result.photo_path)
        try:
            encode_photo = fr.face_encodings(photo)[0]
            if (user_data.group_id in self.encodings.values()):
                self.encodings[user_data.group_id].append(encode_photo)
            else:
                self.encodings[user_data.group_id] = []
                self.encodings[user_data.group_id].append(encode_photo)
        except:
            pass

    def load_all_encodings(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT a.user_id, a.group_id, p.photo_path FROM Authorized as a JOIN Photo as p ON a.user_id = p.user_id;")
        
        result = cursor.fetchAll()
        for row in result:
            photo_path = row.photo_path
            print("Loading image: ", photo_path)
            photo = fr.load_image_file(photo_path)
            try:
                encode_photo = fr.face_encodings(photo)[0]
                if (row.group_id in self.encodings.values()):
                    self.encodings[row.group_id].append(encode_photo)
                else:
                    self.encodings[row.group_id] = []
                    self.encodings[row.group_id].append(encode_photo)
            except:
                pass
        cursor.close()
        
    def load_user_encodings(file):
        photo = fr.load_image_file(file)
        encode_photo = fr.face_encodings(photo)[0]
        return encode_photo
    
    def compare_encodings(self, user_encoding, group_id):
        for encoding in self.encodings[group_id]:
            compare = fr.compare_faces([user_encoding], encoding)
            if compare[0] == True:
                return True
        return False

app = App()
app.load_all_encodings()