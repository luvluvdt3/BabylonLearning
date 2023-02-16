import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  MeshBuilder,
  PhysicsImpostor,
  CubeTexture,
  AmmoJSPlugin,
  PBRMaterial,
  Color3,
  Texture,
  Matrix,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed";

export class Raycasting {
  scene: Scene;
  engine: Engine;
  camera: FreeCamera;
  splatters: PBRMaterial[];

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateTextures();

    this.CreatePickingRay();

    this.CreatePhysics();

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

    this.camera = camera;

    return scene;
  }

  async CreatePhysics(): Promise<void> {
    const ammo = await Ammo();
    const physics = new AmmoJSPlugin(true, ammo);
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), physics);

    this.CreateImpostors();
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
      { mass: 0, friction: 10 }
    );

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    const sphereMat = new PBRMaterial("sphereMat", this.scene);
    sphereMat.roughness = 1;

    sphere.position.y = 3;

    sphereMat.albedoColor = new Color3(1, 0.5, 0);
    sphere.material = sphereMat;

    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 20, friction: 1 }
    );
  }

  CreateTextures(): void {
    const blue = new PBRMaterial("blue", this.scene);
    const orange = new PBRMaterial("orange", this.scene);
    const green = new PBRMaterial("green", this.scene);

    blue.roughness = 1;
    orange.roughness = 1;
    green.roughness = 1;

    blue.albedoTexture = new Texture("./textures/blue.png", this.scene);
    green.albedoTexture = new Texture("./textures/green.png", this.scene);
    orange.albedoTexture = new Texture("./textures/orange.png", this.scene);

    blue.albedoTexture.hasAlpha = true; //to be able to use transparency
    orange.albedoTexture.hasAlpha = true;
    green.albedoTexture.hasAlpha = true;

    blue.zOffset = -0.25; //slightly toward the camera, to avoid the material being too close to the surface of the object that can cause flickering bug
    orange.zOffset = -0.25;
    green.zOffset = -0.25;

    this.splatters = [blue, orange, green]; 
    //create and put these 3-color materials in splatters array declared in constructor
  }

  CreatePickingRay(): void {
    this.scene.onPointerDown = () => {
      const ray = this.scene.createPickingRay(
        this.scene.pointerX, //the target position will be based on where the mouse click, not the scene's center by default
        this.scene.pointerY,
        Matrix.Identity(), 
        this.camera
      ); //onClick -> set the target of the ray to mouse click's positon

      const raycastHit = this.scene.pickWithRay(ray);

      if (raycastHit.hit && raycastHit.pickedMesh.name === "sphere") { //.hit is a default method to see if the ray actually hit an object and .pickedMesh returns the object that was hit
        const decal = MeshBuilder.CreateDecal(  "decal", //name
        raycastHit.pickedMesh, //object (sphere that was hit by raycast)
        {
          position: raycastHit.pickedPoint,//the position point that raycast hit the object
          normal: raycastHit.getNormal(true),
          size: new Vector3(1, 1, 1),
        }
        );

        decal.material =
          this.splatters[Math.floor(Math.random() * this.splatters.length)]; //takes randomly 1 out of 3 color materials -> apply it to the mouseClick's position

        decal.setParent(raycastHit.pickedMesh); //so that it can follow the sphere when it moves and not floating in the air lol

        raycastHit.pickedMesh.physicsImpostor.applyImpulse(
          ray.direction.scale(5),
          raycastHit.pickedPoint
        );//apply force to the sphere -> roll the sphere onClick
      }//if the ray hits the sphere, the sphere would get a random splatter on it
    };
  }
}
