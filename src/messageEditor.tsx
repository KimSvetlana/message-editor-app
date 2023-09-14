import React, { useState } from "react";
import "./messageEditor.css";
import Modal from "react-modal";
import PreviewPage from "./previewPage";
import {
  AddConditionContext,
  CompoundTextTemplate,
  AddVariableContext,
} from "./model";
import { CompoundText } from "./compoundText";

Modal.setAppElement("#root");

function MessageEditor() {
  let variablesName = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstname", "lastname", "company", "position"];

  const addVariableContext = React.useContext(AddVariableContext);
  const addConditionEventSource = React.useContext(AddConditionContext);

  const [templateRoot, setTemplateRoot] = useState(
    new CompoundTextTemplate("initial text")
  );
  const [previewIsOpen, setPreviewIsOpen] = useState(false);

  const openPreview = () => {
    setPreviewIsOpen(true);
  };

  const saveTemplate = (event: any) => {
    localStorage.setItem("variables", JSON.stringify(variablesName));
  };

  const closePreview = () => {
    setPreviewIsOpen(false);
  };

  const createButtonClickHandler = (varName: string) => {
    const clickHandler = () => {
      addVariableContext.variable = varName;
      const callback = addVariableContext.callback();
      if (callback) {
        callback();
      }
    };

    return clickHandler;
  };

  const addIfElseBlock = (event: any) => {
    const callback = addConditionEventSource.callback;
    if (callback) {
      callback();
    }
  };

  return (
    <div className="message-editor-page">
      <div className="page-content">
        <h3>Massage Template Editor</h3>

        <div className="button-group">
          {variablesName?.map((varName: string) => (
            <button
              key={varName}
              className="button"
              onClick={createButtonClickHandler(varName)}
            >
              {`{${varName}}`}
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

        <CompoundText
          templateObject={templateRoot}
          identityClass="template-input"
        ></CompoundText>

        <div className="savePanel">
          <button className="button" onClick={openPreview}>
            Preview
          </button>
          <button className="button" onClick={saveTemplate}>
            Save
          </button>
          <button className="button">Close</button>
        </div>
      </div>

      <Modal isOpen={previewIsOpen}>
        {<PreviewPage previewClose={closePreview} template={templateRoot} />}
      </Modal>
    </div>
  );
}

export default MessageEditor;
