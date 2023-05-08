import cv2
import face_recognition as fr

my_photo_1 = fr.load_image_file('./images/my_photo_1.png')
my_photo_1 = cv2.cvtColor(my_photo_1, cv2.COLOR_BGR2RGB)

my_photo_2 = fr.load_image_file('./images/eu.png')
my_photo_2 = cv2.cvtColor(my_photo_2, cv2.COLOR_BGR2RGB)

#faceLoc = fr.face_locations(my_photo_1)[0]
#print(faceLoc)
#cv2.rectangle(my_photo_1, (faceLoc[3], faceLoc[0]), (faceLoc[1], faceLoc[2]), (0, 255, 0), 2)

encode_my_photo_1 = fr.face_encodings(my_photo_1)[0]
encode_my_photo_2 = fr.face_encodings(my_photo_2)[0]

compare = fr.compare_faces([encode_my_photo_1], encode_my_photo_2)

print(compare)
