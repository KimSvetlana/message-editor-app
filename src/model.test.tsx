import {
  SimpleTextElement,
  CompoundTextElement,
  ConditionBlockElement,
} from "./model";

let mockSplitHandler = {
    onSplit: () => {},
    onDelete: () => {},
};


const variablesMap = new Map();
variablesMap.set("firstname", "Svetlana");
variablesMap.set("lastname", "Kim");
variablesMap.set("company", "Aurigma");
variablesMap.set("position", "front");

test("generate text from simple block without variables", () => {
  const simpleText = new SimpleTextElement("my first test", mockSplitHandler);
  const generatedText = simpleText.generateText(variablesMap);
  expect(generatedText).toEqual("my first test");
});

test("generate text from simple block with variables", () => {
  const simpleTextWithVariable = new SimpleTextElement(
    "My name is {firstname} {lastname}",
    mockSplitHandler
  );
  const generatedText = simpleTextWithVariable.generateText(variablesMap);
  expect(generatedText).toEqual("My name is Svetlana Kim");
});

test("generate text with one if block", () => {
  //Для тестирования шаблона с одним уровнем вложенности создадим textWithIfBlock
  let textWithIfBlock = new CompoundTextElement("");

  //отдельно необходим if-else блок
  let conditionBlock = new ConditionBlockElement(mockSplitHandler);
  conditionBlock.ifBlock = new SimpleTextElement("{company}", mockSplitHandler);
  let thenBlock = new CompoundTextElement("");
  thenBlock._children = [
    new SimpleTextElement("Your company is {company}, right?", mockSplitHandler),
  ];
  conditionBlock.thenBlock = thenBlock;

  let elseBlock = new CompoundTextElement("");
  elseBlock._children = [new SimpleTextElement("Where do you work?", mockSplitHandler)];
  conditionBlock.elseBlock = elseBlock;

  // Добавляем в шаблон textWithIfBlock его составляющие
  textWithIfBlock._children = [
    new SimpleTextElement("Hi {firstname}!", mockSplitHandler),
    conditionBlock,
    new SimpleTextElement("Bye!", mockSplitHandler),
  ];
  
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


  // зададим переменную {company} для тестирования ветки THEN
  newMap.set("company", "Aurigma");
  const generatedTextWithThen = textWithIfBlock.generateText(newMap);
  expectedText = `Hi Svetlana!
Your company is Aurigma, right?

Bye!
`;
  expect(generatedTextWithThen).toEqual(expectedText);  
});


test("generate text with two if block", () => {
    //Для тестирования шаблона с двумя уровнями вложенности создадим textTemplate

    let textTemplate = new CompoundTextElement("");

    //создадим if-else блок первого уровня
    let conditionBlock = new ConditionBlockElement(mockSplitHandler);
    conditionBlock.ifBlock = new SimpleTextElement("{company}", null);
    let thenBlock = new CompoundTextElement("");

    // создадим if-else блок второго уровня уровня
    let innerConditionBlock = new ConditionBlockElement(mockSplitHandler);
    innerConditionBlock.ifBlock = new SimpleTextElement("{position}", null);
    let innerThenBlock = new CompoundTextElement("");
    innerThenBlock._children = [
        new SimpleTextElement("Your position is {position}?", null),
    ];
    innerConditionBlock.thenBlock = innerThenBlock;

    let innerElseBlock = new CompoundTextElement("");
    innerElseBlock._children = [new SimpleTextElement( 
        "What is your position?", null)];
    innerConditionBlock.elseBlock = innerElseBlock;

    //добавим все childs  к thenBlock
    thenBlock._children = [
      new SimpleTextElement("Your company is {company}, right?", null),
      innerConditionBlock,
      new SimpleTextElement("", null),
    ];
    conditionBlock.thenBlock = thenBlock;
  
    let elseBlock = new CompoundTextElement("");
    elseBlock._children = [new SimpleTextElement("Where do you work?", null)];
    conditionBlock.elseBlock = elseBlock;
  
    // Добавляем в шаблон textWithIfBlock его составляющие
    textTemplate._children = [
      new SimpleTextElement("Hi {firstname}!", null),
      conditionBlock,
      new SimpleTextElement("Bye!", null),
    ];

    
    const newMap = new Map();
  
    // textTemplate имеет два уровня вложенности. If-else блок первого уровня имеет переменнyю  {company},
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


