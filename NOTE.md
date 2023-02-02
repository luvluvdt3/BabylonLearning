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
-Others: Anaglyph Camera, Device Orientation Cameras, Virtual Joysticks Camera, Virtual Reality Camera