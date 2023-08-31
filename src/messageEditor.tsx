import React, { useState } from "react";
import "./messageEditor.css";
import Modal from "react-modal";
import ConditionBlock from "./conditionBlock";
import PreviewPage from "./previewPage";
import {AddConditionContext, AddConditionEventSource, CompoundTextTemplate} from "./utils"
import { CompoundText } from "./compoundText";


function MessageEditor() {
  let variablesName = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstname", "lastname", "company", "position"];
  let text = JSON.parse(localStorage.getItem("template") || "{}");

  const VariableContext = React.createContext('variable');

  const addConditionEventSource = React.useContext(AddConditionContext);

  const [template, setCurrentState] = useState(text);
  const [position, setPos] = useState(0);
  const [lastVariableName, setVariableName] = useState('');

  const [templateRoot, setTemplateRoot] = useState(new CompoundTextTemplate("initial text"));
  
  const [previewIsOpen, setPreviewIsOpen] = useState(false);
  
  const openPreview = () => {
      setPreviewIsOpen(true);

    };
    
    const saveTemplate = (event: any) => {
      localStorage.setItem("variables", JSON.stringify(variablesName));
      localStorage.setItem("template", JSON.stringify(template));
    };

  const closePreview = () => {
    setPreviewIsOpen(false);
  };

  const varButtonClick = (event: any) => {
    setVariableName(event.target.id);
    let text = template;
    let addText = `{${event.target.id}}`;
    let newText = text.slice(0, position) + addText + text.slice(position);
    let newPosition = position + addText.length;
    setCurrentState(newText);
    setPos(newPosition);
  };  

  const addIfElseBlock = (event: any) => {
    const callback = addConditionEventSource.callback();
    if (callback) {
        callback();
    }
  };

  const deleteIfElseBlock = (event: any) => {

  };

return (
<VariableContext.Provider value={lastVariableName}>
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
</VariableContext.Provider>
  );
}

export default MessageEditor;
