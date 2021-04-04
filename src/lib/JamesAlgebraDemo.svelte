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

  let [svgWidth, svgHeight] = [40, 40];

  function renderToString(form: JamesAlgebraForm): string {
    return JamesAlgebraFormRenderer.renderToString(form);
  }

  // function renderToSvg(form: JamesAlgebraForm): JamesAlgebraSvgFigureConfig {
  //   return JamesAlgebraFormRenderer.renderToSvgNode(form);
  // }

  let textDisplayList = forms.map(form => renderToString(form));



  interface FormSvgPathConfig {
    pathData: string;
    color: string;
  }

  interface FormSvgRoundCircleConfig {
    cx: number;
    cy: number;
    r: number;
    color: string;
  }

  type FormSvgElementConfig =
    | FormSvgPathConfig
    | FormSvgRoundCircleConfig

  const SQUARE_COLOR = "#d42a20"
  const ANGLE_COLOR = "#fac22b"
  const ROUND_COLOR = "#0e638e"

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
  function makeRoundPath(height: number): FormSvgPathConfig {
    // const C = 0.8
    // const A = 0.1
    const C = height / 2;
    const A = C / 8;
    const B = A
    const D = (Math.pow(A, 2) + Math.pow(C, 2) - Math.pow(B, 2)) / (2 * (A + B)) - C
    const R = B + C + D
    const roundPath = `M ${-C + A} ${-C} A ${R} ${R} 0 0 0 ${-C + A} ${C}
                      L ${C - A} ${C} A ${R} ${R} 0 0 0 ${C - A} ${-C} Z`
    return {
      pathData: roundPath,
      color: ROUND_COLOR,
    };
  }

  function makeSquarePath(height: number): FormSvgPathConfig {
    const C = height / 2;
    const squarePath = `M ${-C} ${-C} L ${-C} ${C}
                       L  ${C}  ${C} L  ${C} ${-C} Z`;
    return {
      pathData: squarePath,
      color: SQUARE_COLOR,
    };
  }

  function makeAnglePath(height: number): FormSvgPathConfig {
    const C = height / 2;
    const A = C / 4;
    const anglePath = `M ${-C + A} ${-C} L ${-C - A}  0.0 L  ${-C + A}  ${C}
                       L  ${C - A}  ${C} L  ${C + A}  0.0 L   ${C - A} ${-C} Z`
    return {
      pathData: anglePath,
      color: ANGLE_COLOR,
    };
  }

  function makeRoundCircle(height: number): FormSvgRoundCircleConfig {
    return {
      cx: 0,
      cy: 0,
      r: height/2,
      color: ROUND_COLOR,
    }
  }

  // let roundPath = makeRoundPath(1.2).pathData;
  let { pathData: roundPath, color: roundStroke } = makeRoundPath(1.2);
  console.log("roundPath = ", roundPath);

  let {pathData: squarePath, color: squareStroke } = makeSquarePath(1.6);
  console.log("squarePath = ", squarePath);

  let { pathData: anglePath, color: angleStroke } = makeAnglePath(1.4);
  console.log("anglePath = ", anglePath);

  let jPathsCollection = [
    makeSquarePath(1.8),
    makeAnglePath(1.3),
    makeRoundPath(0.8),
  ];

  let divByZeroOuterCircle = makeRoundCircle(1.8);
  let divByZeroAnglePath = makeAnglePath(1.2);
  let divByZeroSquarePath = makeSquarePath(0.75);
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
        <path d={squarePath}
          stroke={squareStroke}
          stroke-width="0.10"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d={anglePath}
          stroke={angleStroke}
          stroke-width="0.10"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d={roundPath}
          stroke={roundStroke}
          stroke-width="0.10"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <path d={jPathsCollection[0].pathData}
          stroke={jPathsCollection[0].color}
          stroke-width="0.10"
          fill="transparent"
        />
        <path d={jPathsCollection[1].pathData}
          stroke={jPathsCollection[1].color}
          stroke-width="0.10"
          fill="transparent"
        />
        <path d={jPathsCollection[2].pathData}
          stroke={jPathsCollection[2].color}
          stroke-width="0.10"
          fill="transparent"
        />
      </svg>
    </li>
    <li>
      <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        <circle
          cx={divByZeroOuterCircle.cx}
          cy={divByZeroOuterCircle.cy}
          r={divByZeroOuterCircle.r}
          stroke={divByZeroOuterCircle.color}
          stroke-width="0.10"
          fill="transparent"
        />
        <path d={divByZeroAnglePath.pathData}
          stroke={divByZeroAnglePath.color}
          stroke-width="0.10"
          fill="transparent"
        />
        <path d={divByZeroSquarePath.pathData}
          stroke={divByZeroSquarePath.color}
          stroke-width="0.10"
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