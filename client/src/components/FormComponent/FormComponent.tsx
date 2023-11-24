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
    const [showText, setShowText] = useState(false);
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
            // handleFileUpload(event);
            handleStart();
        }
    })


    const handleFileUpload = async (e: any) => {
        setFiles(Array.from(e.target.files));
        console.log(e.target.files[0])
        setShowText(true);
        await ClientService.upload(e.target.files[0])
    }

    useEffect(() => {
        let i = 0;
        const timeoutId = setTimeout(() => {
            setCurrentText(text[i]);
            console.log('here')
            i += 1;
          }, 1500); // время в миллисекундах
      
          return () => clearTimeout(timeoutId); 
    }, [])

    // start processing
    const handleStart = async () => {
        setPressed(true);
        setShowText(false);
        setSpinner(true);

        // const r = await ClientService.get();
        const r2 = await ClientService.process(files[0]);
        console.log(r2)
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
                                    if (files[i].type == 'text/plain'){
                                        arr.push(files[i]);
                                    }
                                }
                                setShowText(true);
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
                            Перенесите txt-файлы сюда или нажмите на кнопку
                            <div className="input-box">
                                <label htmlFor="input-file" className="input-file-button">Выбрать файлы</label>
                                <input type="file" name="file" id="input-file" className="input" onChange={handleFileUpload} accept="text/plain" multiple/>
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
                    <button className="input-file-button" onClick={e => window.location.reload()}>Загрузить новый файл</button>
                    {showFileText ? 
                        <label className="show-text-button" onClick={e => setShowFileText(!showFileText)}>Hide files content</label> 
                        : 
                        <label className="show-text-button" onClick={e => setShowFileText(!showFileText)}>Show files content</label>
                    }
                    <div className="results-box">
                        {/* {result.map((item:any) =>  */}
                        
                            <div className="result-item">
                                <label style={{fontSize: "1.5em"}}>{files[0].name}</label>
                                <label style={{marginTop: "5px"}} >Ключевые предложения:</label>
                                <label style={{marginTop: '5px', fontWeight: 300}}>
                                    {result[0].map((item:any) => <div style={{marginTop: "5px"}}>{item}</div>)}
                                    </label>
                                <label style={{marginTop: "5px"}}>Ключевые слова и фразы</label>
                                
                                <label style={{marginTop: '5px', marginBottom: "5px", fontWeight: 300}}>
                                    {result[1].map((item:any) => <div>{item}</div>)}
                                </label>
                                <label style={{marginTop: "5px"}}>ML метод</label>
                                <label style={{marginTop: '5px', marginBottom: "5px", fontWeight: 300}}>
                                    {result[4].map((item:any) => <div>{item}</div>)}
                                </label>

                                <label style={{marginTop: "5px"}}>Текст файла:</label>
                                {
                                    showFileText && <label style={{marginTop: '10px', marginBottom: '10px'}}>{result[6]}</label>
                                }
                            </div>
                            
                        {/* )} */}
                        {result &&
                            <PDFDownloadLink className="input-file-button" document={<PDF props={{keyWords:String(result[3]), sentences:String(result[2]), summary:String(result[5])}} />} fileName="text-recognition-result" style={{textDecoration:"none", color:"white"}}>
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