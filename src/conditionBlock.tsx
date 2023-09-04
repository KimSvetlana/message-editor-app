import React, { useState } from "react";
import "./messageEditor.css";
import { ConditionBlockTemplate } from "./utils";
import { SimpleText } from "./simpleText";
import { CompoundText } from "./compoundText";

function ConditionBlock(props: any) {
  const [templateObject, setTemplateObject] = useState(
    props.templateObject as ConditionBlockTemplate
  );

  const onClickDelete = () => {
    templateObject.delete();
  };

  return (
    <div className="condition-block">
      <div className="condition-group">
        <label htmlFor="if-input" className="label-input">
          if
        </label>
        <button className="delete-button" onClick={onClickDelete}>
          Delete
        </button>
        <SimpleText
          templateObject={templateObject.ifBlock}
          identityClass="condition-text-if"
        ></SimpleText>
      </div>
      <div className="condition-group">
        <label htmlFor="then-input" className="label-input">
          then
        </label>
        <CompoundText templateObject={templateObject.thenBlock}></CompoundText>
      </div>
      <div className="condition-group">
        <label htmlFor="else-input" className="label-input">
          else
        </label>
        <CompoundText templateObject={templateObject.elseBlock}></CompoundText>
      </div>
    </div>
  );
}

export default ConditionBlock;
