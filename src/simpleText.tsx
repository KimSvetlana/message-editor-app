import React, { useContext, useState } from "react";
import "./simpleText.css";
import {SimpleTextTemplate, AddConditionContext, AddConditionEventSource} from "./utils"

export function SimpleText(props: any) {
    const [simpleText, setSimpleText] = useState(props.templateObject as SimpleTextTemplate);
    const addConditionEventSource: AddConditionEventSource = useContext(AddConditionContext);
    const [displayText, setDisplayText] = useState(simpleText.simpleText);
    const simpleTextClass = props.identityClass ? props.identityClass : 'simple-text '

    const onTextChange = (event: any) => {
        simpleText.simpleText = event.target.value;
        const cursorPos: number = event.target.selectionStart;
        console.log("cursorPos: ", cursorPos);
        addConditionEventSource.callback = () => {
            simpleText.split(cursorPos);
        }
        setDisplayText(event.target.value);
    };

    return (
        <textarea className={simpleTextClass} onChange={onTextChange} onSelect={onTextChange} value={displayText}></textarea>
    );
}