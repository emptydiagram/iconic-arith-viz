<script lang="ts">
  import type {
    JamesAlgebraForm,
  } from './james-algebra';

  import {
    makeDiamondForm,
    makeJForm,
    makeSquareForm,
    makeUnitForm,
    makeVoidForm,
    makeCountingNumberForm,
    makeMultForm
  } from "./james-algebra";

  // export let form: JamesAlgebraForm;

  
  // console.log(form);
  // if (form.root) {
  //   console.log(" >> root =", form.root);
  // }
  // console.log(" >> children =", form.children);

  function renderToString(f: JamesAlgebraForm) {
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
        s = s + renderToString(f.children[i]);
      }
    } else {
      s = s + " ";
    }
    s = s + endSymbol;
    return s;
  }

  const formStrVoid = renderToString(makeVoidForm());
  const formStrUnit = renderToString(makeUnitForm());
  const formStrSquare = renderToString(makeSquareForm());
  const formStrDiamond = renderToString(makeDiamondForm());
  const formStrJ = renderToString(makeJForm());
  const formStr2 = renderToString(makeCountingNumberForm(2));
  const formStr3 = renderToString(makeCountingNumberForm(3));
  const formStr2x3 = renderToString(makeMultForm(
    [makeCountingNumberForm(2), makeCountingNumberForm(3)]));

  let displayList = [
    formStrVoid,
    formStrUnit,
    formStrSquare,
    formStrDiamond,
    formStrJ,
    formStr2,
    formStr3,
    formStr2x3,
  ]

</script>

<div>
  <h1>TODO</h1>
<ul id="james-form-demo-list">
  {#each displayList as line}
  <li>{line}</li>
  {/each}
</ul>
</div>


<style>
  div {
    border: 1px solid green;
  }

  #james-form-demo-list {
    font-size: 1.3rem;
    font-family: monospace;
    font-weight: bold;
  }
</style>