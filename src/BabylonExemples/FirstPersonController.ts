import {
  Scene,
  Engine,
  SceneLoader,
  Vector3,
  HemisphericLight,
  FreeCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class FirstPersonController {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();

    this.CreateEnvironment();

    this.CreateController();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);

    scene.onPointerDown = (evt) => {
      if (evt.button === 0) this.engine.enterPointerlock(); //if leftClick -> The mouse can control the camera, like turning it around (! will prevent the mouse from clicking any else)
      if (evt.button === 1) this.engine.exitPointerlock(); //if middleClick-> turn off the PointerLock (by default can escape the PointerLock with [esc], can still do)
      //tried evt.button === 0 and bugged a lil bit =w=  
    };

    const framesPerSecond = 60; //to be able have a smooth control of the scene's gravity. Can be higher
    const gravity = -9.81; //typical gravity value
    scene.gravity = new Vector3(0, gravity / framesPerSecond, 0); //set the gravity of the scene
    scene.collisionsEnabled = true; //avoid the camera going in/pass objects, ONLY works when collisions are checked in meshs -> in CreateEnvironment()  and the camera's checkCollison is also checked -> in CreateController()

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level.glb",
      this.scene
    );

    meshes.map((mesh) => { // checks collison of all the mesh (can skip the meshes that you wanna go in/through in here)
      mesh.checkCollisions = true;
    });
  }

  CreateController(): void {
    const camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene); //y=10 so that the camera is a little higher to the ground
    camera.attachControl();

    camera.applyGravity = true; //apply the gravity of the scene declared above to the camera
    camera.checkCollisions = true; 

    camera.ellipsoid = new Vector3(1, 1, 1); //default to size (0.5, 1, 0.5). These setups above only works with this one defined. 

    camera.minZ = 0.45; //camera's min distance of z to an object-> avoid clipping  
    camera.speed = 0.75; //camera's moving speed
    camera.angularSensibility = 4000; //camera's rotation speed (default:2000) the bigger the slower

    camera.keysUp.push(87); //87 in keycode = W
    camera.keysLeft.push(65); //65 = A
    camera.keysDown.push(83); //83 = S
    camera.keysRight.push(68); //68 = D
    //Can use both <^v> and WASD to move the camera around
  }
}
