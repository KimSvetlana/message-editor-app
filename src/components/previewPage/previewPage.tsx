import { useState } from "react";
import "./previewPage.css";
import { CompoundTextElement } from "../../model";

export interface IPreviewPageProps {
  variables: Array<string>;
  template: CompoundTextElement;
  previewClose: () => void;
}

function PreviewPage(props: IPreviewPageProps) {
  let variableNames = props.variables;

  let variablesInitial = new Map<string, string>(
    variableNames.map((varName: string) => [varName, ""])
  );
  const [variableValues, setVariableValues] = useState(variablesInitial);
  const [displayText, setDisplayText] = useState(
    props.template.generateText(variablesInitial)
  );

  const inputHandler = (varName: string) => {
    const inputChange = (event: any) => {
      let value = event.target.value;
      variableValues.set(varName, value);
      setDisplayText(props.template.generateText(variableValues));
    };

    return inputChange;
  };

  return (
    <div className="preview-page">
      <div className="page-content">
        <div className="preview-header">
          <h3>Message preview</h3>
          <button
            className="button-x"
            name="close"
            onClick={props.previewClose}
          >
            X
          </button>
        </div>
        <div className="preview-content">{displayText}</div>
        <div className="preview-variables">
          <h3>Variables: </h3>
          <div className="variables-group">
            {variableNames?.map((varName: string) => (
              <div className="group" key={`div_${varName}`}>
                <label key={`label_${varName}`} htmlFor={`input_${varName}`}>
                  {`${varName}: `}
                </label>
                <input
                  key={varName}
                  id={`input_${varName}`}
                  className="input"
                  onChange={inputHandler(varName)}
                ></input>
              </div>
            ))}
          </div>
        </div>
        <button
          className="close-button"
          name="close"
          onClick={props.previewClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
