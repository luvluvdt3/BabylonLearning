import {
    Scene,
    Engine,
    Vector3,
    CubeTexture,
    SceneLoader,
    AbstractMesh,
    ArcRotateCamera, //the camera that rotates around a specific object 
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
  
  export class CameraMechanics {
    scene: Scene;
    engine: Engine;
    watch: AbstractMesh;
    camera: ArcRotateCamera;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);
      this.scene = this.CreateScene();
      this.engine.displayLoadingUI();
  
      this.CreateCamera();
  
      this.CreateWatch();
  
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
  
      const envTex = CubeTexture.CreateFromPrefilteredData(
        "./environment/xmas_bg.env",
        scene
      );
  
      envTex.gammaSpace = false;
  
      envTex.rotationY = Math.PI;
  
      scene.environmentTexture = envTex;
  
      scene.createDefaultSkybox(envTex, true, 1000, 0.25);
  
      return scene;
    }
  
    CreateCamera(): void {
      this.camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2, //alpha: -Math.PI: Camera points right at the front of the object (ex Math.PI-> points from above)
        Math.PI / 2, //beta =-alpha nếu muốn hơi chéo chéo thì làm khác
        40,           //radius: camera's distance from the target at the beginning
        Vector3.Zero(),//target = center point of environment
        this.scene     //scene
      );
  
      this.camera.attachControl(this.canvas, true); //preventDefault=true;

      this.camera.wheelPrecision = 100; //speed of zooming speed (much slower than default one)
  
      //to avoid camera going through the object causing clipping pane:
      this.camera.minZ = 0.3; // the min distance that the camrera can get close to the object 
      this.camera.lowerRadiusLimit = 1; //min zoom in distance

      
      this.camera.upperRadiusLimit = 5; //max zoom out distance
  
      this.camera.panningSensibility = 0; //disable panning
  
      //this.camera.useBouncingBehavior = true; //bouncing effect when hit min/max limit of zooming (not a big fan)
  
      //Auto-Rotation of the camera
      this.camera.useAutoRotationBehavior = true; //auto routes the camera
      this.camera.autoRotationBehavior.idleRotationSpeed = 0.5;
      this.camera.autoRotationBehavior.idleRotationSpinupTime = 1000;
      this.camera.autoRotationBehavior.idleRotationWaitTime = 2000;
      this.camera.autoRotationBehavior.zoomStopsAnimation = true;

      this.camera.useFramingBehavior = true; //avoid the camera to pass the bound of the object (only applies when camera.target is a mesh with bound)
  
      this.camera.framingBehavior.radiusScale = 2;
  
      this.camera.framingBehavior.framingTime = 4000;
    }
  
    async CreateWatch(): Promise<void> {
      const { meshes } = await SceneLoader.ImportMeshAsync(
        "",
        "./models/",
        "vintage_watch.glb"
      );
  
      // console.log("meshes", meshes);
  
      this.watch = meshes[0];
  
      //To see the bounds of meshes
      //yup meshes[0] doesnt have any bound
      // meshes[1].showBoundingBox = true;
      // meshes[2].showBoundingBox = true;
      // meshes[3].showBoundingBox = true;

      this.camera.setTarget(meshes[2]); //when the camera was created, its target is set = center of the scene, but when we create the watch, its target = the watch's mesh
      //chose meshes[2] since it has the biggest bound that covers the whole object 
  
      this.engine.hideLoadingUI();
    }
  }