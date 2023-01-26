<template>

<div>
<h3>Babylon Examples</h3>
<canvas></canvas>

</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicScene} from '../BabylonExemples/BasicScene';
export default defineComponent({
  name: 'BabylonExamples',
  mounted(){//this is called when the component is mounted
    const canvas = document.querySelector("canvas")!; //gotta have "!" to tell typescript that it will never be null (weird stuff lol)
    new BasicScene(canvas);
  }
  
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
width:70%;
height:70%;
}
</style>