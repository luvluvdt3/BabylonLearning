import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
  AnimationGroup,
  AsyncCoroutine,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class AnimBlending {
  scene: Scene;
  engine: Engine;


  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateCharacter();


    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI / 2;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    const camera = new FreeCamera("camera", new Vector3(0, 2, -6), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;
    camera.speed = 0.5;

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync("", "./models/", "Prototype_Level2.glb");
  }

  async CreateCharacter(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "character_blending.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI);


    const idle = animationGroups[0];
    const run = animationGroups[1];


    this.scene.onPointerDown = evt => {
      if(evt.button === 2) //right click-> turn from current animation to run
        this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(run, idle))

      if(evt.button === 0) //onClick -> turn from current animation to idle
        this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(idle, run))
    }
  }

  *animationBlending(toAnim: AnimationGroup, fromAnim: AnimationGroup): AsyncCoroutine<void>{ //kinda weird but gotta put "*" to declare Coroutine variable
    //toAnim: replacement animation that we wanna change to 
    //fromAnim: current playing animation
      let currentWeight = 1; //so the idea is decrease gradually the weight of the animation from 1->0 so that it can change smoothly to another type of animation which also got weight changed slowly from 0->1
      let newWeight = 0;

      toAnim.play(true); //play the replacement animation

      while(newWeight< 1){
          newWeight +=0.01; 
          currentWeight -= 0.01;
          toAnim.setWeightForAllAnimatables(newWeight); //the replacement animation's weight gradully inscrease
          fromAnim.setWeightForAllAnimatables(currentWeight); //gradually decrease
          yield; //very important to make Coroutine works, or else there would be probs with the frames
      }
  }
}
