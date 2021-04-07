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
    makeRoundContainerForm,
    makeSquareContainerForm,
    makeVariableForm,
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
  const jFrameInversion = makeRoundContainerForm([
     makeSquareContainerForm([makeVariableForm("A")])
    ,makeVariableForm("J")
  ]);

  let forms = [
    formVoid
    ,formUnit
    ,formSquare
    ,formDiamond
    ,formJ
    ,form2
    ,form3
    ,form2x3
    ,jFrameInversion
  ]

  let [svgWidth, svgHeight] = [60, 60];

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

  interface FormSvgTextConfig {
    textContent: string;
    x: number;
    y: number;
  }

  type FormSvgElementConfig =
    | FormSvgPathConfig
    | FormSvgRoundCircleConfig
    | FormSvgTextConfig

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
    const C = height / Math.sqrt(3);
    const anglePath =
      `M ${C} 0.0
       L ${C * 0.5} ${C * Math.sqrt(3)/2}
       L ${-C * 0.5} ${C * Math.sqrt(3)/2}
       L ${-C} 0.0
       L ${-C * 0.5} ${-C * Math.sqrt(3)/2}
       L ${C * 0.5} ${-C * Math.sqrt(3)/2}
       Z`
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

  // let { pathData: roundPath, color: roundStroke } = makeRoundPath(1.2);
  let roundCircle = makeRoundCircle(1.6);

  let {pathData: squarePath, color: squareStroke } = makeSquarePath(1.6);

  let { pathData: anglePath, color: angleStroke } = makeAnglePath(1.6);

  let jOuterSquarePath = makeSquarePath(1.8);
  let jAnglePath = makeAnglePath(1.20);
  let jInnerCircle = makeRoundCircle(0.6);

  let divByZeroOuterCircle = makeRoundCircle(1.8);
  let divByZeroAnglePath = makeAnglePath(1.15);
  let divByZeroSquarePath = makeSquarePath(0.50);

  let baseOuterCircle = makeRoundCircle(1.15)
  let baseInnerCircle = makeRoundCircle(0.50)

  let invAxiomOuterCircle = makeRoundCircle(1.20)
  let invAxiomInnerSquarePath = makeSquarePath(0.60)

  let invAxiomOuterSquarePath = makeSquarePath(1.10)
  let invAxiomInnerCircle = makeRoundCircle(0.65)

  let reflAxiomAnglePath = makeAnglePath(0.6);
</script>

<div id="demo-container">
  <p>hello</p>

  <ul id="james-form-text-list">
    {#each textDisplayList as line}
    <li>{line}</li>
    {/each}
  </ul>

  <table id="james-form-svg-list">
    <tr>
      <td>
        <p>square</p>
        <p><code>[]</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <path d={squarePath}
            stroke={squareStroke}
            stroke-width="0.10"
            fill="transparent"
          />
        </svg>
      </td>
    </tr>
    <tr>
      <td>
        <p>angle</p>
        <p><code>&lt;&gt;</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <path d={anglePath}
            stroke={angleStroke}
            stroke-width="0.10"
            fill="transparent"
          />
        </svg>
      </td>
    </tr>
    <tr>
      <td>
        <p>round</p>
        <p><code>()</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <circle
            cx={roundCircle.cx}
            cy={roundCircle.cy}
            r={roundCircle.r}
            stroke={roundCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
        </svg>
      </td>
    </tr>
    <tr>
      <td>
        <p>James imaginary, J</p>
        <p><code>[&lt;o&gt;]</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <path d={jOuterSquarePath.pathData}
            stroke={jOuterSquarePath.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <path d={jAnglePath.pathData}
            stroke={jAnglePath.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <circle
            cx={jInnerCircle.cx}
            cy={jInnerCircle.cy}
            r={jInnerCircle.r}
            stroke={jInnerCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
        </svg>
      </td>
    </tr>
    <tr>
      <td>
        <p>1/0</p>
        <p><code>(&lt;[]&gt;)</code></p>
      </td>
      <td>
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
      </td>
    </tr>
    <tr>
      <td>
        <p>base / #</p>
        <p><code>(())</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <circle
            cx={baseOuterCircle.cx}
            cy={baseOuterCircle.cy}
            r={baseOuterCircle.r}
            stroke={baseOuterCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <circle
            cx={baseInnerCircle.cx}
            cy={baseInnerCircle.cy}
            r={baseInnerCircle.r}
            stroke={baseInnerCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
        </svg>
      </td>
    </tr>
    <tr>
      <td>
        <p>inversion pattern axiom</p>
        <p><code>([A]) = [(A)] = A</code></p>
      </td>
      <td>
        <div class="formEquationContainer">
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <circle
            cx={invAxiomOuterCircle.cx}
            cy={invAxiomOuterCircle.cy}
            r={invAxiomOuterCircle.r}
            stroke={invAxiomOuterCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <path
            d={invAxiomInnerSquarePath.pathData}
            stroke={invAxiomInnerSquarePath.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <text x="-0.16" y="0.0" font-size="0.5" dominant-baseline="mathematical" class="symbolText">
          A
          </text>
        </svg>
        <span> = </span>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <circle
            cx={invAxiomInnerCircle.cx}
            cy={invAxiomInnerCircle.cy}
            r={invAxiomInnerCircle.r}
            stroke={invAxiomInnerCircle.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <path
            d={invAxiomOuterSquarePath.pathData}
            stroke={invAxiomOuterSquarePath.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <text x="-0.16" y="0.0" font-size="0.5" dominant-baseline="mathematical" class="symbolText">
          A
          </text>
        </svg>
        <span> = </span>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <text x="-0.16" y="0.0" font-size="0.5" dominant-baseline="mathematical" class="symbolText">
          A
          </text>
        </svg>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <p>reflection pattern axiom</p>
        <p><code>A &lt;A&gt; = &nbsp; = void</code></p>
      </td>
      <td>
        <div class="formEquationContainer">
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <text x="-0.16" y="0.0" font-size="0.5" dominant-baseline="mathematical" class="symbolText">
          A
          </text>
        </svg>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
          <path
            d={reflAxiomAnglePath.pathData}
            stroke={reflAxiomAnglePath.color}
            stroke-width="0.10"
            fill="transparent"
          />
          <text x="-0.16" y="0.0" font-size="0.5" dominant-baseline="mathematical" class="symbolText">
          A
          </text>
        </svg>
        <span> = </span>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
        </svg>
        </div>
      </td>
    </tr>
    </table>
</div>


<style>
  svg {
    /* border: 2px dotted pink; */
  }

  div#demo-container {
    border: 1px solid green;
  }

  #james-form-text-list {
    font-size: 1.3rem;
    font-family: monospace;
    font-weight: bold;
  }


  div.formEquationContainer {
    display: flex;
  }

  div.formEquationContainer span {
    align-self: center;
  }

  .symbolText {
    font-family: monospace;
  }
</style>