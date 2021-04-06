export enum JamesAlgebraContainer {
  Round = "Round",
  Square = "Square",
  Angle = "Angle",
}

export interface JamesAlgebraContainerForm {
  formType: "container",
  root?: JamesAlgebraContainer,
  children: Array<JamesAlgebraForm>,
}

export interface JamesAlgebraVariableForm {
  formType: "variable",
  name: string,
}

export type JamesAlgebraForm =
  | JamesAlgebraContainerForm
  | JamesAlgebraVariableForm


export function makeVariableForm(name: string) : JamesAlgebraVariableForm {
  return {
    formType: "variable",
    name,
  }
}

export function makeRootedForm(
  root: JamesAlgebraContainer,
  children: Array<JamesAlgebraForm>
)  : JamesAlgebraContainerForm {
  return {
    formType: "container",
    root,
    children,
  }
}

export function makeImplicitContainerForm(children: Array<JamesAlgebraForm>): JamesAlgebraContainerForm {
  return {
    formType: "container",
    children,
  }
}

export function makeRoundContainerForm(children: Array<JamesAlgebraForm>) {
  return makeRootedForm(JamesAlgebraContainer.Round, children);
}

export function makeSquareContainerForm(children: Array<JamesAlgebraForm>) {
  return makeRootedForm(JamesAlgebraContainer.Square, children);
}

export function makeAngleContainerForm(children: Array<JamesAlgebraForm>) {
  return makeRootedForm(JamesAlgebraContainer.Angle, children);
}

export function makeVoidForm() : JamesAlgebraContainerForm {
  return makeImplicitContainerForm([]);
}

export function makeUnitForm() : JamesAlgebraContainerForm {
  return makeRoundContainerForm([]);
}

export function makeSquareForm() : JamesAlgebraContainerForm {
  return makeSquareContainerForm([]);
}

export function makeDiamondForm() : JamesAlgebraContainerForm {
  return makeAngleContainerForm([]);
}

export function makeJForm() : JamesAlgebraContainerForm {
  return makeSquareContainerForm(
    [makeAngleContainerForm(
      [makeRoundContainerForm([])]
    )]
  );
}

export function makeDivByZeroForm() : JamesAlgebraContainerForm {
  return makeRoundContainerForm(
    [makeAngleContainerForm(
      [makeSquareContainerForm([])]
    )]
  );
}

export function makeCountingNumberForm(n: number): JamesAlgebraContainerForm{
  if (!Number.isInteger(n) && n > 0) {
    throw Error("argument must be a positive integer");
  }
  const units = Array.from({length: n}).map(x => makeUnitForm());
  return makeImplicitContainerForm(units);
}

export function makeMultForm(multiplicands: Array<JamesAlgebraForm>) : JamesAlgebraContainerForm {
  return makeRoundContainerForm(
    multiplicands.map(form => makeSquareContainerForm([form])));

}

export class JamesAlgebraFormRenderer {
  static renderToString(f: JamesAlgebraForm): string {
    let s: string = "";
    let startSymbol = "";
    let endSymbol = "";
    if (f.formType == "container") {
      if (f.root) {
        switch (f.root) {
          case JamesAlgebraContainer.Round:
            startSymbol = "(";
            endSymbol = ")";
            break;
          case JamesAlgebraContainer.Square:
            startSymbol = "[";
            endSymbol = "]";
            break;
          case JamesAlgebraContainer.Angle:
            startSymbol = "<";
            endSymbol = ">";
            break;
        }
      }
      s = s + startSymbol;
      if (f.children.length > 0) {
        for(var i = 0; i < f.children.length; i++) {
          s = s + this.renderToString(f.children[i]);
        }
      } else {
        s = s + " ";
      }
      s = s + endSymbol;
    } else {
      // variable
      s = s + f.name;
    }
    return s;
  }

}

export interface ResultOk<T, E> {
  resultType: "ok";
  value: T;
}

export interface ResultErr<T, E> {
  resultType: "err";
  error: E;
}

export type Result<T, E> =
  | ResultOk<T, E>
  | ResultErr<T, E>

export function makeOk<T, E>(value: T) : ResultOk<T, E> {
  return {
    resultType: "ok",
    value,
  }
}

export function makeErr<T, E>(error: E) : ResultErr<T, E> {
  return {
    resultType: "err",
    error,
  }
}

export interface JamesAlgebraFormParseInfo {
  result: JamesAlgebraForm;
}

function containerSymbolToEnum(sym: string) : JamesAlgebraContainer {
  return ["[", "]"].includes(sym)
    ? JamesAlgebraContainer.Square
    : ["(", ")"].includes(sym)
    ? JamesAlgebraContainer.Round
    : JamesAlgebraContainer.Angle;
}

export class JamesAlgebraFormParser {
  containerStack: Array<JamesAlgebraContainer>;
  // formQueue: Array<JamesAlgebraForm>;
  inputText: string;

  constructor() {
    this.containerStack = [];
    // this.formQueue = [];
    this.inputText = null;
  }

  private prepareParse(text: string) {
    this.containerStack = [];
    // this.formQueue = [];
    this.inputText = text;
  }

  parse(text: string) : JamesAlgebraForm {
    let inputText = text.trim();
    if (inputText.length === 0) {
      return makeVoidForm();
    }
    this.prepareParse(inputText);

    let forms = this.parseLevel();

    if (this.inputText.length > 0) {
      throw new Error(`Parse failed, unexpected char: '${this.inputText[0]}'`);
    }

    if (forms.length === 1) {
      return forms[0];
    }

    return {
      formType: "container",
      children: forms,
    }
  }

  parseLevel() : JamesAlgebraForm[] {
    let formQueue: Array<JamesAlgebraForm> = [];

    this.inputText = this.inputText.trim();
    console.log(" >> parseLevel, after trim inputText = ", this.inputText);
    if (this.inputText.length === 0) {
      console.log(" >> parseLevel, trimmed is empty")
      return [];
    }
    let forms: JamesAlgebraForm[] = [];
    const variableNameRegex = "/^[a-zA-Z][a-zA-Z0-9]*/";
    const openContainerSymbols = ["[", "(", "<"];
    const containerSymbols = ["[", "]", "(", ")", "<", ">"];
    while (this.inputText.length > 0) {
      // check if its a variable name
      // [a-zA-Z] [a-zA-Z0-9_]*
      let variableNameMatch = this.inputText.match(variableNameRegex);
      if (variableNameMatch && variableNameMatch.length > 0) {
        console.log(" .. match = ", variableNameMatch);
        // forms.push(makeVariableForm())
        // continue
        throw new Error("not yet implemented: variable name parsing");
      }
      const firstChar = this.inputText.charAt(0);
      if (!containerSymbols.includes(firstChar)) {
        throw new Error(`Unrecognized char: ${firstChar}`);
      }
      const containerType = containerSymbolToEnum(firstChar);
      if (openContainerSymbols.includes(firstChar)) {
        this.inputText = this.inputText.substring(1).trim();
        console.log(" >>> after initial substring/trim, inputText = ", this.inputText);
        this.containerStack.push(containerType);

        // let children = this.parseLevel();
        // for (var i = 0; i < children.length; i++) {
        //   formQueue.push(children[i]);
        // }
        // console.log(" >>> after parseLevel, (children, inputText) = ", children, this.inputText);
      } else {
        console.log(" >>> closing container, inputText = ", this.inputText);
        // closing container
        if (this.containerStack.length === 0) {
          // throw new Error("Mismatch, found closing container, but opening container is missing");
          // we've found end of level, so break out of loop
          break;

        } else if(this.containerStack[0] !== containerType) {
          throw new Error("Mismatch, closing container does not match opening container");
        }
        switch(containerType) {
          case JamesAlgebraContainer.Round:
            forms.push(makeRoundContainerForm(formQueue));
            break;
          case JamesAlgebraContainer.Square:
            forms.push(makeSquareContainerForm(formQueue));
            break;
          case JamesAlgebraContainer.Angle:
            forms.push(makeAngleContainerForm(formQueue));
            break;
        }
        this.inputText = this.inputText.substring(1);
        this.containerStack.pop();
        formQueue = [];
      }
    }
    console.log(" >> returning from parseLevel, (inputText, forms) = ", this.inputText, forms);
    return forms;
  }

  parseAllForms() : JamesAlgebraForm[] {
    this.inputText = this.inputText.trim();
    if (this.inputText.length === 0) {
      return [];
    }
    let forms: JamesAlgebraForm[] = [];
    let results = this.parseLevel();
    while (this.inputText.length > 0 && ![')', ']', '>'].includes(this.inputText.charAt(0))) {
      let nextForm = this.parseNextForm();
      if (nextForm.resultType == "err") {
        throw nextForm.error;
      }
      forms.push(nextForm.value.result);
    }
    return forms;
  }

  // parseAllForms() : JamesAlgebraForm[] {
  //   this.inputText = this.inputText.trim();
  //   if (this.inputText.length === 0) {
  //     return [];
  //   }
  //   let forms: JamesAlgebraForm[] = [];
  //   while (this.inputText.length > 0 && ![')', ']', '>'].includes(this.inputText.charAt(0))) {
  //     let nextForm = this.parseNextForm();
  //     if (nextForm.resultType == "err") {
  //       throw nextForm.error;
  //     }
  //     forms.push(nextForm.value.result);
  //   }
  //   return forms;
  // }

  parseNextForm() : Result<JamesAlgebraFormParseInfo, Error> {
    this.inputText = this.inputText.trim();
    if (this.inputText.length === 0) {
      return makeErr(new Error("JA form not found"));
    }
    const firstChar = this.inputText.charAt(0);
    // if we encounter an open container symbol, we want to parse everything until the closing container symbol
    if (["[", "(", "<"].includes(firstChar)) {
      const container = containerSymbolToEnum(firstChar);

      this.containerStack.push(container);
      this.inputText = this.inputText.substring(1);
      let forms = this.parseAllForms();

      if (this.inputText.length === 0) {
        return makeErr(new Error("Expected closing container symbol, but it is missing"));
      }

      let closeChar = this.inputText.charAt(0);

      if (closeChar !== firstChar) {
        return makeErr(new Error(`Closing container does not match opening container. Expected ${firstChar} found ${closeChar}`));
      }

      let nextForm = null;
      if (container === JamesAlgebraContainer.Round) {
        nextForm = makeRoundContainerForm(forms);
      } else if (container === JamesAlgebraContainer.Square) {
        nextForm = makeSquareContainerForm(forms);
      } else if (container === JamesAlgebraContainer.Angle) {
        nextForm = makeAngleContainerForm(forms);
      }
      if (![')', ']', '>'].includes(closeChar)) {
        return makeErr(new Error(`Unrecognized closing char: ${closeChar}`));
      }
      this.inputText = this.inputText.substring(1);

      return makeOk({
        result: nextForm,
      })
    } else if (["]", ")", ">"].includes(firstChar)) {
      const container = containerSymbolToEnum(firstChar);

      if (this.containerStack.length === 0) {
        return makeErr(new Error("Mismatched closing container symbol, no corresponding opening symbol found."));
      }
      let prevContainer = this.containerStack[this.containerStack.length - 1];
      if (prevContainer !== container) {
        return makeErr(new Error(`Closing container ${container}, does not match opening container ${prevContainer}.`));
      } else {
        this.containerStack.pop();
        // return makeOk({
        //   result: JamesAlgebraForm;
        //   remainingInput: string;
        // })
      }
    } else {
      let posNextSpaceOrContainer = this.inputText.search(/( \s | [([<>\])] )/);
    }

  }
}