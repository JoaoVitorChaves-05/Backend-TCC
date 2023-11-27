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

    def hasFace(self, photo_path):
        try:
            photo = fr.load_image_file(photo_path)
            encode_photo = fr.face_encodings(photo)[0]
            print(encode_photo)
            return {'status': True}
        except:
            return {'status': False}
        
    def add_user_to_group(self, user_id, group_id):
        cursor = self.conn.cursor()
        cursor.execute(f"SELECT * FROM Photos WHERE user_id = {user_id}")

        result = cursor.fetchone()
        print('result:', result)
        photo_path = result[2]
        print('photo path:', photo_path)
        photo = fr.load_image_file('../' + '.'+ photo_path)
        print('photo:', photo)
        try:
            cursor.close()
            encode_photo = fr.face_encodings(photo)[0]
            if (group_id in self.encodings.values()):
                print('enter')
                self.encodings[group_id].append({'user_id': user_id, 'encode_photo': encode_photo})
                return {'status': True}
            else:
                self.encodings[group_id] = []
                self.encodings[group_id].append({'user_id': user_id, 'encode_photo': encode_photo})
                return {'status': True}
        except:
            return {'status': False}

    def load_all_encodings(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT a.user_id, a.group_id, p.photo_path FROM Authorizeds as a JOIN Photos as p ON a.user_id = p.user_id;")
        
        result = cursor.fetchall()
        print(result, len(result))
        for row in result:
            photo_path = row[2]
            print("Loading image: ", '../' + '.'+ photo_path)
            photo = fr.load_image_file('../' + '.'+ photo_path)
            try:
                encode_photo = fr.face_encodings(photo)[0]
                if (row[1] in self.encodings.values()):
                    self.encodings[row[1]].append({'user_id': row[0], 'encode_photo': encode_photo})
                else:
                    self.encodings[row[1]] = []
                    self.encodings[row[1]].append({'user_id': row[0], 'encode_photo': encode_photo})
                print(self.encodings)
            except:
                pass
        cursor.close()
        
    def load_user_encodings(self, file):
        photo = fr.load_image_file(file)
        encode_photo = fr.face_encodings(photo)[0]
        return encode_photo
    
    def compare_encodings(self, user_encoding, group_id):
        for encoding in self.encodings[int(group_id)]:
            compare = fr.compare_faces([user_encoding], encoding.encode_photo)
            if compare[0] == True:
                return {'status': True}
        return {'status': False}

app = App()
app.load_all_encodings()