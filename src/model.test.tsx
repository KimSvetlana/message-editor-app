import {
  SimpleTextTemplate,
  CompoundTextTemplate,
  ConditionBlockTemplate,
} from "./model";

let mockSplitHandler = {
    onSplit: () => {},
    onDelete: () => {},
};

//Данный  Map будет использоваться в следующих 2х тестах
const variablesMap = new Map();
variablesMap.set("firstname", "Svetlana");
variablesMap.set("lastname", "Kim");
variablesMap.set("company", "Aurigma");
variablesMap.set("position", "front");

test("generate text from simple block without variables", () => {
  const simpleText = new SimpleTextTemplate("my first test", mockSplitHandler);
  const generatedText = simpleText.generateText(variablesMap);
  expect(generatedText).toEqual("my first test");
});

test("generate text from simple block with variables", () => {
  const simpleTextWithVariable = new SimpleTextTemplate(
    "My name is {firstname} {lastname}",
    mockSplitHandler
  );
  const generatedText = simpleTextWithVariable.generateText(variablesMap);
  expect(generatedText).toEqual("My name is Svetlana Kim");
});

test("generate text with one if block", () => {
  //Для тестирования тимплейта с одним уровнем вложенности создадим textWithIfBlock
  let textWithIfBlock = new CompoundTextTemplate("");

  //отдельно необходим if-else блок
  let conditionBlock = new ConditionBlockTemplate(mockSplitHandler);
  conditionBlock.ifBlock = new SimpleTextTemplate("{company}", mockSplitHandler);
  let thenBlock = new CompoundTextTemplate("");
  thenBlock._children = [
    new SimpleTextTemplate("Your company is {company}, right?", mockSplitHandler),
  ];
  conditionBlock.thenBlock = thenBlock;

  let elseBlock = new CompoundTextTemplate("");
  elseBlock._children = [new SimpleTextTemplate("Where do you work?", mockSplitHandler)];
  conditionBlock.elseBlock = elseBlock;

  // Добавляем в тимплейт textWithIfBlock его составляющие
  textWithIfBlock._children = [
    new SimpleTextTemplate("Hi {firstname}!", mockSplitHandler),
    conditionBlock,
    new SimpleTextTemplate("Bye!", mockSplitHandler),
  ];
  //создадим новый Map  переменных
  const newMap = new Map();
  // т.к тимплейт с условием  if {company}, эту переменную оставим пустой для тестирования ветки ELSE
  newMap.set("firstname", "Svetlana");
  newMap.set("lastname", "Kim");
  newMap.set("company", "");

  const generatedTextWithElse = textWithIfBlock.generateText(newMap);
  let expectedText = `Hi Svetlana!
Where do you work?

Bye!
`;
  expect(generatedTextWithElse).toEqual(expectedText);


  // т.к тимплейт с условием  if {company}, зададим эту переменную для тестирования ветки THEN
  newMap.set("company", "Аurigma");
  const generatedTextWithThen = textWithIfBlock.generateText(newMap);
  expectedText = `Hi Svetlana!
Your company is Аurigma, right?

Bye!
`;
  expect(generatedTextWithThen).toEqual(expectedText);  
});


test("generate text with two if block", () => {
    //Для тестирования тимплейта с двумя уровнями вложенности создадим textTemplate

    let textTemplate = new CompoundTextTemplate("");

    //создадим if-else блок первого уровня
    let conditionBlock = new ConditionBlockTemplate(mockSplitHandler);
    conditionBlock.ifBlock = new SimpleTextTemplate("{company}", null);
    let thenBlock = new CompoundTextTemplate("");

    // создадим if-else блок второго уровня уровня
    let innerConditionBlock = new ConditionBlockTemplate(mockSplitHandler);
    innerConditionBlock.ifBlock = new SimpleTextTemplate("{position}", null);
    let innerThenBlock = new CompoundTextTemplate("");
    innerThenBlock._children = [
        new SimpleTextTemplate("Your position is {position}?", null),
    ];
    innerConditionBlock.thenBlock = innerThenBlock;

    let innerElseBlock = new CompoundTextTemplate("");
    innerElseBlock._children = [new SimpleTextTemplate( 
        "What is your position?", null)];
    innerConditionBlock.elseBlock = innerElseBlock;

    //добавим все childs  к thenBlock
    thenBlock._children = [
      new SimpleTextTemplate("Your company is {company}, right?", null),
      innerConditionBlock,
      new SimpleTextTemplate("", null),
    ];
    conditionBlock.thenBlock = thenBlock;
  
    let elseBlock = new CompoundTextTemplate("");
    elseBlock._children = [new SimpleTextTemplate("Where do you work?", null)];
    conditionBlock.elseBlock = elseBlock;
  
    // Добавляем в тимплейт textWithIfBlock его составляющие
    textTemplate._children = [
      new SimpleTextTemplate("Hi {firstname}!", null),
      conditionBlock,
      new SimpleTextTemplate("Bye!", null),
    ];

    //создадим новый Map  переменных
    const newMap = new Map();
  
    // textTemplate два уровня вложенности. If-else блок первого уровня имеет переменнyю  {company},
    // If-else блок в торого уровня имеет переменнyю {position},  
    // оставим  переменные {company} и  {position} без заданных значенй 
    newMap.set("firstname", "Svetlana");
    newMap.set("lastname", "Kim");
    newMap.set("company", "");
    newMap.set("position", "");

    const newGeneratedText = textTemplate.generateText(newMap);
  let newExpectedText = `Hi Svetlana!
Where do you work?

Bye!
`;
  expect(newGeneratedText).toEqual(newExpectedText);

 
    // т.к if-else блок первого уровня имеет вложенность с условием if{position}, то зададим переменнyю  {company} 
    // оставив переменную  {position} для тестирования ветки  ELSE второго уровня вложенности
    
    newMap.set("company", "Aurigma");
    newMap.set("position", "");

    const generatedText = textTemplate.generateText(newMap);
    const expectedText = `Hi Svetlana!
Your company is Aurigma, right?
What is your position?



Bye!
`;
expect(generatedText).toEqual(expectedText); 


// зададим переменную  {position} для тестирования ветки  THEN второго уровня вложенности

newMap.set("position", "Front");

const text = textTemplate.generateText(newMap);
const expected = `Hi Svetlana!
Your company is Aurigma, right?
Your position is Front?



Bye!
`;
    expect(text).toEqual(expected);  
  });


