import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
  AnimationEvent,
  AnimationGroup,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class AnimEvents {
  scene: Scene;
  engine: Engine;
  zombieAnims: AnimationGroup[]; //gotta put this in state since we wanna use it within CreateCharacter() for AnimationEvent, but normally it's asyncly declared in CreateZombie
  cheer: AnimationGroup; //same energy, to be able to use main character's cheer animation within CreateZombie()

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateCharacter();
    this.CreateZombie();

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

    const camera = new FreeCamera("camera", new Vector3(0, 2, -10), this.scene);
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
      "character_attack.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(3, 0, 0);
    //put main character's animations into variables like this to avoid confusion
    this.cheer = animationGroups[0];
    const idle = animationGroups[1];
    const attack = animationGroups[2];

    this.cheer.stop(); //stop the auto-play first animation 
    idle.play(true); //put main character to idle animation

    const attackAnim = animationGroups[2].targetedAnimations[0].animation; //extract animation of "attack" from animationGroups to be able to use it within animationEvent (in this case: attackEvt)

    const attackEvt = new AnimationEvent(
      100, //frame (can see it in Blender)
           //the animation has frames from 0->200, but we wanna play it only from 0->100
      () => { //action
        this.zombieAnims[1].stop(); //declared in state
        this.zombieAnims[0].play();
      },
      false //onlyOnce? (if true then it will be looping)
    );
    attackAnim.addEvent(attackEvt);// everytime main character attacks -> will trigger this AnimationEvent attackEvt, which makes zombie's animation turn from "idle" to "death"

    //(!) gotta put this ALWAYS after declaration of all the animations and animation events stuffs, or else it wont be able to work properly
    this.scene.onPointerDown = (evt) => {
      if (evt.button === 0) attack.play(); //onClick -> main character attacks 
    };
  }

  async CreateZombie(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_death.glb"
    );

    this.zombieAnims = animationGroups; //update the state as soon as the zombie finishs loading -> being able to use the zombie animation within CreateCharacter()

    meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    meshes[0].position = new Vector3(-3, 0, 0);

    //death animation
    this.zombieAnims[0].stop();
    //idle animation
    this.zombieAnims[1].play(true);

    //the same stuff of animation+animationEvent as one of Character, but with everytime the zombie's death animation plays-> main character cheers  
    const deathAnim = this.zombieAnims[0].targetedAnimations[0].animation;
    
    const deathEvt = new AnimationEvent(
      150,
      () => {
        this.cheer.play(true);
      },
      false
      //in this case, event though the animation is not looping, the main character will keep cheering. It's normal since we dont stop it and play ilde animation
    );
    deathAnim.addEvent(deathEvt);
  }
}
