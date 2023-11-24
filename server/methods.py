from nltk.tokenize import word_tokenize, sent_tokenize
import nltk
nltk.download('stopwords')
from collections import Counter
import re
from nltk.corpus import stopwords
from rake_nltk import Rake
from string import punctuation
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from heapq import nlargest

def removeStopWords(words):
    stopWords = stopwords.words('russian') + ['он', 'она', 'в', 'может', 'наверное', 'ж', 'об', 'их', 'и', 'ведь', 'то', 'а','или'] + stopwords.words('english')
    
    
    tokens = [token for token in words if token not in stopWords\
              and token != " " \
              and token.strip() not in punctuation]
    
    text = " ".join(tokens)
    
    return text


def getBeforeSentenceWordsAmount(text):
    sentences = sent_tokenize(text)
    
    sentenseWordsAmount = []
    for senTarget in sentences:
        wordsTokens = []
        for sen in sentences:
            if senTarget != sen:
                words = re.findall(r'\w+', sen.lower())
                for word in words:
                    wordsTokens.append(word)
            else:
                break
        sentenseWordsAmount.append([senTarget, len(wordsTokens)])       

    return sentenseWordsAmount
   

def getSentenceValue(sentence, sentenseWordsAmount, generalWordsAmount):
    for item in sentenseWordsAmount:
        if item[0] == sentence:
            Posd = 1 - ((item[1]) / generalWordsAmount)
            return Posd


def getParagraphs(text):
    paragraphs = re.split(r'\n{1}', text)  # Используем двойной перевод строки в качестве разделителя абзацев
    result = []

    for idx, paragraph in enumerate(paragraphs):
        result.append(paragraph.strip())  # Удаляем лишние пробелы или переводы 
    
    return result


def getParagraphBySentence(sentence, paragraphs):
    for paragraph in paragraphs:
        if sentence in paragraph:
            return paragraph


def getKeySentences(text):
    sentences = sent_tokenize(text)
    words = re.findall(r'\w+', text.lower())
    paragraphs = getParagraphs(text)

    keySentences = []
    bufResult = []
    values = []

    for sen in sentences:
        beforeTextWordsAmount = getBeforeSentenceWordsAmount(text)
        posd = getSentenceValue(sen, beforeTextWordsAmount, len(words))

        paragraph = getParagraphBySentence(sen , paragraphs)
        wordsParagraph = re.findall(r'\w+', paragraph.lower())
        beforeParagraphWordsAmount = getBeforeSentenceWordsAmount(paragraph)
        posp = getSentenceValue(sen, beforeParagraphWordsAmount, len(wordsParagraph))

        # print(sen)
        value = posd * posp
        # print(value)

        bufResult.append([sen, value])
        values.append(value)

    
    values.sort(reverse=True)
    resultValues = values[:len(sentences)//2]
    for item in bufResult:
        if item[1] in resultValues:
            keySentences.append(item[0])

    # print(keySentences)
    return keySentences


def getWordsWeights(words):
    
    # words = word_tokenize(text)
    clearWords = removeStopWords(words)
    word_counts = Counter(clearWords)
    # print(word_counts)
    total_words = sum(word_counts.values())
    weights = {word: count/total_words for word, count in word_counts.items()}
    return weights




def getKeyWords(text: str):
    rake_nltk_var = Rake()
    rake_nltk_var.extract_keywords_from_text(text)
    keyword_extracted = rake_nltk_var.get_ranked_phrases()
    resultSet = set(keyword_extracted)
    print('lenl', len(resultSet))
    return resultSet


def summarize(text, per):
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(text)
    tokens=[token.text for token in doc]
    word_frequencies={}
    for word in doc:
        if word.text.lower() not in list(STOP_WORDS):
            if word.text.lower() not in punctuation:
                if word.text not in word_frequencies.keys():
                    word_frequencies[word.text] = 1
                else:
                    word_frequencies[word.text] += 1
    max_frequency=max(word_frequencies.values())
    for word in word_frequencies.keys():
        word_frequencies[word]=word_frequencies[word]/max_frequency
    sentence_tokens= [sent for sent in doc.sents]
    sentence_scores = {}
    for sent in sentence_tokens:
        for word in sent:
            if word.text.lower() in word_frequencies.keys():
                if sent not in sentence_scores.keys():                            
                    sentence_scores[sent]=word_frequencies[word.text.lower()]
                else:
                    sentence_scores[sent]+=word_frequencies[word.text.lower()]
    select_length=int(len(sentence_tokens)*per)
    summary=nlargest(select_length, sentence_scores,key=sentence_scores.get)
    final_summary=[word.text for word in summary]
    summary=''.join(final_summary)
    
    return final_summary, summary