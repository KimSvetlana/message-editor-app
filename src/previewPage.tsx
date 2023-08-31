import React, { useState } from "react";
import "./startPage.css";
import "./previewPage.css";

let textNode = {
    text: '',
    condition :{
       ifExist: 'boolean',
       thenText : '',
       elseText:'',
   },
}

function PreviewPage(props: any) {
  console.log("preview", JSON.parse(localStorage.getItem("variables") || "{}"));
  let variablesName: string[] = JSON.parse(
    localStorage.getItem("variables") || "{}"
  );
  const text = JSON.parse(localStorage.getItem("template") || "{}");
  const [template, setCurrentState] = useState(text);
  const [variableValues, setVariableValues] = useState( new Map<String, String>());

//   const generateTextOutput = (t: MessageTemplate, vars: Map<String, String>) => {
//     return "";
//   }

  const generateText = () => {
    let newText = text;
    variableValues.forEach((varValue, varName) => {
      newText = newText.replace(`{${varName}}`, varValue);
    });

    return newText;
  };

  const inputChange = (event: any) => {
    let varName = event.target.id;
    let value = event.target.value;
    variableValues.set(varName, value);
    console.log(`variables: ${variableValues}`)

    setCurrentState(generateText());
  };

  const templateChange = () => {};

  return (
    <div className="start-page">
      <div className="page-content">
        <div className="preview-header">
            <h3>Message preview</h3>
            <button name='close' onClick={props.previewClose}>Close</button>
        </div>
        <div className="template">
          <textarea
            onChange={templateChange}
            className="template-input"
            value={template || ""}
          ></textarea>
        </div>
        <div className="button-group">
          {variablesName?.map((varName: string) => (
            <div key={`div_${varName}`}>
              <label key={`label_${varName}`} htmlFor={varName}>
                {varName}
              </label>
              <input
                key={varName}
                id={varName}
                className="input"
                onChange={inputChange}
                placeholder={varName}
              ></input>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
