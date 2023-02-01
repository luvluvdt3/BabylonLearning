import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  CubeTexture,
  SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { CustomLoadingScreen } from "./CustomLoadingScreen";

export class CustomLoading {
  scene: Scene;
  engine: Engine;
  loadingScreen: CustomLoadingScreen;

  constructor(
    private canvas: HTMLCanvasElement,
       //html elements from .vue 
    private loadingBar?: HTMLElement, //question mark meaning these fields are optional
    private percentLoaded?: HTMLElement,
    private loader?: HTMLElement,
    private setLoaded?: () => void,
  ) {
    this.engine = new Engine(this.canvas, true);

    this.loadingScreen = new CustomLoadingScreen(
      this.loadingBar,
      this.percentLoaded,
      this.loader
    );

    this.engine.loadingScreen = this.loadingScreen;//customize loading component (loading screen by default is loading stuff with BabylobJS's logo)

    this.engine.displayLoadingUI();//turn on the loading stuff that later will be turned off at da end of method CreateEnvironment()

    this.scene = this.CreateScene();

    this.CreateEnvironment();

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

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb",
      this.scene,
      (evt) => {
        let loadStatus = "";
        if (evt.lengthComputable) { 
          loadStatus = ((evt.loaded * 100) / evt.total).toFixed();
        } 
        else { //in case lengthComputable is false, gotta calculate it with loaded, or else it will just update status as "infinity"
          loadStatus = (Math.floor(evt.loaded / (1024 * 1024) * 100.0) / 100.0)+"";
      }
        this.loadingScreen.updateLoadStatus(loadStatus);
      }
    );

    //this.setLoaded();

    this.engine.hideLoadingUI();//turn off the loading stuff
  }
}
