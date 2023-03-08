import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
  AnimationEvent,
  Sound,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class AudioExample {
  scene: Scene;
  engine: Engine;

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

    const backgroundMusic = new Sound(
      "backgroundMusic", //name
      "./audio/terror_ambience.mp3", //url
      this.scene, //scene?
      null, //readyToPlayCallBack? 
      {
        volume: 0, //iniitial volume = 0 
        autoplay: true,
      }
    );
    backgroundMusic.setVolume(0.75, 30); //gradually increase the volume from 0->0.75 in 30 secs
  }

  async CreateCharacter(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "character_scared.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(7, 0, 0);
  }

  async CreateZombie(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_growl.glb"
    );
    meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    meshes[0].position = new Vector3(-7, 0, 0);

    animationGroups[0].stop();

    const growlFx = new Sound(
      "growlFx",
      "./audio/growl.mp3",
      this.scene,
      null,
      {
        spatialSound: true,
        maxDistance: 10, //if we are within 10 units from the zombie, we can hear the sound (the closer the louder). By default=100. Gotta attach the sound to a certain potion/mesh to make this work like below:
      }
    );

    //growlFx.attachToMesh(meshes[0]) //can attach this sound to the zombie's mesh, or:
    growlFx.setPosition(new Vector3(-7, 0, 0)); //attach sound to the zombie's positon. Both works lol
    growlFx.setPlaybackRate(1.87); //increase the audio's speed. Can also slow the audio down by putting value < 1.

    const growlAnim = animationGroups[0].targetedAnimations[0].animation;

    const growlEvt = new AnimationEvent(
      70, //frame (of the zombie's animation)
      () => { //action
        if (!growlFx.isPlaying) growlFx.play();
      },
      false //onlyOnce?
    );
    growlAnim.addEvent(growlEvt);
    animationGroups[0].play(true);
  }
}
