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

type JamesAlgebraForm = {
  root?: JamesAlgebraContainer,
  children: Array<JamesAlgebraForm>,
}

export function makeRootedForm(
  root: JamesAlgebraContainer,
  children: Array<JamesAlgebraForm>
)  : JamesAlgebraForm {
  return {
    root,
    children,
  }
}

export function makeImplicitContainerForm(children: Array<JamesAlgebraForm>): JamesAlgebraForm {
  return {
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

export function makeVoidForm() : JamesAlgebraForm {
  return makeImplicitContainerForm([]);
}

export function makeUnitForm() : JamesAlgebraForm {
  return makeRoundContainerForm([]);
}

export function makeSquareForm() : JamesAlgebraForm {
  return makeSquareContainerForm([]);
}

export function makeDiamondForm() : JamesAlgebraForm {
  return makeAngleContainerForm([]);
}

export function makeJForm() : JamesAlgebraForm {
  return makeSquareContainerForm(
    [makeAngleContainerForm(
      [makeRoundContainerForm([])]
    )]
  );
}

export function makeCountingNumberForm(n: number): JamesAlgebraForm{
  if (!Number.isInteger(n) && n > 0) {
    throw Error("argument must be a positive integer");
  }
  const units = Array.from({length: n}).map(x => makeUnitForm());
  return makeImplicitContainerForm(units);
}

export function makeMultForm(multiplicands: Array<JamesAlgebraForm>) : JamesAlgebraForm {
  return makeRoundContainerForm(
    multiplicands.map(form => makeSquareContainerForm([form])));

}

export type {
  JamesAlgebraContainer,
  JamesAlgebraContainerAngle,
  JamesAlgebraContainerRound,
  JamesAlgebraContainerSquare,
  JamesAlgebraForm,
}