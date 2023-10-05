import face_recognition as fr
import os
import time

def exec(begin, end, message):
    return print(message, end - begin, "seconds")

def load_face_encodings(dirs):
    face_encodings = []
    count = 0

    for dir in dirs:
        print('../../images/' + dir + '/' + os.listdir('../../images/' + dir)[0])
        photo = fr.load_image_file('../../images/' + dir + '/' + os.listdir('../../images/' + dir)[0])
        #photo = cv2.cvtColor(photo, cv2.COLOR_BGR2RGB)
        try:
            encode_photo = fr.face_encodings(photo)[0]
            face_encodings.append(encode_photo)
        except:
            pass

    return face_encodings

def load_face_encoding_to_compare(file):
    photo = fr.load_image_file(file)
    #photo = cv2.cvtColor(photo, cv2.COLOR_BGR2RGB)
    encode_photo = fr.face_encodings(photo)[0]
    return encode_photo

def compare_encodings(user_encoding, encodings):
    for encoding in encodings:
        compare = fr.compare_faces([user_encoding], encoding, tolerance=0.5)
        if compare[0] == True:
            return print('You are authorized')
    return print('You are not authorized')



inicio = time.time()
loaded_face_encondings = load_face_encodings(os.listdir('../../images/'))
fim = time.time()
exec(inicio, fim, "Execution time to load the face encodings:")

face_to_compare = input("Insert the filename to compare: ")
inicio_2 = time.time()
face_encoding_to_compare = load_face_encoding_to_compare('../../uploads/' + face_to_compare)
fim_2 = time.time()
exec(inicio_2, fim_2, "Execution time to load the face encoding to compare:")

inicio_3 = time.time()
compare_encodings(face_encoding_to_compare, loaded_face_encondings)
fim_3 = time.time()
exec(inicio_3, fim_3, "Execution time to compare faces")