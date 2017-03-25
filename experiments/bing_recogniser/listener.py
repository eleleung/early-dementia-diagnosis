
import speech_recognition as sr

# Record Audio
r = sr.Recognizer()
with sr.Microphone() as source:
    print("Say something!")
    audio = r.listen(source)

# Speech recognition using Bing Speech API
try:
    print("You said: " + r.recognize_bing(audio, key="")) #For security purposes, talk to Caitlin for access to this key
except sr.UnknownValueError:
    print("Bing Speech could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Bing Speech service; {0}".format(e))

