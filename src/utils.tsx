import React, { useState, createContext } from "react";
import { SimpleText } from "./simpleText"
import { CompoundText } from "./compoundText";
import "./conditionBlock"
import ConditionBlock from "./conditionBlock";


export interface ITextTemplate {
    generateText (variables:Map<String, String>): string;
    render (): any;
    get id (): number;
};

interface ISplitHandler {
    onSplit(source: ITextTemplate, leftPart: string, rightPart: string) : void;
}

let counter = 0;

export class SimpleTextTemplate implements ITextTemplate {
    _id: number;
    _simpleText: string;
    _splitHandler: ISplitHandler;
    constructor(text: string, splitHandler: ISplitHandler){
        this._id = counter;
        counter += 1;
        this._simpleText = text;
        this._splitHandler = splitHandler;
    }

    get id(): number {
        return this._id;
    }

    render(): any {
        return SimpleText;
    }

    split(pos: number): void {
        console.log(`split(${pos}) text=${this._simpleText}`)
        if (pos > this._simpleText.length) {
            throw new Error("splitting pos is out of range");
        }
        this._splitHandler.onSplit(
          this,
          this._simpleText.substring(0, pos),
          this._simpleText.substring(pos)
        );
    }

    get simpleText() {
        return this._simpleText;
    }

    set simpleText(value: string) {
        this._simpleText = value;
    }

    generateText (variables:Map<String, String>): string {
        return this._simpleText;
    }
};

export class CompoundTextTemplate implements ITextTemplate, ISplitHandler {
    _children:  Array<ITextTemplate>
    _childrenChangedListener: any;
    _id: number;
    constructor(text: string){
        this._children = [new SimpleTextTemplate(text, this)];
        this._childrenChangedListener = null;
        this._id = counter;
        counter += 1;
    }
    get id(): number {
        return this._id;
    }

    set childrenChangedListener(value: any) {
        this._childrenChangedListener = value;
    }

    get children() : Array<ITextTemplate> {
        return this._children;
    }

    onSplit(source: ITextTemplate, leftPart: string, rightPart: string): void {
        const childIndex = this._children.findIndex((element) => {return element === source;});
        if (childIndex == -1) {
           console.log(`ignore split from child that is no longer in children, id: ${source.id}`);
           return;
        }
        
        let newItems: Array<ITextTemplate> = [
          new SimpleTextTemplate(leftPart, this),
          new ConditionBlockTemplate(),
          new SimpleTextTemplate(rightPart, this),
        ];
        this._children.splice(childIndex, 1, ...newItems);

        if (this._childrenChangedListener) {
            this._childrenChangedListener([...this._children]);
        }
    }
    render() {
        return CompoundText;
    }
    generateText (variables:Map<String, String>): string {
        let res = "";
        this._children.forEach(child => {
            res += child.generateText(variables);
        });

        return res;
    }
};

export class ConditionBlockTemplate implements ITextTemplate, ISplitHandler {
    ifBlock: SimpleTextTemplate = new SimpleTextTemplate("put condition here", this);
    thenBlock: CompoundTextTemplate = new CompoundTextTemplate("put then else text here");
    elseBlock: CompoundTextTemplate = new CompoundTextTemplate("put else text here");
    _id: number;

    constructor() {
        this._id = counter;
        counter +=1;
    }

    get id(): number {
        return this._id;
    }

    onSplit(source: ITextTemplate, leftPart: string, rightPart: string): void {
        console.log("ignore split inside if block");
    }
    
    generateText(variables: Map<String, String>): string {
        const ifEvaluated = this.ifBlock.generateText(variables);
        if (ifEvaluated.length > 0) {
            return this.thenBlock.generateText(variables);
        } else {
            return this.elseBlock.generateText(variables);
        }
    }

    render() : any {
        return ConditionBlock;
    }
    
}

export class AddConditionEventSource {
    _callback: any;

    get callback() : any {
        return this._callback;
    }

    set callback(value: any) {
        this._callback = value;
    }
}

export const AddConditionContext = React.createContext(new AddConditionEventSource());

