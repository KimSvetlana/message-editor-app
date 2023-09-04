import React, { useState } from "react";
import "./messageEditor.css";
import Modal from "react-modal";
import ConditionBlock from "./conditionBlock";
import PreviewPage from "./previewPage";
import {AddConditionContext, AddConditionEventSource, CompoundTextTemplate, AddVariableContext} from "./utils"
import { CompoundText } from "./compoundText";


function MessageEditor() {
  let variablesName = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstname", "lastname", "company", "position"];

  
  const addVariableContext =  React.useContext(AddVariableContext);
  const addConditionEventSource = React.useContext(AddConditionContext);

  const [templateRoot, setTemplateRoot] = useState(new CompoundTextTemplate("initial text"));  
  const [previewIsOpen, setPreviewIsOpen] = useState(false);
  
  const openPreview = () => {
        console.log('generateText');
        console.log(templateRoot.generateText(variablesName));
      setPreviewIsOpen(true);

    };
    
    const saveTemplate = (event: any) => {
      localStorage.setItem("variables", JSON.stringify(variablesName));
    //   localStorage.setItem("template", JSON.stringify(template));
    };

  const closePreview = () => {
    setPreviewIsOpen(false);
  };

  const varButtonClick = (event: any) => {
    addVariableContext.variable = event.target.id;
    const callback = addVariableContext.callback();
    if (callback) {
        callback();
    }
  };  

  const addIfElseBlock = (event: any) => {
    const callback = addConditionEventSource.callback;
    if (callback) {
        callback();
    }
  };

  const deleteIfElseBlock = (event: any) => {

  };

return (
    <div className="message-editor-page">
      <div className="page-content">
        <h3>Massage Template Editor</h3>

        <div className="button-group">
          {variablesName?.map((varName: string) => (
            <button
              key={varName}
              id={varName}
              className="button"
              onClick={varButtonClick}
              >
              {varName}
            </button>
          ))}
        </div>

        <div className="if-else-button" onClick={addIfElseBlock}>
          click to add
          <span className="if-else-wrapper"> if </span>
          some variable or expression
          <span className="if-else-wrapper"> then </span>
          then_value
          <span className="if-else-wrapper"> else</span>
          else_value
        </div>

        <CompoundText templateObject={templateRoot} identityClass='template-input'></CompoundText>

        <div className="savePanel">
          <button className="button" onClick={openPreview}>Preview</button>
          <button className="button" onClick={saveTemplate}>Save</button>
          <button className="button">Close</button>
        </div>
      </div>

      <Modal isOpen={previewIsOpen} onRequestClose={closePreview}>{<PreviewPage previewClose={closePreview}/>}</Modal>

    </div>
  );
}

export default MessageEditor;
