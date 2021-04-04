<script lang="ts">
  import type {
    JamesAlgebraForm
  } from "./james-algebra";
  import {
    makeDiamondForm,
    makeJForm,
    makeSquareForm,
    makeUnitForm,
    makeVoidForm,
    makeCountingNumberForm,
    makeMultForm,
    JamesAlgebraFormRenderer,
  } from "./james-algebra";

  const formVoid = makeVoidForm();
  const formUnit = makeUnitForm();
  const formSquare = makeSquareForm();
  const formDiamond = makeDiamondForm();
  const formJ = makeJForm();
  const form2 = makeCountingNumberForm(2);
  const form3 = makeCountingNumberForm(3);
  const form2x3 = makeMultForm(
    [makeCountingNumberForm(2), makeCountingNumberForm(3)]);

  let forms = [
    formVoid
    ,formUnit
    ,formSquare
    ,formDiamond
    ,formJ
    ,form2
    ,form3
    ,form2x3
  ]

  let [svgWidth, svgHeight] = [100, 100];

  function renderToString(form: JamesAlgebraForm): string {
    return JamesAlgebraFormRenderer.renderToString(form);
  }

  // function renderToSvg(form: JamesAlgebraForm): JamesAlgebraSvgFigureConfig {
  //   return JamesAlgebraFormRenderer.renderToSvgNode(form);
  // }

  let textDisplayList = forms.map(form => renderToString(form));

  // let svgList =
  //   forms.map(form => renderToSvg(form));

  /*
    We want circle arc:
      - from (-C + A, -C)
      - to (-C - B, 0)
      - to (-C + A, C)

    and arc:
      - from (C - A, -C)
      - to (C + B, 0)
      - to (C - A, C)

    to draw circle arc we need the radius, R

    we assume that the center of the circle lies on a point, (D, 0),
    where D in [-1, 1]

    (1) :=  R = D - (-C - B) = C + B + D

    R^2 = (D - (-C + A))^2 + C^2
    R^2 = (C + B + D)^2

    so

    (2) := (D + C - A)^2 + C^2 = (C + B + D)^2

    we can assume A, B, C given, and use (2) to solve for D.
    then use (1) to solve for R

    (2) =>
      (D + C)^2 - 2A(D + C) + A^2 + C^2 = (D+C)^2 + 2B(D + C) + B^2
      -2B(D + C) - 2A(D + C)            = -A^2 - C^2 + B^2
      -2(D + C)(B + A)                  = -A^2 - C^2 + B^2
        (D + C)              = (A^2 + C^2 - B^2) / 2(A + B)
      D = -C + (A^2 + C^2 - B^2) / 2(A+B)

  */

  const C = 0.8
  const A = 0.1
  const B = A
  const D = (Math.pow(A, 2) + Math.pow(C, 2) - Math.pow(B, 2)) / (2 * (A + B)) - C
  const R = B + C + D
  const roundPath = `M ${-C + A} ${-C} A ${R} ${R} 0 0 0 ${-C + A} ${C}
                     L ${C - A} ${C} A ${R} ${R} 0 0 0 ${C - A} ${-C} Z`

  console.log("roundPath = ", roundPath);

</script>

<div>
  <p>hello</p>

  <ul id="james-form-text-list">
    {#each textDisplayList as line}
    <li>{line}</li>
    {/each}
  </ul>

  <ul id="james-form-svg-list">
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d="M -0.8 -0.8 L -0.8  0.8
                 L  0.8  0.8 L  0.8 -0.8 Z"
          stroke="#d42a20"
          stroke-width="0.05"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d="M -0.7 -0.8 L -0.9  0.0 L  -0.7  0.8
                 L  0.7  0.8 L  0.9  0.0 L   0.7 -0.8 Z"
          stroke="#fac22b"
          stroke-width="0.05"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d={roundPath}
          stroke="#0e638e"
          stroke-width="0.05"
          fill="transparent"
        />
      </svg>
    </li>
  </ul>
</div>


<style>
  svg {
    border: 2px dotted pink;
  }

  div {
    border: 1px solid green;
  }

  #james-form-text-list {
    font-size: 1.3rem;
    font-family: monospace;
    font-weight: bold;
  }
</style>