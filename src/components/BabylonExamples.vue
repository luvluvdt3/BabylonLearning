<template>
  <div>
    <h3>Babylon Examples</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { StandardMaterials } from "../BabylonExemples/StandardMaterials";
export default defineComponent({
  name: "BabylonExamples",
  mounted() {
    //this is called when the component is mounted
    const canvas = document.querySelector("canvas")!; //gotta have "!" to tell typescript that it will never be null (weird stuff lol)
    new StandardMaterials(canvas);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 70%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
}
h1 {
  color: white;
  background: none;
  margin-bottom: 1rem;
}
canvas {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  box-shadow: 8px 8px 10px -6px #000000;
}
</style>
