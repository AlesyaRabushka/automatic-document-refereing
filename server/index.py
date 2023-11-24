from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from helper import *
from typing import List, Annotated
from methods import getKeySentences, getKeyWords, summarize
from pydantic import BaseModel

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
async def getResults(file: Annotated[bytes, File()]):
    resultKeySentences = []
    resultKeyWords = []
    text = file.decode()
    

    keySentences = getKeySentences(text)
    # keyWords = getKeyWords(text)
    keyWords = getKeyWords(text)
    # model = Summarizer()
    # result = model(text, num_sentences=1, min_length=60)
    # ml = ''.join(result)
    # print(ml)

    keySentencesStr = arrayIntoString(keySentences)
    keyWordsStr = arrayIntoString(keyWords)
    summary, summaryStr = summarize(text, 0.7)
    print('summ',summary)

    result = [
        keySentences,
        keyWords,
        keySentencesStr,
        keyWordsStr,
        summary,
        summaryStr,
        text
    ]

    print('RESULT\n', result)

    return result

@app.post('/upload')
def upload(file: Annotated[bytes, File()]):
    contents = file.decode()
    # text = contents.decode('utf-8')
    print(contents)

    return 'done good'
