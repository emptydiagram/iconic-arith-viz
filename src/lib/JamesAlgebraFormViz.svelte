<script lang="ts">
  import type {
    JamesAlgebraForm,
  } from "./james-algebra";

  export let form: JamesAlgebraForm;

  
  console.log(form);
  if (form.root) {
    console.log(" >> root =", form.root);
  }
  console.log(" >> children =", form.children);

</script>

<div>
  <p>viz</p>

</div>


<style>
  div {
    border: 1px solid green;
  }
</style>