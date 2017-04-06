
from os.path import join, dirname
from watson_developer_cloud import SpeechToTextV1 as SpeechToText
from watson_developer_cloud import AlchemyLanguageV1 as AlchemyLanguage

BLUEMIX_USERNAME=""
BLUEMIX_PASSWORD= ""
ALCHEMY_API_KEY=""

def transcribe_audio(path_to_audio_file):
    speech_to_text = SpeechToText(username=BLUEMIX_USERNAME,
                                  password=BLUEMIX_PASSWORD)
    with open(join(dirname(__file__), path_to_audio_file), 'rb') as audio_file:
        recognisedText = speech_to_text.recognize(audio_file,
                                        content_type='audio/wav')
        print(recognisedText)
        return recognisedText

def get_text_sentiment(text):
    alchemy_language = AlchemyLanguage(api_key=ALCHEMY_API_KEY)
    result = alchemy_language.sentiment(text=text)
    if result['docSentiment']['type'] == 'neutral':
        return 'netural', 0
    return result['docSentiment']['type'], result['docSentiment']['score']



