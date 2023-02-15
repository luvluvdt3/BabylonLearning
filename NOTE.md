# General stuffs
## Tuto link: https://www.youtube.com/watch?v=NLZuUtiL50A&list=PLym1B0rdkvqhuCNSXzxw6ofEkrpYI70P4&index=1
## npm i -g @vue/cli  
To install globally framwork Vue.js

## If error "vue.ps1 cannot be loaded because running scripts is disabled on this system" :
 - Open Windows Powersell as Admin
 - Set-ExecutionPolicy -Scope LocalMachine Unrestricted  -> choose A

## vue create b101  (b101 is a random name0)
 - Y
 - Manually
 - TypeScript (ko thay đổi những cái đc chọn by default) 
 - 3.x
 - N
 - N
 - ESLint with error prevention only
 - Lint on save
 - In dedicated config files
 - N (or yes lol)
 - Use NPM

## npm run serve

## npm i @babylonjs/core
Basically every components of BabylonJS

## npm i @babylonjs/loaders
To load models

## npm i cannon @types/cannon
To enable Physics

## Websites:
- General:
    - https://polyhaven.com/
- Texture:
    - https://architextures.org/create
    - https://en.eagle.cool/blog/post/free-textures
    - https://gametextures.com/
- Model:
    - https://sketchfab.com/3d-models?date=week&features=downloadable&sort_by=-likeCount&cursor=bz0xJnA9MjE%3D
    - https://www.kenney.nl/assets
    - https://quaternius.com/
- Tool:
    - https://www.babylonjs.com/tools/ibl/
    - https://sandbox.babylonjs.com/
    - https://www.toptal.com/developers/keycode
- To explore:
    - https://www.youtube.com/watch?v=FaMJd0f34rA
    - https://www.babylonjs.com/
## Blender:
- Move around: Middle mouse press
- Pan around: SHIFT + Middle mouse
- Zoon: Scroll mouse
- See material/texture of object: red round button at the right bottom (just right on the chessboard one)
## TODO:
- Attention, if open the site with small screen then put it back to big screen-> all pixel flurry sh*t -> any solution?
- Learn Blender =v=
- Fix bug the scene doesnt appear after loading but have to change the screen size to see it '-'

# -------------- 1) Basic Scene ---------------------
*[BasicScene]*
- The BasicScene.ts is in src/BabylonExemples/BabylonScene.ts
- Then the component HelloWorld.vue import it so that App.vue (which import HelloWord.vue) can show it on the browser
- Can zoom in/out with <^v>

# ------------- 2) Standard Materials -------------------
*[StandardMaterials]*
## Get textures from https://polyhaven.com/textures -> Choose texture -> Choose ||| next to download and download option AO JPG -> download all 4 of them and use them for different textures of StandardMaterial: (not necessarily 4 below, maybe even 3 or 5)
## Can even create my own here : https://architextures.org/create (quite limited though)
## Others: https://en.eagle.cool/blog/post/free-textures
 ```javascript 
    /////////////////////////1//////////////////////////////
    const diffuseTex = new Texture( //create a new texture based on a texture photo
        "./textures/stone/stone_diffuse.jpg",
        this.scene
      );
      groundMat.diffuseTexture = diffuseTex; //The basic texture of the material as viewed under a light.
    /////////////////////////2//////////////////////////////
      const normalTex = new Texture(
        "./textures/stone/stone_normal.jpg",
        this.scene
      );
      groundMat.bumpTexture = normalTex; //Bump mapping is a technique to simulate bump and dents on a rendered surface.
      groundMat.invertNormalMapX = true;
      groundMat.invertNormalMapY = true;
    /////////////////////////3///////////////////////////////
    const aoTex = new Texture("./textures/stone/stone_ao.jpg", this.scene);
      groundMat.ambientTexture = aoTex; //it helps adding baked shadows into your material.
    /////////////////////////4///////////////////////////////
      const specTex = new Texture("./textures/stone/stone_spec.jpg", this.scene);
      groundMat.specularTexture = specTex;
 ```

# --------------3)Physically Based Rendering (PBR)-------------------------
*[PBR]*
PBR lighting, surrounding is based on .env. It's another type of Material, just like 2)Standard Material
## Download from https://polyhaven.com/hdris -> Download 2K HDR and then go to https://www.babylonjs.com/tools/ibl/ to convert it in to .env file -> save the file in /public/environment
ATTENTION: the link is not based on the file's location but the one of index.html in /public
## If have the chessboard pattern-> the link to the .jpg is no good (I kinda like it though)
 - Now we can use it in the program:
 ```javascript
    const envTex = CubeTexture.CreateFromPrefilteredData(
        "./environment/sky.env", //ATTENTION: the link is not based on the file's location but the one of index.html in /public
        scene
      );
```
- PBR Material:
```javascript
      CreateMagic(): PBRMaterial { //by default is mirror-like texture (biuutifollll)  
      const pbr = new PBRMaterial("pbr", this.scene);
      return pbr;
      }

      ...

      texArray.forEach((tex) => {
        (tex as Texture).uScale = uvScale; //gotta do this since albedoMaterial type is a BaseTexture, not a Texture so normally it doesnt have uScale nor vScale
        (tex as Texture).vScale = uvScale;
        // tex.uScale = uvScale;
        // tex.vScale = uvScale;
      });

      ...
      
       pbr.emissiveIntensity = 0.8; //the intensity of light coming from the center, can make sun if we do 1 lol

       const glowLayer = new GlowLayer("glow", this.scene); //help lignten the material
       glowLayer.intensity = 1; //would show better effect on black and white/yellow subject for a glow effect
```
- Not sure why but this time tutor uses .bumpTexture, .albedoTexture, .metallicTexture, .emissiveTexture instead of 4 previous ones at 2). Maybe preferences? Or bc its PBR?

# ---------------4) Importing Custom Models----------------------
*[CustomeModels]*
## Get models from https://polyhaven.com/models/
- Download it with option Blend (yep its a .zip)
- Unzip it and open the .blend file with Blender
- Make sure to have the Location 0 0 0, Rotation 0 0 0, Scale 1 1 1  
- Can convert it to Mesh by clicking left but in this case, it's already had Mesh
- Choose File->Export->gITF 2.0 
   -  Make sures Format is gITF(.glb) 
   -  Include: Normally dont check anything since we wanna use the entire object
   -  Makes sure Transform +YUp checked (by default) [Since the Y axe in Blender is like | and in BabylonJS is like _ ]
   - Geometry: 
        - Check UVs and Normals
        - Uncheck Vertex Colors
        -  Makes sure Materials is set to Export
   - Animation: Uncheck everything since the object doesnt have any animation
- Upload the exported .glb file on https://sandbox.babylonjs.com/ to test its compability to BabylonJS (Check lighting, texture changes) by rolling it around + Click on the Display Inspector(Button looking like a box at the right bottom) to see Nodes, Materials,...
- Put the file in /public/models/
- Import Model:
```javascript
 import "@babylonjs/loaders";
 ...
  this.CreateBarrel(); 
 ...
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
```
## Campfire Model:
- Cool Free 2D, 3D, Sound here: https://www.kenney.nl/assets
- So download the whole stuff from the website -> has A LOT of .glb for each object -> Put them all together using Blender (and yep idk how :v gotta learn Blender ;-;) -> Other option: use tool AssetForge but its not free ;-;
- Again, check it with https://sandbox.babylonjs.com/ 

# ------------------05) Dynamic Lights and Shadows---------------
*[LightsShadows]*
## Can check meshes of Lighting Scene on Blender:
 - File -> Import -> glTF 2.0 (.glb/gltf) -> then choose the file (Appreciate the update of ver 2.8) In this case contains 3 meshes of 3 barrels + Environment(which is the brick wall) + lightTubes + ...
 - Can put light on objects with Blender and use it in BabylonJS instead of do all the pointLights, arrays of meshes of tubes stuffs but only recommended for static objects :v (check out 6.)
 ## Create Light: 
 ```javascript
    const pointLight = new PointLight(//another type of light
        "pointLight",
        new Vector3(0, 1, 0),
        this.scene
      );
  
      pointLight.diffuse = new Color3(172 / 255, 246 / 255, 250 / 255); //rgb color values (neon blue)
      pointLight.intensity = 0.5;
  
      const pointClone = pointLight.clone("pointClone") as PointLight; //gotta do "as PointLight" to make it usable (since clones are Nullable by default)
      this.CreateGizmos(pointLight); //if wanna check the lighting with the weird sphere
      this.CreateGizmos(pointClone);
      //make right and left tube's position the light position -> the 2 now have blue neon light comming from them
      pointLight.parent = this.lightTubes[0]; 
      pointClone.parent = this.lightTubes[1];
 ```
 ## Gizmo: (Weird sphere helps to ajout the lighting manually)
 ```javascript
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
 ```
 To use it:
 ```javascript
    this.CreateGizmos(spotLight);
```
 ## Create Shadow:
 ``` javascript
      //Allow light to make shadow
      spotLight.shadowEnabled = true;
      spotLight.shadowMinZ = 1;
      spotLight.shadowMaxZ = 10;
  
      const shadowGen = new ShadowGenerator(2048, spotLight);//resolution of the texture, light's source
      shadowGen.useBlurCloseExponentialShadowMap = true;//apply filter to the shadow(noting that there are many filters but support different types of lights) !ATTENTION: ONLY works if the light (in this case spotLight) has shadowMinZ and shadowMaxZ
      //Apply shadows to objects:
      this.ball.receiveShadows = true;
      shadowGen.addShadowCaster(this.ball);
  
      this.models.map((mesh) => {
        mesh.receiveShadows = true;
        shadowGen.addShadowCaster(mesh);
      });
 ```

# -----------------------06) Baked Lighting with Blender in BabylonJS--------------------------
*[BakedLighting]*
- Only recommended to create a static scene
- This is a Blender tutorial and is very technical one so its easier to re-watch the video when needed: https://www.youtube.com/watch?v=jfWCLGREFt4 
- The result is bust_demo.glb in /models

# ------------------------07) Creating a Custom Loading Screen in BabylonJS---------------------
*[CustomLoading]*

*[CustomLoadingScreen]*

*[/components/LoadingScreen.vue]* 

*[/components/BabylonExamples.vue]*

https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen 

## Option 1: 
(The loading bar with percentage)
### In BabylonExamples.vue:
```javascript
 <template>
  <main>
    <div id="loader">
      <p>Loading</p>

      <div id="loadingContainer">
        <div id="loadingBar"></div>
      </div>

      <p id="percentLoaded">0%</p>
    </div>

    <p>Custom Loading Screen</p>
    <canvas></canvas>
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { CustomLoading } from "@/BabylonExemples/CustomLoading";

export default defineComponent({
  name: "BabylonExamples",
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const loadingBar = document.getElementById("loadingBar") as HTMLElement;
    const percentLoaded = document.getElementById(
      "percentLoaded"
    ) as HTMLElement;
    const loader = document.getElementById("loader") as HTMLElement;
    new CustomLoading(
      canvas,
      loadingBar,
      percentLoaded,
      loader,
    );
  },
});
</script>
```
### In CustomLoading:
```javascript
export class CustomLoading {
  scene: Scene;
  engine: Engine;
  loadingScreen: CustomLoadingScreen;

  constructor(
    private canvas: HTMLCanvasElement,
       //html elements from .vue 
    private loadingBar: HTMLElement, 
    private percentLoaded: HTMLElement,
    private loader: HTMLElement,
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

  .....

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

    this.engine.hideLoadingUI();//turn off the loading stuff
  }
}
```

## Option 2: 
(The custom one with LoadingScreen.vue)
### In BabylonExamples.vue:
```javascript
<template>
  <main>
    <LoadingScreen :isLoaded="loaded" /> 
    <p>Custom Loading Screen</p>
    <canvas></canvas>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CustomLoading } from "@/BabylonExemples/CustomLoading";
import LoadingScreen from "./LoadingScreen.vue";

export default defineComponent({
  name: "BabylonExamples",
  components: { LoadingScreen },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const loadingBar = document.getElementById("loadingBar") as HTMLElement;
    const percentLoaded = document.getElementById(
      "percentLoaded"
    ) as HTMLElement;
    const loader = document.getElementById("loader") as HTMLElement;
    new CustomLoading(
      canvas,
      this.setLoaded
    );
  },
  methods: {
    setLoaded() {
      this.loaded = true;
    },
  },
});
</script>
```
### In CustomLoading:
```javascript
 export class CustomLoading {
  scene: Scene;
  engine: Engine;
  constructor(
    private canvas: HTMLCanvasElement,
    private setLoaded: () => void,
  ) {
    this.engine = new Engine(this.canvas, true);

    this.scene = this.CreateScene();

    this.CreateEnvironment();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

.....

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb",
      this.scene,
    );

    this.setLoaded();
  }
}
  ```

# --------------08) Camera Mechanics-----------------
*[CameraMechanics.ts]* 
*[ProductPreview.vue]* 
## Different Types of Cameras:
https://babylonjsguide.github.io/basics/Cameras#:~:text=The%20two%20standard%20cameras%20are,which%20is%20an%20orbital%20camera. 
- Universal Camera: The Universal Camera is now the default camera used by Babylon.js if nothing is specified, and it’s your best choice if you’d like to have a FPS-like control in your scene. Controlled by the keyboard, mouse, touch or gamepad 
- Arc Rotate Camera: This camera always points towards a given target position and can be rotated around that target with the target as the centre of rotation. It can be controlled with cursors and mouse, or with touch events.
- Follow Camera - this takes a mesh as a target and follows it as it moves. 
- Others: Anaglyph Camera, Device Orientation Cameras, Virtual Joysticks Camera, Virtual Reality Camera

# ---------------------9) Mesh Actions------------------
*[MeshAction.ts]*
- Types of ActionManager: NothingTrigger, On CenterPickTrigger, OnDoublePickTrigger, On EveryFrameTrigger,...
https://doc.babylonjs.com/typedoc/classes/BABYLON.ActionManager 

```javascript
  this.cube.actionManager = new ActionManager(this.scene);
    this.cube.actionManager.registerAction(
      new SetValueAction( //triggerOption - target - propertyPath - value - ?condition(optional)
        ActionManager.OnPickDownTrigger, //like onClick 
        this.cube, //object to be modified onClick
        "scaling", //ajout the scaling of the object above onClick
        new Vector3(1.5, 1.5, 1.5)//new value of the object's scaling
        //Summary: onClick: this.cube.scaling = new Vector(...)
      )
    );
```
```javascript
    this.sphere.actionManager = new ActionManager(this.scene);
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
```
```javascript
    this.scene.actionManager = new ActionManager(this.scene);
    this.scene.actionManager.registerAction(
      new IncrementValueAction(//trigger option - target - propertyPath - value - ?condition
        ActionManager.OnEveryFrameTrigger, //do this action through out the whole time as soon as the scene is loaded
        this.cylinder,
        "rotation.x",
        -0.01
        //Summary: keeps cylinder keeps on rotating 
      )
    );
```
# -----------------------10) First Person Controller-----------------------
*[FirstPersonController.ts]*
- https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
```javascript
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
  ```
  ```javascript
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
```
```javascript
  CreateController(): void {
    const camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene); //y=10 so that the camera is a little higher to the ground
    camera.attachControl();

    camera.applyGravity = true; //apply the gravity of the scene declared above to the camera
    camera.checkCollisions = true; 

    camera.ellipsoid = new Vector3(1, 1, 1); //default to size (0.5, 1, 0.5). These setups above only work with this one defined. 

    camera.minZ = 0.45; //camera's min distance of z to an object-> avoid clipping  
    camera.speed = 0.75; //camera's moving speed
    camera.angularSensibility = 4000; //camera's rotation speed (default:2000) the bigger the slower

    camera.keysUp.push(87); //87 in keycode = W
    camera.keysLeft.push(65); //65 = A
    camera.keysDown.push(83); //83 = S
    camera.keysRight.push(68); //68 = D
    //Can use both <^v> and WASD to move the camera around
  }
```
- Find keycode on https://www.toptal.com/developers/keycode

# ---------------11 ) Physics Impostors-------------
*[PhysicsImpostors]*
```javascript
  scene.enablePhysics(//gravity - ?plugin
      new Vector3(0, -9.81, 0), //typical Earth's gravity 
      new CannonJSPlugin(true, 10, CANNON) // ?_useDeltaForWorldStep - ?interations - ?cannonInjection
    );
```
```javascript
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
```
```javascript
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
```
```javascript
const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    sphere.position = new Vector3(0, 6, 0);

    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.8 }
    );
  //can see the shere rolling down since it was pushed by the box 
```

# -----------------------12) Collisions and Triggers-------------------------
*[CollisionsTriggers]*
*[Prototype_Level2.glb]*
## Vers 1: Box and sphere falling down at the same time, box turn x3 bigger as soon as it hit the ground
```javascript
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
    ...
  }

  async CreateEnvironment(): Promise<void> {
    ...
  }

  CreateImpostors(): void {
    this.box = MeshBuilder.CreateBox("box", { size: 2 });
    this.box.position = new Vector3(0, 3, 0);

    this.box.physicsImpostor = new PhysicsImpostor(
      this.box,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 1 }
    );

    this.ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    this.ground.position.y = 0.25;

    this.ground.isVisible = false;

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 }
    );

    this.sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 });
    this.sphere.position = new Vector3(0, 8, 0);

    this.sphere.physicsImpostor = new PhysicsImpostor(
      this.sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 1, friction: 1 }
    );

    this.box.physicsImpostor.registerOnPhysicsCollide( ////object - function (doesnt wanna pass the function like ()=>{} its not really a proper way to use it since it's be difficult to "unregister" it later on)
      this.sphere.physicsImpostor,
      this.DetectCollisions
    );
  }

  DetectCollisions(boxCol: PhysicsImpostor, colAgainst: any): void { //when there's a collison between boxCol and another object, use any instead of PhysicsImpostor to avoid the bullshit with js complaining about arrays of PhysicsImpostor
    boxCol.object.scaling = new Vector3(3, 3, 3);//whenever there is a collison, the boxCol will x3 in size
    boxCol.setScalingUpdated();//keeps the new x3 size even after the collison and not just the moment of collison
  }
```

## Vers 2: Sphere turn red as soon as it hit the box
The same as above, just changes in DetectCollisions()
```javascript
    DetectCollisions(boxCol: PhysicsImpostor, colAgainst: PhysicsImpostor): void {
      const redMat = new StandardMaterial("mat", this.scene); //the mat that helps bouncing balance the object
      redMat.diffuseColor = new Color3(1, 0, 0); //red color
      (colAgainst.object as AbstractMesh).material = redMat; //have to use as AbstractMesh to be able to get access to material -> everytime anything collides with boxCol, it will turn red
    }
```

## Vers 3: The box and the ground turn red while touching the sphere
```javascript
 CreateImpostors(): void {
    
    ...

    this.ground.position.y = 0.25; //slightly above the ground

    this.ground.isVisible = true;

    ...
    // this.box.physicsImpostor.registerOnPhysicsCollide( ////object - function (doesnt wanna pass the function like ()=>{} its not really a proper way to use it since it's be difficult to "unregister" it later on)
    //   this.sphere.physicsImpostor,
    //   this.DetectCollisions
    // );

    this.sphere.physicsImpostor.registerOnPhysicsCollide( //when the sphere hit the box
      [this.box.physicsImpostor, this.ground.physicsImpostor], //this is how to put 2+ physicsImpostor
      this.DetectCollisions
    );

  }

  DetectCollisions(boxCol: PhysicsImpostor, colAgainst: any): void { //when there's a collison between boxCol and another object, use any instead of PhysicsImpostor to avoid the bullshit with js complaining about arrays of PhysicsImpostor
    const redMat = new StandardMaterial("mat", this.scene);
    redMat.diffuseColor = new Color3(1, 0, 0);
    (colAgainst.object as AbstractMesh).material = redMat;
  }
```

## Vers 4: Weird unregister stuff: (do basically nothing lol)
```javascript
  CreateImpostors(): void {

    ...

    this.sphere.physicsImpostor.unregisterOnPhysicsCollide(
      this.ground.physicsImpostor,
      this.DetectCollisions
    );
  }
```

## Vers 5: Ball jumping on a floor mat and console out number of jump
```javascript
  constructor(private canvas: HTMLCanvasElement) {
    ...
    this.DetectTrigger();
    ...
  }

  CreateScene(): Scene {
    ...
  }

  async CreateEnvironment(): Promise<void> {
    ...
  }

  CreateImpostors(): void {
    this.ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    this.ground.position.y = 0.25; //slightly above the ground

    this.ground.isVisible = false;

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 }
    );

    this.sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 });
    this.sphere.position = new Vector3(0, 8, 0);

    this.sphere.physicsImpostor = new PhysicsImpostor(
      this.sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 1, friction: 1 }
    );
  }

  DetectTrigger(): void { //creates a small piece of ground that sphere jumps onto and console out every time the ball hit that ground 
    const box = MeshBuilder.CreateBox("box", { width: 4, height: 1, depth: 4 }); 
    box.position.y = 0.5;
    box.visibility = 0.25;

    //let counter = 0;

    this.scene.registerBeforeRender(() => {
         if (box.intersectsMesh(this.sphere)) counter++;
         //console.log("intersect?", box.intersectsMesh(this.sphere)); //print out true if the sphere is "touching" the ground piece, false if not
         console.log(counter); //1 10 19 ...  (+9 and not +1 every time lol) 
    });
  }
```

# -------------------13) Physics Velocity-------------------------
*[PhysicsVelocity]*
## Vers 1: Rocket going up and stops and fall down onClick
```javascript
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
    const rocketPhysics = ()=>{
      rocketCol.physicsImpostor.setLinearVelocity(new Vector3(0,1,0)); //x,y,z
      //x=0->object set straight up
      //y=1-> velocity exists-> at the beginning, the object would bound quite hard (can increase the speed by making y bigger(like y=10 for ex))
      rocketCol.physicsImpostor.setAngularVelocity(new Vector3(0,5,0)); //makes it spinning spinning SPINNINGGGG. Again, can modify the y to control the speed
      this.camera.position = new Vector3( //so that the camera could follow the rocket
      rocketCol.position.x,
      rocketCol.position.y,
      this.camera.position.z
      )
    }
    this.scene.registerBeforeRender(rocketPhysics);//while rerendering the frame(which happens 60 times per second, rocketCol would be rerendered too-> the pop up effect of velocity at the beginning would continute-> the rocket would be  flying forever instead of just bounce at the beginning and then go down). Same case with spinning & camera

    let gameOver = false;

    if (!gameOver) this.scene.registerBeforeRender(rocketPhysics);

    this.scene.onPointerDown = () => {
      gameOver = true; 
      this.scene.unregisterBeforeRender(rocketPhysics); 
      //stop the render effect of rocketPhysics() when we click the mouse -> rocket falls down
    };
  }
```

## Version 2: Rocket flying to the left 
```javascript
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
```