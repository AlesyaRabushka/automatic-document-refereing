import { useEffect, useRef, useState } from "react";
import "./FormComponent.css"
import { ClockLoader } from "react-spinners";
import { ClientService } from "../../service/service";
import PDF from "../../helpers/pdf";
// import fileDownload from "js-file-download";

import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
// import { generateTxtData } from "../../helpers/txt";


export const FormComponent = () => {
    // DRAG & DROP
    const [drag, setDrag] = useState(false);
    // uploaded file
    const [files, setFiles] = useState<Array<File>>([]);
    const [fileDataUrl, setFileDataUrl] = useState<string>('');

    // spinner and processing
    const [pressed, setPressed] = useState(false);
    // show START button and helper text
    const [showText, setShowText] = useState(true);
    // show pspinner
    const [spinner, setSpinner] = useState(false);
    // shown load text
    const [currentText, setCurrentText] = useState('Loading...');

    // results
    const [result, setResult] = useState<any>([{}]);
    // for pdf results
    const [pdfResult, setPdfResult] = useState<string>('');
    // results boolean
    const [ifResults, setIfResults] = useState(false);
    // show file text or do not
    const [showFileText, setShowFileText] = useState(false);
    // key words result
    const [keyWords, setKeyWords] = useState([]);
    // sentences result
    const [sentences, setSentences] = useState([]);


    const text = ['Loading...','чтобы', 'не было', 'скучно'];
    let index = 0;
    const empty='  .\n'



    document.body.addEventListener('keydown', (event:any) => {
        if (event.key == 'Enter'){
            setPressed(true);
            setShowText(false);
            setSpinner(true);
            handleFileUpload(event);
            handleStart();
        }
    })


    const handleFileUpload = async (e: any) => {
        const files = e.target.files;
        setFiles(files);
    }

    useEffect(() => {
        setKeyWords(result[0]);
        setSentences(result[1]);
        console.log(keyWords)
    }, [result])

    // start processing
    const handleStart = async () => {
        setPressed(true);
        setShowText(false);
        setSpinner(true);

        // const r = await ClientService.get();
        const r2 = await ClientService.process();
        setResult(() => r2);
        setSpinner(false);
        setIfResults(true);
    }




    return(

        <div className="form-component">
             {/* ----- DRAG & DROP area */}
             {!pressed && 
             <>
                {drag ?
                        <div className="drag-area"
                            onDragStart={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDragLeave={e => {
                                e.preventDefault();
                                setDrag(false)
                            }}
                            onDragOver={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDrop={e => {
                                e.preventDefault();
                                let files = e.dataTransfer.files;
                                
                                const arr: Array<File> = []
                                for (let i = 0; i < files.length; i++){
                                    console.log(files[i].type)
                                    if (files[i].type == 'text/html'){
                                        arr.push(files[i]);
                                    }
                                }
                                setFiles(arr);
                                setDrag(false);
                            }}
                        >
                            Отпустите файл
            
                        </div>
                    : <div className="drag-area"
                            onDragStart={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDragLeave={e => {
                                e.preventDefault();
                                setDrag(false)
                            }}
                            onDragOver={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            >
                            Перенесите html-файлы сюда или нажмите на кнопку
                            <div className="input-box">
                                <label htmlFor="input-file" className="input-file-button">Выбрать файлы</label>
                                <input type="file" name="file" id="input-file" className="input" onChange={handleFileUpload} accept="text/html" multiple/>
                                {
                                    files && 
                                    <div className="files-box">
                                        <label>Selected files: {files.length}</label>
                                        <div className="files-name-box">
                                            {Array.from(files).map(item => <label>{item.name}</label>)}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                 </>
                }
                
            {showText && 
                <div className="helper-labels">
                    <label className="label-button" onClick={handleStart}>START</label>
                    <label className="text-helper">Нажмите на кнопку START или нажмите ENTER</label>
                </div>
            }

            { ifResults ?
                <>
                    {showFileText ? 
                        <label className="show-text-button" onClick={e => setShowFileText(!showFileText)}>Hide files content</label> 
                        : 
                        <label className="show-text-button" onClick={e => setShowFileText(!showFileText)}>Show files content</label>
                    }
                    <div className="results-box">
                        {result.map((item:any) => 
                            <div className="result-item">
                                <label style={{fontSize: "1.5em"}}>{item.method}</label>
                                <label style={{fontSize: "1.2em", marginTop: '5px'}}>{item.name}</label>
                                <label style={{marginTop: '5px', marginBottom: "5px"}}>{item.result}</label>
                                {
                                    showFileText && <label style={{marginTop: '10px'}}>{item.text}</label>
                                }
                            </div>
                            
                        )}
                        {result &&
                            <PDFDownloadLink className="input-file-button" document={<PDF props={{keyWords:String(keyWords), sentences:String(sentences)}} />} fileName="text-recognition-result" style={{textDecoration:"none", color:"white"}}>
                                Сохранить результат
                            </PDFDownloadLink>
                        }
                        
                        <div style={{minHeight:"50px"}}>{empty}</div>
                    </div>
                
                    
                
                </>
            :
                spinner &&
                    <>
                        <div className="spinner">
                            <ClockLoader size={200} color="rgb(96, 11, 129)"/>
                        </div> 
                        <label className="text-helper">{currentText}</label>
                    </>
            }
        </div>
    )
}