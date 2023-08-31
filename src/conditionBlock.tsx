import React, { useState } from "react";
import "./messageEditor.css";
import {ConditionBlockTemplate} from "./utils"
import { SimpleText } from "./simpleText";
import { CompoundText } from "./compoundText";


function ConditionBlock(props:any) {
    //   const [childBlocks, setChildBlocks] = useState(new Array<String>());
        console.log('variable name!!!', props.variableName);

        const [templateObject, setTemplateObject] = useState(props.templateObject as ConditionBlockTemplate)
    
      const [conditionBlockState, setConditionState] = useState({
        ifBlock: '',
        thenBlock: '',
        elseBlock: '',
       });
      const [position, setPos] = useState(0);
    
      const conditionBlockChange = (event: any) => {
        // const {name, value} = event.target;
        // setConditionState((prev) => ({
        //     ...prev,
        //     [name]: value,
        // }));
        // setPos(event.target.selectionStart);
        // props.conditionChange(JSON.stringify(conditionBlockState))
        // console.log('conditionBlockState',conditionBlockState)
      };
    
      const variableChange = (props: any) => {
        // console.log('variable name', props.variableName)
      }
    
    //   const [variable, setVariable] = useState(props.variableName)
    
    
      return (
        <div className="condition-block">
          <div className="condition-group">
            <label htmlFor="if-input" className="label-input">
              if
            </label>
            <button className="delete-button" onClick={props.deleteBlock}>
              Delete
            </button>
            <SimpleText templateObject={templateObject.ifBlock} identityClass='condition-text-if'></SimpleText>
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