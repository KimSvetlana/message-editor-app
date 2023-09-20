import React, { useState } from "react";
import "./messageEditor.css";
import Modal from "react-modal";
import PreviewPage from "../previewPage/previewPage";
import {
  AddConditionContext,
  CompoundTextElement,
  AddVariableContext,
} from "../../model";
import { CompoundText } from "../compoundText/compoundText";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

export interface IMessageEditorProps {
  variableNames: Array<string>;
  template: CompoundTextElement;
  saveFunction: (variables: Array<string>, template: CompoundTextElement) => void;
}

function MessageEditor(props: IMessageEditorProps) {
  let variableNames = props.variableNames;
  let templateInitial = props.template;
  
  const addVariableContext = React.useContext(AddVariableContext);
  const addConditionEventSource = React.useContext(AddConditionContext);

  const [templateRoot, setTemplateRoot] = useState(templateInitial);

  const [previewIsOpen, setPreviewIsOpen] = useState(false);

  const openPreview = () => {
    setPreviewIsOpen(true);
  };

  const saveTemplate = async (event: any) => {
    await props.saveFunction(variableNames, templateRoot);
  };

  const closePreview = () => {
    setPreviewIsOpen(false);
  };

  const createButtonClickHandler = (varName: string) => {
    const clickHandler = () => {
      const callback = addVariableContext.callback;
      if (callback) {
        callback(varName);
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
          {variableNames?.map((varName: string) => (
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
          identityClass="text-input-wrapper"
        ></CompoundText>

        <div className="save-panel">
          <button className="button" onClick={openPreview}>
            Preview
          </button>
          <button className="button" onClick={saveTemplate}>
            Save
          </button>
          <Link to="/" className="button-link">
            Close
          </Link>
        </div>
      </div>

      <Modal isOpen={previewIsOpen}>
        {<PreviewPage previewClose={closePreview} template={templateRoot} variables={variableNames} />}
      </Modal>
    </div>
  );
}

export default MessageEditor;
