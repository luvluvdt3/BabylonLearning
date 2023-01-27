import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  MeshBuilder,
  CubeTexture,
  Texture,
  PBRMaterial,
  SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class CustomModels {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateCampfire();
    this.CreateBarrel(); //lol so unfitting with the asthetic Campfire
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 0.75, -8),
      this.scene
    );
    camera.attachControl();
    camera.speed = 0.25;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    scene.environmentIntensity = 0.5;

    return scene;
  }

  async CreateBarrel(): Promise<void> {
    // has 2 ways to load models:
    //Way 1:
    //   SceneLoader.ImportMesh(
    //     "", //leave empty"" means that we wanna import everything
    //     "./models/", //in which folder
    //     "barrel.glb", //which file
    //     this.scene,
    //     (meshes) => { //on succes then do what (not mandatory)
    //       console.log("meshes", meshes);
    //     }
    //   );

    //Way 2: (recommended)
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "", //leave empty"" means that we wanna import everything
      "./models/", //in which folder
      "barrel.glb" //which file
      //doesnt has on success on this way vers
    );
    console.log("meshes", meshes); //animations, edgesColor, isVisible, isBlocker, rotation, parentNode,...
  }

  async CreateCampfire(): Promise<void> {
    const models = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "campfire.glb"
    );

    // models.meshes[0].position = new Vector3(-15, 0, 0);

    console.log("models", models);
  }
}
