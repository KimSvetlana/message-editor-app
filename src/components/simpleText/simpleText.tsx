import React, { useContext, useState } from "react";
import "./simpleText.css";
import {
  SimpleTextTemplate,
  AddConditionContext,
  AddConditionEventSource,
  AddVariableEventSource,
  AddVariableContext,
} from "../../model";
import TextareaAutosize from "react-textarea-autosize";

export function SimpleText(props: any) {
  const [simpleText, setSimpleText] = useState(
    props.templateObject as SimpleTextTemplate
  );
  let [displayText, setDisplayText] = useState(simpleText.simpleText);

  const addConditionEventSource: AddConditionEventSource =
    useContext(AddConditionContext);
  const addVariableEventSource: AddVariableEventSource =
    useContext(AddVariableContext);

  const simpleTextClass = props.identityClass
    ? props.identityClass
    : "simple-text ";

  const numberOfRows = props.identityClass ? 1 : 5;

  const onTextChange = (event: any) => {
    simpleText.simpleText = event.target.value;
    const cursorPos: number = event.target.selectionStart;

    addConditionEventSource.callback = () => {
      simpleText.split(cursorPos);
    };
    setDisplayText(event.target.value);

    addVariableEventSource.callback = () => {
      let variableName = `{${addVariableEventSource.variable}}`;
      let newText =
        displayText.slice(0, cursorPos) +
        variableName +
        displayText.slice(cursorPos);
      simpleText.simpleText = newText;
      displayText = newText;
      setDisplayText(newText);
    };
  };

  return (
    <TextareaAutosize
      minRows={numberOfRows}
      className={simpleTextClass}
      onChange={onTextChange}
      onSelect={onTextChange}
      value={displayText}
    />
  );
}
