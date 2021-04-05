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
  root?: JamesAlgebraContainer,
  children: Array<JamesAlgebraForm>,
}

export interface JamesAlgebraVariableForm {
  name: string,
}

export type JamesAlgebraForm =
  | JamesAlgebraContainerForm
  | JamesAlgebraVariableForm

export function makeRootedForm(
  root: JamesAlgebraContainer,
  children: Array<JamesAlgebraContainerForm>
)  : JamesAlgebraContainerForm {
  return {
    root,
    children,
  }
}

export function makeImplicitContainerForm(children: Array<JamesAlgebraContainerForm>): JamesAlgebraContainerForm {
  return {
    children,
  }
}

export function makeRoundContainerForm(children: Array<JamesAlgebraContainerForm>) {
  return makeRootedForm({"containerType": "round"}, children);
}

export function makeSquareContainerForm(children: Array<JamesAlgebraContainerForm>) {
  return makeRootedForm({"containerType": "square"}, children);
}

export function makeAngleContainerForm(children: Array<JamesAlgebraContainerForm>) {
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

export function makeMultForm(multiplicands: Array<JamesAlgebraContainerForm>) : JamesAlgebraContainerForm {
  return makeRoundContainerForm(
    multiplicands.map(form => makeSquareContainerForm([form])));

}

export class JamesAlgebraFormRenderer {
  static renderToString(f: JamesAlgebraContainerForm): string {
    let s: string = "";
    let startSymbol = "";
    let endSymbol = "";
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
    return s;
  }

}

export type {
  JamesAlgebraContainer,
  JamesAlgebraContainerAngle,
  JamesAlgebraContainerRound,
  JamesAlgebraContainerSquare,
}