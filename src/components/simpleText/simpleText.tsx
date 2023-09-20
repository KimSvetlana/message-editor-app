import { useContext, useState } from "react";
import "./simpleText.css";
import {
  SimpleTextElement,
  AddConditionContext,
  AddConditionEventSource,
  AddVariableEventSource,
  AddVariableContext,
} from "../../model";
import TextareaAutosize from "react-textarea-autosize";

export interface ISimpleTextProps {
  templateObject:  SimpleTextElement;
  identityClass?: string;
}

export function SimpleText(props: ISimpleTextProps) {
  const [simpleText, setSimpleText] = useState(
    props.templateObject as SimpleTextElement
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

    addVariableEventSource.callback = (variable: string) => {
      let variableNameInsertion = `{${variable}}`;
      let newText =
        displayText.slice(0, cursorPos) +
        variableNameInsertion +
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
