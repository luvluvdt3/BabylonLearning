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
# Get textures from https://polyhaven.com/textures -> Choose texture -> Choose ||| next to download and download option AO JPG -> download all 4 of them and use them for different textures of StandardMaterial:
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





