import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SceneLoader,
    AbstractMesh, //AbstractMesh is the base class for both Mesh and InstancedMesh, so by using a param (or return type) of type AbstractMesh it can be either a Mesh or an InstancedMesh.
    GlowLayer,
    LightGizmo,
    GizmoManager,
    Light,
    Color3,
    DirectionalLight,
    PointLight,
    SpotLight,
    ShadowGenerator,
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
  
  export class LightsShadows {
    scene: Scene;
    engine: Engine;
    //Gotta put "!" for these 3 variables since they are not called in the constructor (but in CreateEnvironment() method that will be called by constructor and JS of course doesnt like that :v)
    //In previous tutos, we just declare object in the method CreateEnvironment() but not as global variables of the class
    //use array of AbstractMesh to be able to assign shadows for each Mesh
    lightTubes!: AbstractMesh[]; //array of glowing blue tubes with type of AbstractMesh, already defined with light effect of glowing blue in .glb file
    models!: AbstractMesh[];
    ball!: AbstractMesh; //no array cux its a simple ball which is really easy to reflect light/shadow
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);
      this.scene = this.CreateScene();
      this.CreateEnvironment();
  
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
      const camera = new FreeCamera("camera", new Vector3(0, 1, -4), this.scene);
      camera.attachControl();
      camera.speed = 0.2;
  
      return scene;
    }
  
    async CreateEnvironment(): Promise<void> {
      const { meshes } = await SceneLoader.ImportMeshAsync(
        "",
        "./models/",
        "LightingScene.glb"
      );
  
      this.models = meshes;
  
      this.lightTubes = meshes.filter(
        (mesh) =>
          mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
      ); //look for a specific mesh's names (since variable meshes consists of many different meshes from LightingScene.glb)
  
      this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
  
      this.ball.position = new Vector3(0, 1, -1);
  
      const glowLayer = new GlowLayer("glowLayer", this.scene);
      glowLayer.intensity = 0.75;
  
      this.CreateLights();
    }
  
    CreateLights(): void { //Create lightings
      // const hemiLight = new HemisphericLight( //kinda like environmental light
      //   "hemiLight",
      //   new Vector3(0, 1, 0),
      //   this.scene
      // );
                       
      // hemiLight.diffuse = new Color3(1, 0, 0);
                                    //red,green,blue (in this case every single objects would turn red)
      // hemiLight.groundColor = new Color3(0, 0, 1); // together with .diffuse turn shadow color of the object to blue (default is black of course) so in this case turned into kinda sunset palette vibe
      // hemiLight.specular = new Color3(0, 1, 0); //kinda the color where reflects the light in this case, kinda neon green yellow vibe cuz it mixs with the red one

      //So imagine a blue(diffuse) ball, the part where there aint no light is black(groundColor), the part that has light is brightblue or even white(if the light is strong)->specular
  
      // const directionalLight = new DirectionalLight( //another type of light
      //   "directionalLight",
      //   new Vector3(0, -1, 0),
      //   this.scene
      // );
  
      const pointLight = new PointLight(//another type of light
        "pointLight",
        new Vector3(0, 1, 0),
        this.scene
      );
  
      pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255); //rgb color values (neon blue)
      pointLight.intensity = 0.5;
  
      const pointClone = pointLight.clone("pointClone") as PointLight; //gotta do "as PointLight" to make it usable (since clones are Nullable by default)
      // this.CreateGizmos(pointLight); //if wanna check the lighting with the weird sphere
      // this.CreateGizmos(pointClone);
      //make right and left tube's position the light position -> the 2 now have blue neon light comming from them
      pointLight.parent = this.lightTubes[0]; 
      pointClone.parent = this.lightTubes[1];
  
      const spotLight = new SpotLight(
        "spotLight",
        new Vector3(0, 0.5, -3),
        new Vector3(0, 1, 3),
        Math.PI / 2,
        10,
        this.scene
      );
  
      spotLight.intensity = 100;
  
      //Allow light to make shadow
      spotLight.shadowEnabled = true;
      spotLight.shadowMinZ = 1;
      spotLight.shadowMaxZ = 10;
  
      const shadowGen = new ShadowGenerator(2048, spotLight);//resolution of the texture, light's source
      shadowGen.useBlurCloseExponentialShadowMap = true; //apply filter to the shadow(noting that there are many filters but support different types of lights) !ATTENTION: ONLY works if the light (in this case spotLight) has shadowMinZ and shadowMaxZ
      //Apply shadows to objects:
      this.ball.receiveShadows = true;
      shadowGen.addShadowCaster(this.ball);
  
      this.models.map((mesh) => {
        mesh.receiveShadows = true;
        shadowGen.addShadowCaster(mesh);
      });
  
      this.CreateGizmos(spotLight);
    }
  
    CreateGizmos(customLight: Light): void { //the weird movable shere emitting light helps us better visualize the light/shadow 
      //simulates the effect of Light passed in the parameter on the whole scenario (either DirectionalLight or HemisphericLight or PotinLight others)
      const lightGizmo = new LightGizmo(); //Gizmo that enables viewing a light
      lightGizmo.scaleRatio = 2;
      lightGizmo.light = customLight;
  
      const gizmoManager = new GizmoManager(this.scene);
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = true;
      gizmoManager.usePointerToAttachGizmos = false;
      gizmoManager.attachToMesh(lightGizmo.attachedMesh);
    }
  }