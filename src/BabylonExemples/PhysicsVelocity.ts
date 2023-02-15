import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  CannonJSPlugin,
  MeshBuilder,
  PhysicsImpostor,
  CubeTexture,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

export class PhysicsVelocity {
  scene: Scene;
  engine: Engine;
  camera: FreeCamera;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateImpostors();
    this.CreateRocket();

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

    const camera = new FreeCamera("camera", new Vector3(0, 2, -5), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;

    this.camera = camera;

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new CannonJSPlugin(true, 10, CANNON)
    );

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level2.glb",
      this.scene
    );
  }

  CreateImpostors(): void {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    ground.isVisible = false;

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 }
    );
  }

  async CreateRocket(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "toon_rocket.glb",
      this.scene
    );

    const rocketCol = MeshBuilder.CreateBox("rocketCol", { //a mesh that will cover the rocket
      width: 1,
      height: 1.7,
      depth: 1, //overall ressembles the shape of the rocket
    });

    rocketCol.position.y = 0.85; //since its half is kinda underground so to make it even to the ground, gotta do math: height/2 = 1.7/2 = 0.85
    rocketCol.visibility = 0; //comment this line to see the rocketCol covering the rocket

    rocketCol.physicsImpostor = new PhysicsImpostor(
      rocketCol, //object
      PhysicsImpostor.BoxImpostor, //type
      { mass: 1 } //_option?
    );

    meshes[0].setParent(rocketCol);//makes the box the child of rocketCol->connects to one another-> one moves, the other follows
    //(!) .setParent and NOT .parent=... since it will put rocketCol just above the center of the rocket
    rocketCol.rotate(Vector3.Forward(), 1.5); //Vector3.Forward() = Vector3(0,0,1), degree of rotation=1.5-> the rocket isnt straight up anymore but heads to the left

    const rocketPhysics = ()=>{
      this.camera.position = new Vector3( //so that the camera could follow the rocket
      rocketCol.position.x,
      rocketCol.position.y,
      this.camera.position.z
      )
      rocketCol.physicsImpostor.setLinearVelocity(rocketCol.up.scale(5)); //not using Vector3 anymore. To make it keep moving forward to the left
      //rocketCol.physicsImpostor.setLinearVelocity(new Vector3(0,1,0)); 
      rocketCol.physicsImpostor.setAngularVelocity(rocketCol.up);//to keep it spinning
     // rocketCol.physicsImpostor.setAngularVelocity(new Vector3(0,5,0));
    }
    this.scene.registerBeforeRender(rocketPhysics);//while rerendering the frame(which happens 60 times per second, rocketCol would be rerendered too-> the pop up effect of velocity at the beginning would continute-> the rocket would be  flying forever instead of just bounce at the beginning and then go down). Same case with spinning & camera

    let gameOver = false;

    if (!gameOver) this.scene.registerBeforeRender(rocketPhysics);

    this.scene.onPointerDown = () => {
      gameOver = true; 
      this.scene.unregisterBeforeRender(rocketPhysics); 
      //stop the render effect of rocketPhysics() when we click the mouse 
    };
  }
}
