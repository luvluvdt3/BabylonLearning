import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  HemisphericLight,
  Vector3,
  CannonJSPlugin,
  MeshBuilder,
  PhysicsImpostor,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon";

export class PhysicsImpostors {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();

    this.CreateImpostors();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 10, -20),
      this.scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.minZ = 0.5;

    scene.enablePhysics(//gravity - ?plugin
      new Vector3(0, -9.81, 0), //typical Earth's gravity 
      new CannonJSPlugin(true, 10, CANNON) // ?_useDeltaForWorldStep - ?interations - ?cannonInjection
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
    //create a box mesh
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    box.position = new Vector3(0, 10, 1);
    box.rotation = new Vector3(Math.PI / 4, 0, 0); //rotates the box a lil bit by 45 degrees to see the actual bouncing and rotates effect while falling down onto the ground

    box.physicsImpostor = new PhysicsImpostor( //object - type - ?_option - ?_scene
      box,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.75 } 
      //mass: weight of object
      //friction: level of slipery
      //restitution: bouncy level
    ); //since the box has weight and bounciness, it can fall off onto the ground, bounced back and kinda rolling a lil bit

    const ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    }); //just enough to cover the floor of the scene

    ground.isVisible = false; //makes it invisible (we dont want the actual scene's floor and this physical effect ground kinda mixing one another)

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor, //BoxImpossor is suitalble to the use of the floor
      { mass: 0, restitution: 0.5 } //mass=0 -> makes it a static object
    );

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    sphere.position = new Vector3(0, 6, 0);

    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.8 }
    );
  }//can see the sphere rolling down since it was pushed by the box 
}
