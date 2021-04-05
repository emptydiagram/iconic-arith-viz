type JamesAlgebraContainerRound = {
  containerType: "round",
}

type JamesAlgebraContainerSquare = {
  containerType: "square",
}

type JamesAlgebraContainerAngle = {
  containerType: "angle",
}

type JamesAlgebraContainer =
  | JamesAlgebraContainerRound
  | JamesAlgebraContainerSquare
  | JamesAlgebraContainerAngle

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
  return makeRootedForm({"containerType": "round"}, children);
}

export function makeSquareContainerForm(children: Array<JamesAlgebraForm>) {
  return makeRootedForm({"containerType": "square"}, children);
}

export function makeAngleContainerForm(children: Array<JamesAlgebraForm>) {
  return makeRootedForm({"containerType": "angle"}, children);
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
        switch (f.root.containerType) {
          case "round":
            startSymbol = "(";
            endSymbol = ")";
            break;
          case "square":
            startSymbol = "[";
            endSymbol = "]";
            break;
          case "angle":
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

export type {
  JamesAlgebraContainer,
  JamesAlgebraContainerAngle,
  JamesAlgebraContainerRound,
  JamesAlgebraContainerSquare,
}