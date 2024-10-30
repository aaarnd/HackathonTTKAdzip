import pymorphy3
import nltk
nltk.download('all')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

morph = pymorphy3.MorphAnalyzer()

def lemmatize(message):
    tokens = word_tokenize(message)
    filtered_tokens = [word for word in tokens if not word in stopwords.words('russian')]
    lemmatized_tokens = [morph.parse(token)[0].normal_form for token in filtered_tokens]
    return lemmatized_tokens


