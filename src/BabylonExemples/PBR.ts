import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CubeTexture,
  PBRMaterial,
  Texture,
  Color3,
  GlowLayer,
} from "@babylonjs/core";

export class PBR {
  scene: Scene;
  engine: Engine;

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
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    scene.environmentTexture = envTex; //so we can use it for environment lighting(wont show the environment in the background).Ex: helps the transparent ball has the reflection of the environment

    scene.createDefaultSkybox(envTex, true); //put the environment as background

    scene.environmentIntensity = 0.25; //this is perfect, by default is 1. but too bright and basically white (as for the current .env that i'm using)

    return scene;
  }

  CreateEnvironment(): void {
    //originally all the stuff in here is in CreateScene() but it bugs (maybe timing or lifecycle issues) so we gotta do this separately and put it in the constructor
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );

    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    ball.position = new Vector3(0, 1, 0);
    const ball2 = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    ball2.position = new Vector3(1, 1.9, 0.5); //the 2 balls has different angles of reflection having their different positions... so coolllllll

    ground.material = this.CreateAsphalt();
    //ground.material = this.CreateMagic(); //the ground becomes also mirror-like
    ball.material = this.CreateMagic();
    ball2.material = this.CreateMagic2();
  }

  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    const uvScale = 2;
    const texArray: Texture[] = [];
    const albedoTexture = new Texture(
      "./textures/asphalt/asphalt_diffuse.jpg", //ATTENTION: the link is not based on this file's location but the one of index.html in /public
      this.scene
    );
    pbr.albedoTexture = albedoTexture; //albedoTexture and not diffuseTexture
    texArray.push(albedoTexture);

    const bumpTexture = new Texture(
      "./textures/asphalt/asphalt_normal.jpg",
      this.scene
    );
    pbr.bumpTexture = bumpTexture;
    texArray.push(bumpTexture);

    const metallicTexture = new Texture(
      "./textures/asphalt/asphalt_ao_rough_metal.jpg",
      this.scene
    );
    pbr.metallicTexture = metallicTexture;
    texArray.push(metallicTexture);
    texArray.forEach((tex) => {
      (tex as Texture).uScale = uvScale; //gotta do this since albedoMaterial type is a BaseTexture, not a Texture so normally it doesnt have uScale nor vScale
      (tex as Texture).vScale = uvScale;
      // tex.uScale = uvScale;
      // tex.vScale = uvScale;
    });

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true; //kinda helps the patterns on the texture pop out

    pbr.roughness = 0; //0->1: rough-> smooth, light reflection on bumpy sticking out bits are more clear on 0

    return pbr;
  }
  CreateMagic(): PBRMaterial {
    //by default is mirror-like texture (biuutifollll)
    const pbr = new PBRMaterial("pbr", this.scene);
    return pbr;
  }

  CreateMagic2(): PBRMaterial { //lol i only have normal ver since aint have no money to buy it ;-;
    const pbr = new PBRMaterial("pbr", this.scene);

    pbr.environmentIntensity = 1; //0->1: takes 100% of environmental light -> takes 0%
    pbr.albedoTexture = new Texture(
        "./textures/magic/magic_normal.jpg",
      this.scene
    );

    pbr.bumpTexture = new Texture(
        "./textures/magic/magic_normal.jpg",
      this.scene
    );

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
        "./textures/magic/magic_normal.jpg",
      this.scene
    );

    pbr.emissiveColor = new Color3(1, 1, 1);

    pbr.emissiveTexture = new Texture(
      "./textures/magic/magic_normal.jpg",
      this.scene
    );

    pbr.emissiveIntensity = 0.8; //the intensity of light coming from the center, can make sun if we do 1 lol

    const glowLayer = new GlowLayer("glow", this.scene); //help lignten the material
    glowLayer.intensity = 1; //would show better effect on black and white/yellow subject for a glow effect

    pbr.roughness = 0.;

    return pbr;
  }
}
