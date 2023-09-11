import React, { useState } from "react";
import "./startPage.css";
import "./previewPage.css";
import { CompoundText } from "./compoundText";
import { SimpleText } from "./simpleText";


function PreviewPage(props: any) {
  console.log("preview", JSON.parse(localStorage.getItem("variables") || "{}"));
  let variablesNames: string[] = JSON.parse(
    localStorage.getItem("variables") || "{}"
  );

  let variablesInitial = new Map<string, string>(variablesNames.map(varName => [varName, ""]));
  const [variableValues, setVariableValues] = useState(variablesInitial);
  const [displayText, setDisplayText] = useState(props.template.generateText(variablesInitial));

  const inputChange = (event: any) => {
    let varName = event.target.id;
    let value = event.target.value;
    variableValues.set(varName, value);
    console.log(`variables: ${variableValues}`)
    setDisplayText(props.template.generateText(variableValues));
  };

  return (
    <div className="start-page">
      <div className="page-content">
        <div className="preview-header">
            <h3>Message preview</h3>
            <button name='close' onClick={props.previewClose}>Close</button>
        </div>
        <div className="template">        
              {displayText}                 
        </div>
        <div className="button-group">
          {variablesNames?.map((varName: string) => (
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
