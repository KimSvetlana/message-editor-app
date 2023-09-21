import React from "react";
import { SimpleText } from "./components/simpleText/simpleText";
import { CompoundText } from "./components/compoundText/compoundText";
import ConditionBlock from "./components/conditionBlock/conditionBlock";
import { parse as deserialize, stringify as serialize } from 'flatted';

type ComponentFunc = (props: any) => JSX.Element;

export interface ITemplateElement {
  generateText(variables: Map<string, string>): string;
  // TODO: модель и компоненты здесь связаны
  correspondingComponent(): ComponentFunc;
  get id(): number;
}

interface ISplitHandler {
  onSplit(source: ITemplateElement, rightPart: string): void;
  onDelete(source: ITemplateElement): void;
}

let counter = 0;

export class SimpleTextElement implements ITemplateElement {
  readonly itemType: string = 'SimpleTextElement';

  _id: number;
  _simpleText: string;
  _splitHandler: ISplitHandler | null;
  constructor(text: string, splitHandler: ISplitHandler | null) {
    this._id = counter;
    counter += 1;
    this._simpleText = text;
    this._splitHandler = splitHandler;
  }

  get id(): number {
    return this._id;
  }

  correspondingComponent(): ComponentFunc {
    return SimpleText;
  }

  split(pos: number): void {
    if (!this._splitHandler) {
      console.log("can't split, no handler");
      return;
    }

    if (pos > this._simpleText.length) {
      throw new Error("splitting pos is out of range");
    }
    this._splitHandler.onSplit(
      this,
      this._simpleText.substring(pos)
    );
    this._simpleText = this._simpleText.substring(0, pos);
  }

  get simpleText() {
    return this._simpleText;
  }

  set simpleText(value: string) {
    this._simpleText = value;
  }

  generateText(variables: Map<string, string>): string {
    let res = "";
    let readingVariable = false;
    let variableName = "";
    for (let letter of this._simpleText) {
      switch (letter) {
        case '{':
          if (!readingVariable) {
            readingVariable = true;
            variableName = "";
          }else {
            variableName += letter;
          }
          break;
        case '}':
          if (readingVariable) {
            if (variables.has(variableName)) {
              res += variables.get(variableName);
            } else {
              res += `{${variableName}}`;
            }

            readingVariable = false;
            variableName = ""; 
          } else {
            res += letter;
          }
          break;
        default:
          if (readingVariable) {
            variableName += letter;
          } else {
            res += letter;
          }
          break;
      }
    }

    return res;
  }
}

export class CompoundTextElement implements ITemplateElement, ISplitHandler {
  readonly itemType: string = 'CompoundTextElement';

  _children: Array<ITemplateElement>;
  _childrenChangedListener: ((children: Array<ITemplateElement>) => void) | null;
  _id: number;

  constructor(text: string) {
    this._children = [new SimpleTextElement(text, this)];
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

  get children(): Array<ITemplateElement> {
    return this._children;
  }

  onSplit(source: ITemplateElement, rightPart: string): void {
    const childIndex = this._children.findIndex((element) => {
      return element === source;
    });
    if (childIndex === -1) {
      console.log(
        `ignore split from child that is no longer in children, id: ${source.id}`
      );
      return;
    }

    let newItems: Array<ITemplateElement> = [
      new ConditionBlockElement(this),
      new SimpleTextElement(rightPart, this),
    ];
    this._children.splice(childIndex + 1, 0, ...newItems);

    if (this._childrenChangedListener) {
      this._childrenChangedListener([...this._children]);
    }
  }
  correspondingComponent() : ComponentFunc {
    return CompoundText;
  }
  generateText(variables: Map<string, string>): string {
    let res = "";
    this._children.forEach((child) => {
      res += child.generateText(variables);
    });

    return res;
  }

  onDelete(source: ITemplateElement) {
    this._children = this.children.filter((child) => child.id !== source.id);

    let newText = this.generateText(new Map());
    let newItem = new SimpleTextElement(newText, this);
    this._children.splice(0, this._children.length, newItem);

    if (this._childrenChangedListener) {
      this._childrenChangedListener([...this._children]);
    }
  }
}

export class ConditionBlockElement implements ITemplateElement {
  readonly itemType: string = 'ConditionBlockElement';

  ifBlock: SimpleTextElement = new SimpleTextElement(
    "<put condition here>",
    null
  );
  thenBlock: CompoundTextElement = new CompoundTextElement(
    "<put then text here>"
  );
  elseBlock: CompoundTextElement = new CompoundTextElement(
    "<put else text here>"
  );

  _id: number;
  _delete: any;
  _splitHandler: ISplitHandler | null;

  constructor(splitHandler: ISplitHandler | null) {
    this._splitHandler = splitHandler;
    this._id = counter;
    counter += 1;
  }

  get id(): number {
    return this._id;
  }

  generateText(variables: Map<string, string>): string {
    const ifEvaluated = this.ifBlock.generateText(variables);
    if (ifEvaluated.length > 0) {
      return this.thenBlock.generateText(variables);
    } else {
      return this.elseBlock.generateText(variables);
    }
  }

  correspondingComponent(): ComponentFunc {
    return ConditionBlock;
  }

  delete() {
    this._splitHandler?.onDelete(this);
  }
}

// Источник событий добавления условного блока
export class AddConditionEventSource {
  _callback: any;

  get callback(): any {
    return this._callback;
  }

  set callback(value: any) {
    this._callback = value;
  }
}

// Источник событий добавления переменной
export class AddVariableEventSource {
  private _callback: ((variableName: string) => void) | null = null;
  private _variable: string;
  constructor(variable: string) {
    this._variable = variable;
  }
  get callback(): ((variableName: string) => void) | null {
    return this._callback;
  }
  set callback(value:((variableName: string) => void) | null) {
    this._callback = value;
  }
}

export const AddConditionContext = React.createContext(
  new AddConditionEventSource()
);

export const AddVariableContext = React.createContext(
  new AddVariableEventSource("")
);

export function deserializeTemplate(data: string) : CompoundTextElement
{
  let reviver = (key: any, value: any) => {
    if (value && typeof(value) == "object" && value.itemType) {
      switch (value.itemType) {
        case "ConditionBlockElement":
          return Object.assign(new ConditionBlockElement(null), value);
        case "SimpleTextElement":
          return Object.assign(new SimpleTextElement("", null), value);
        case "CompoundTextElement":
          return Object.assign(new CompoundTextElement(""), value);
        default:
          throw new Error(`unknown itemType: ${value.itemType}`);
      }
    }

    return value;
  }

  let parsedTemplate = deserialize(data, reviver);
  return Object.assign(parsedTemplate, CompoundTextElement);
}

export function serializeTemplate(template: CompoundTextElement) : string
{
  return serialize(template);
}
