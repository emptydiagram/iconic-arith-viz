<script lang="ts">
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
    makeRoundCircle,
    makeAnglePath,
    makeSquarePath,
    renderToSvg,
    makeAngleContainerForm,
    FormSvgElementConfig,
    JamesAlgebraParser,
  } from "iconic-arith-lib";

  import type {
    JamesAlgebraForm,
  } from "iconic-arith-lib";

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
    console.log(" %% renderToString, form = ", form);
    return JamesAlgebraFormRenderer.renderToString(form);
  }

  let textDisplayList = forms.map(form => renderToString(form));

  // <(J)>
  let angleRoundJ = makeAngleContainerForm([
    makeRoundContainerForm([makeJForm()])
  ]);

  interface FormDisplayInfo {
    text: string;
    description: string;
  }

  function makeFormDisplayInfo(text: string, description: string) {
    return {
      text,
      description,
    }
  }

  let formInfos : FormDisplayInfo[] = [
    makeFormDisplayInfo("()", "round. unit. 1 = exp(0)"),
    makeFormDisplayInfo("<>", "angle"),
    makeFormDisplayInfo("[]", "square. log0 = negative infinity"),
    makeFormDisplayInfo("(())", "base / #"),
    makeFormDisplayInfo("(<>)", "basically 1"),
    makeFormDisplayInfo("([])", "inversion pair"),
    makeFormDisplayInfo("[()]", "inversion pair"),
    makeFormDisplayInfo("[<>]", "basically square"),
    makeFormDisplayInfo("[[]]", "loglog0"),
    makeFormDisplayInfo("<()>", "-1"),
    makeFormDisplayInfo("<<>>", "basically void"),
    makeFormDisplayInfo("<[]>", "positive infinity"),
    makeFormDisplayInfo("[<()>]", "J"),
    makeFormDisplayInfo("(<[]>)", "1/0"),
    makeFormDisplayInfo("[(())]", "basically 1"),
    makeFormDisplayInfo("(J)", "the definition of -1?"),
    makeFormDisplayInfo("(<[()]>)", "1/1"),
  ];

  interface FormFullDisplayConfig extends FormDisplayInfo {
    svgElementConfig: FormSvgElementConfig[];
  }

  // let formParses : JamesAlgebraForm[] = formInfos
  //   .map(displayInfo => displayInfo.text)
  //   .map(text => JamesAlgebraParser.parse(text));

  let formDisplayConfigs: FormFullDisplayConfig[] = formInfos.map(formInfo => {
    let form = JamesAlgebraParser.parse(formInfo.text);
    return {
      text: formInfo.text,
      description: formInfo.description,
      svgElementConfig: renderToSvg(form),
    };
  });
    // });

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


  let renderedJConfigs = renderToSvg(makeJForm());
</script>

<div id="demo-container">
  <p>hello</p>

  <ul id="james-form-text-list">
    {#each textDisplayList as line}
    <li>{line}</li>
    {/each}
  </ul>

  <hr/>

  <h1>manual demo</h1>

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


  <hr/>

  <h1>renderToSvg demo</h1>

  <table id="james-form-render-svg-list">
    {#each formDisplayConfigs as formConfig}
    <tr>
      <td>
        <p>{formConfig.description}</p>
        <p><code>{formConfig.text}</code></p>
      </td>
      <td>
        <svg width={svgWidth} height={svgHeight} viewBox="-1 -1 2 2">
            {#each formConfig.svgElementConfig as elemConfig}
              {#if elemConfig.elementType === "path"}
                <path d={elemConfig.pathData}
                  stroke={elemConfig.color}
                  stroke-width="0.10"
                  fill="transparent"
                />
              {:else if elemConfig.elementType === "circle"}
                <circle
                  cx={elemConfig.cx}
                  cy={elemConfig.cy}
                  r={elemConfig.r}
                  stroke={elemConfig.color}
                  stroke-width="0.10"
                  fill="transparent"
                />
              {:else}
                <text
                  x={elemConfig.x}
                  y={elemConfig.y}
                  font-size="0.5"
                  dominant-baseline="mathematical"
                  class="symbolText">
                  {elemConfig.textContent}
                </text>
              {/if}
            {/each}
        </svg>
      </td>
    </tr>
    {/each}
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