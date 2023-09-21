import {
    CompoundTextElement,
    serializeTemplate,
    deserializeTemplate,
  } from "./model";

export function loadVariables() {
    return localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstname", "lastname", "company", "position"];
}

export function loadTemplate(){
    return localStorage.template
    ? deserializeTemplate(localStorage.template)
    : new CompoundTextElement("initial text");
}


export async function saveTemplate(variables: Array<string>, templateRoot: CompoundTextElement) {
    await localStorage.setItem("arrVarNames", JSON.stringify(variables));
    let serializedTemplate = serializeTemplate(templateRoot);
    await localStorage.setItem("template", serializedTemplate);
};