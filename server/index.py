from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from helper import *


app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.post('/processing')
async def getResults():
    # print(value)
    keyWords =  ['she', 'is', 'a', 'maneater', 'make','you', 'work', 'hard']
    sentences = ['one way to stay', 'couldn\'t hold me back', 'they gonna rip it off', 'taken their time right behind myy baaack']
    keyWordsString = arrayIntoString(keyWords)
    sentencesString = arrayIntoString(sentences)
    return {keyWordsString, sentencesString}
