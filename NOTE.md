# npm i -g @vue/cli  

# If error "vue.ps1 cannot be loaded because running scripts is disabled on this system" :
 - Open Windows Powersell as Admin
 - Set-ExecutionPolicy -Scope LocalMachine Unrestricted   sau đó A

# vue create b101  (b101 is a random name0)
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

# npm run serve

# npm i @babylonjs/core
-------------- 1) Basic Scene ---------------------
- The BasicScene.ts is in src/1BabylonScene
- Then the component HelloWorld.vue import it so that App.vue (which import HelloWord.vue) can show it on the browser
- Can zoom in/out with <^v>

------------- 2) Standard Materials -------------------
# Get textures from https://polyhaven.com/textures -> Choose texture -> Choose ||| next to download and download option AO JPG -> download all 4 of them and use them for different textures of StandardMaterial: (not necessarily 4 below, maybe even 3 or 5)
# Free & Paid Website: https://www.lotpixel.com/products && https://gametextures.com/freebies 
# Can even create my own here : https://architextures.org/create (quite limited though)
# Others: https://en.eagle.cool/blog/post/free-textures
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

--------------3)Physically Based Rendering (PBR)-------------------------
PBR lighting, surrounding is based on .env. It's another type of Material, just like 2)Standard Material
# Download from https://polyhaven.com/hdris -> Download 2K HDR and then go to https://www.babylonjs.com/tools/ibl/ to convert it in to .env file -> save the file in /public/environment
# ATTENTION: the link is not based on the file's location but the one of index.html in /public
# If have the chessboard pattern-> the link to the .jpg is no good (I kinda like it though)
 - Now we can use it in the program:
 ```java
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



