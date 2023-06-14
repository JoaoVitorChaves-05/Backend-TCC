import cv2
import face_recognition as fr
import os

class App:

    def __init__(self):
        self.encodings = {}

    def load_all_encodings(self):
        path = '../../images/users/'
        dirs = os.listdir(path)

        for dir in dirs:
            print('Loading image: ', dir)
            photo = fr.load_image_file(path + dir)
            try:
                encode_photo = fr.face_encodings(photo)[0]
                self.encodings[photo+dir] = encode_photo
            except:
                pass
        
    def load_user_encodings(file):
        photo = fr.load_image_file(file)
        encode_photo = fr.face_encodings(photo)[0]
        return encode_photo
    
    def compare_encodings(user_encoding, encondings):
        for encoding in encodings:
            compare = fr.compare_faces([user_encoding], encodings)
            if compare[0] == True:
                return True
            return False

app = App()
app.load_all_encodings()