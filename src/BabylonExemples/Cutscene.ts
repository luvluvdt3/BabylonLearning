import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
  AnimationGroup,
  Animation,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class Cutscene {
  scene: Scene;
  engine: Engine;
  characterAnimations: AnimationGroup[]; 
  camera: FreeCamera; //normally camera is not declared in state, but in this case, we wanna be able to able/disable camera (disable camrera while in CutScence and then able it back when CutScene finishes)

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateCharacter();
    this.CreateZombies();

    this.CreateCutscene();

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

    this.camera = new FreeCamera("camera", new Vector3(10, 2, -10), this.scene);
    this.camera.minZ = 0.5;
    this.camera.speed = 0.5;
    //do not have control setup over the camera by keyboard/mouse here, since we dont wanna enable control 'til the camera's cutscene is done

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync("", "./models/", "Prototype_Level2.glb");
  }

  async CreateCharacter(): Promise<void> {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Character2.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2); //rotates the main character facing left
    meshes[0].position = new Vector3(8, 0, -4);

    this.characterAnimations = animationGroups;

    this.characterAnimations[0].stop(); //stop auto play first animation: idle 
    this.characterAnimations[1].play(); //plays the animation of character looking scared
  }

  async CreateZombies(): Promise<void> {
    const zombieOne = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_1.glb"
    );

    const zombieTwo = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_2.glb"
    );

    zombieOne.meshes[0].rotate(Vector3.Up(), Math.PI / 2); //facing right
    zombieOne.meshes[0].position = new Vector3(-8, 0, -4);
    zombieTwo.meshes[0].rotate(Vector3.Up(), Math.PI / 2); //facing right
    zombieTwo.meshes[0].position = new Vector3(-6, 0, -2);
  }

  async CreateCutscene(): Promise<void> {
    const camKeys = []; //positions changes for camera
    const fps = 60; //frame per second
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      //true //enables blendingEffect of camera 
    );

    //applies position changes onto the camera 
    camKeys.push({ frame: 0, value: new Vector3(10, 2, -10) });
    camKeys.push({ frame: 5 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 8 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(0, 3, -16) });
    //going from left(main character) to right(zombies)
    camAnim.setKeys(camKeys);

    this.camera.animations.push(camAnim);

    await this.scene.beginAnimation(this.camera, 0, 12 * fps).waitAsync(); //do the camera animation and makes sur it ended before doing next action

    this.EndCutscene();
  }

  EndCutscene(): void { //enable camera's control and main character's position from "scared" to "idle"
    this.camera.attachControl();
    this.characterAnimations[1].stop();
    this.characterAnimations[0].play();
  }
}
