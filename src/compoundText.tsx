import React, { useState } from "react";
import "./messageEditor.css";

import {CompoundTextTemplate, ITextTemplate} from  "./utils";


export function CompoundText(props:any) {
    const compoundText = props.templateObject as CompoundTextTemplate;
    const [children, setChildren] = useState(compoundText.children);

    compoundText.childrenChangedListener = (newChildren: Array<ITextTemplate>) => {
        console.log("children changed: ", newChildren);
        // setCompoundTemplate(compoundTemplate);
        setChildren(newChildren);
    }
    
    return (
        <div>
            {children.map((child) => (
                <div key={child.id}>{React.createElement(child.render(), {"templateObject": child}, child.id)}</div>
            ))}
        </div>
    );
}