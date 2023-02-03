import {
  AbstractMesh,
  ActionManager,
  Color3,
  CubeTexture,
  Engine,
  FreeCamera,
  IncrementValueAction,
  InterpolateValueAction,
  PBRMaterial,
  Scene,
  SceneLoader,
  SetValueAction,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class MeshActions {
  engine: Engine;
  scene: Scene;
  cube: AbstractMesh;
  sphere: AbstractMesh;
  cylinder: AbstractMesh;
  sphereMat: PBRMaterial;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas);
    this.scene = this.CreateScene();

    this.CreateMeshes();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);

    new FreeCamera("camera", new Vector3(0, 0, -8), this.scene); //not allowing the camera to move around

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/xmas_bg.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.2, true);

    scene.environmentIntensity = 1.5;

    return scene;
  }

  async CreateMeshes(): Promise<void> {
    this.sphereMat = new PBRMaterial("sphereMat", this.scene);
    this.sphereMat.albedoColor = new Color3(1, 0, 0);
    this.sphereMat.roughness = 1;

    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "gifts.glb",
      this.scene
    );

    this.cube = meshes[1];
    this.sphere = meshes[2];
    this.cylinder = meshes[3];

    this.cylinder.rotation = new Vector3(-Math.PI / 4, 0, 0);

    this.sphere.material = this.sphereMat;
    this.CreateActions();
  }

  CreateActions(): void {
    this.cube.actionManager = new ActionManager(this.scene);
    this.sphere.actionManager = new ActionManager(this.scene);
    this.scene.actionManager = new ActionManager(this.scene);

    this.cube.actionManager.registerAction(
      new SetValueAction( //triggerOption - target - propertyPath - value - ?condition(optional)
        ActionManager.OnPickDownTrigger, //like onClick 
        this.cube, //object to be modified onClick
        "scaling", //ajout the scaling of the object above onClick
        new Vector3(1.5, 1.5, 1.5)//new value of the object's scaling
        //Summary: onClick: this.cube.scaling = new Vector(...)
      )
    );

    this.sphere.actionManager
      .registerAction( //when click first
        new InterpolateValueAction( //trigger option - target - propertyPath - value - ?duration - ?condition - ?stopOtherAnimation -?onInterpolationDone()
          ActionManager.OnPickDownTrigger,
          this.sphereMat,
          "roughness",
          0,
          3000 
          //Summary: onClick: this.shereMat.roughness gradually changes to 0 (meaning mirror-like effect) within 3 secs
        )
      )
      .then( //if click again
        new InterpolateValueAction(
          ActionManager.NothingTrigger, 
          this.sphereMat,
          "roughness",
          1,
          1000
          //Summary: onClick again: turn it to a non-mirror surface again
        )
      ); //So when the user clicks on sphere for the first time-> turn it mirror-like, click another time-> turn it rough again

    this.scene.actionManager.registerAction(
      new IncrementValueAction(//trigger option - target - propertyPath - value - ?condition
        ActionManager.OnEveryFrameTrigger, //do this action through out the whole time as soon as the scene is loaded
        this.cylinder,
        "rotation.x",
        -0.01
        //Summary: keeps cylinder keeps on rotating 
      )
    );
  }
}
