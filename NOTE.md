# General stuffs
## Tuto link: https://www.youtube.com/watch?v=NLZuUtiL50A&list=PLym1B0rdkvqhuCNSXzxw6ofEkrpYI70P4&index=1
## npm i -g @vue/cli  
To install globally framwork Vue.js

## If error "vue.ps1 cannot be loaded because running scripts is disabled on this system" :
 - Open Windows Powersell as Admin
 - Set-ExecutionPolicy -Scope LocalMachine Unrestricted   sau đó A

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

## TODO:
- Attention, if open the site with small screen then put it back to big screen-> all pixel flurry sh*t -> any solution?
- Learn Blender =v=

# -------------- 1) Basic Scene ---------------------
- The BasicScene.ts is in src/1BabylonScene
- Then the component HelloWorld.vue import it so that App.vue (which import HelloWord.vue) can show it on the browser
- Can zoom in/out with <^v>

# ------------- 2) Standard Materials -------------------
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
PBR lighting, surrounding is based on .env. It's another type of Material, just like 2)Standard Material
## Download from https://polyhaven.com/hdris -> Download 2K HDR and then go to https://www.babylonjs.com/tools/ibl/ to convert it in to .env file -> save the file in /public/environment
## ATTENTION: the link is not based on the file's location but the one of index.html in /public
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
## Get models from https://polyhaven.com/models/
- Download it with option Blend (yep its a .zip)
- Unzip it and open the .blend file with Blender
- Make sure to have the Location 0 0 0, Rotation 0 0 0, Scale 1 1 1  
- Can convert it to Mesh by clicking left but in this case, it's already had Mesh
- Choose File->Export->gITF 2.0 
   - -  Make sures Format is gITF(.glb) 
   - -  Include: Normally dont check anything since we wanna use the entire object
   - -  Makes sure Transform +YUp checked (by default) [Since the Y axe in Blender is like | and in BabylonJS is like _ ]
   - - Geometry: 
            - - - Check UVs and Normals
            - - - Uncheck Vertex Colors
            - - - Makes sure Materials is set to Export
   - - Animation: Uncheck everything since the object doesnt have any animation
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
- So download the whole stuff from the website -> has A LOT of .glb for each object -> Put them all together using Blender (and yep idk how :v gotta learn Blender;-;)
- Again, check it with https://sandbox.babylonjs.com/ 





