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
    onDelete(source: ITextTemplate): void;
}

let counter = 0;

export class SimpleTextTemplate implements ITextTemplate {
    _id: number;
    _simpleText: string;
    _splitHandler: ISplitHandler | null;
    constructor(text: string, splitHandler: ISplitHandler | null){
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
        if (!this._splitHandler) {
            console.log("can't split, no handler");
            return;
        }

        // console.log(`split(${pos}) text=${this._simpleText}`)
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

    get children(): Array<ITextTemplate> {
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
          new ConditionBlockTemplate(this),
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
            res += child.generateText(variables) + "\n";
        });

        return res;
    }

    onDelete(source: ITextTemplate){
        this._children = this.children.filter((child) => child.id !== source.id);
        if (this._childrenChangedListener) {
            this._childrenChangedListener([...this._children]);
        }
        let newText = this.generateText(new Map());
        let newItem = new  SimpleTextTemplate(newText, this);
        this._children.splice(0, this._children.length, newItem);
        if (this._childrenChangedListener) {
            this._childrenChangedListener([...this._children]);
        }

        console.log(`delete inside compound block, children: ${this._children}`)
    }
};

export class ConditionBlockTemplate implements ITextTemplate {
    ifBlock: SimpleTextTemplate = new SimpleTextTemplate("put condition here", null);
    thenBlock: CompoundTextTemplate = new CompoundTextTemplate("put then else text here");
    elseBlock: CompoundTextTemplate = new CompoundTextTemplate("put else text here");

    _id: number;
    _delete:any;
    _splitHandler: ISplitHandler;

    constructor(splitHandler: ISplitHandler) {
        this._splitHandler = splitHandler;
        this._id = counter;
        counter +=1;
    }

    get id(): number {
        return this._id;
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

    delete() {
        this._splitHandler.onDelete(this);
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

export class AddVariableEventSource {
    private _callback: any;
    private _variable: string
    constructor(variable: string){
        this._variable = variable;
    }
    get callback() : any {
        return this._callback;
    }
    set callback(value: any) {
        this._callback = value;
    }

    get variable() : any {
        return this._variable;
    }
    set variable(value: any) {
        this._variable = value;
    }
}

export const AddConditionContext = React.createContext(new AddConditionEventSource());

export const AddVariableContext = React.createContext(new AddVariableEventSource(''));
