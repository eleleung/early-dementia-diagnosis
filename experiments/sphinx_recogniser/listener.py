
#TO SET UP

# Make sure we have up-to-date versions of pip, setuptools and wheel:
#$ pip install --upgrade pip setuptools wheel
#$ pip install --upgrade pocketsphinx

'''import os
from pocketsphinx import LiveSpeech, get_model_path

model_path = get_model_path()

speech = LiveSpeech(
    verbose=False,
    sampling_rate=16000,
    buffer_size=2048,
    no_search=False,
    full_utt=False,
    hmm=os.path.join(model_path, 'en-us'),
    lm=os.path.join(model_path, 'en-us.lm.bin'),
    dic=os.path.join(model_path, 'cmudict-en-us.dict')
)

for phrase in speech:
    print(phrase)'''

#!/usr/bin/env python3
# Requires PyAudio and PySpeech.

import speech_recognition as sr
import pocketsphinx

# Record Audio
r = sr.Recognizer()
with sr.Microphone() as source:
    print("Say something!")
    audio = r.listen(source)

# Speech recognition using Sphinx
try:
    print("You said: " + r.recognize_sphinx(audio))
except sr.UnknownValueError:
    print("Sphinx Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Sphinx Recognition service; {0}".format(e))