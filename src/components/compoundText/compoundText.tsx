import React, { useState } from "react";
import "../messageEditor/messageEditor.css";
import { CompoundTextElement, ITemplateElement } from "../../model";

export interface ICompoundTextProps {
  templateObject: CompoundTextElement;
  identityClass?: string;
}

export function CompoundText(props: ICompoundTextProps) {
  const compoundText = props.templateObject as CompoundTextElement;
  const [children, setChildren] = useState(compoundText._children);

  compoundText.childrenChangedListener = (
    newChildren: Array<ITemplateElement>
  ) => {
    setChildren(newChildren);
  };

  const compoundTextClassName = props.identityClass ? props.identityClass : "";

  return (
    <div className={compoundTextClassName}>
      {children.map((child) => (
        <div key={child.id}>
          {React.createElement(
            child.correspondingComponent(),
            { templateObject: child },
            child.id
          )}
        </div>
      ))}
    </div>
  );
}
