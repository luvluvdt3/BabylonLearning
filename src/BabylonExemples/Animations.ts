import {
  Scene,
  Engine,
  SceneLoader,
  FreeCamera,
  Vector3,
  CubeTexture,
  AbstractMesh,
  Animation,
  Mesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class Animations {
  scene: Scene;
  engine: Engine;
  target: AbstractMesh;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.CreateTarget();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI / 2;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    const camera = new FreeCamera("camera", new Vector3(0, 2, -10), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;
    camera.speed = 0.5;

    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level2.glb",
      this.scene
    );
  }

  async CreateTarget(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "target.glb",
      this.scene
    );

    meshes.shift();

    this.target = Mesh.MergeMeshes( //cant do it like meshes[0] since most of the times, the object contains multiple meshes, so we gotta combine them all together to make it one unique mesh to be able to apply animation 
      meshes as Mesh[], //meshes
      true, //disposeSource?
      true, // allow32BitsIndices?
      undefined, //meshSubclass?
      false, //subdividedWithSubMeshes?
      true //multiMultiMaterials?
    );

    this.target.position.y = 3;

    this.CreateAnimations(); //animates the target object
  }

  CreateAnimations(): void {
    const rotateFrames = []; //rotates the target
    const slideFrames = []; //go to left->right
    const fadeFrames = []; //fade away to invisible, only activates onClick
    const fps = 60;

    const rotateAnim = new Animation( //(!)Get the Animation of BabylonJS and not that of JS when VSCode reccommends
      "rotateAnim", //name
      "rotation.z", //target property : z axis will be rotatinh
      fps, //framePerSecond=60
      Animation.ANIMATIONTYPE_FLOAT, //dataType(number) the one that we are using is a default value of Animation
      Animation.ANIMATIONLOOPMODE_CYCLE //loopMode? If Animation.ANIMATIONLOOPMODE_CONSTANT -> animates once and then stop
    );

    const slideAnim = new Animation(
      "slideAnim",
      "position", //since we wanna animate both x and y axis, just put position and not specific position.x 
      fps,
      Animation.ANIMATIONTYPE_VECTOR3, //cant use FLOAT since its a single value
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const fadeAnim = new Animation(
      "fadeAnim",
      "visibility", //modify the visibility
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT 
    );

    rotateFrames.push({ frame: 0, value: 0 });
    rotateFrames.push({ frame: 180, value: Math.PI / 2 }); //frame = 180 = fps*3 -> wanna rotate by 90 degrees in 3 seconds 

    slideFrames.push({ frame: 0, value: new Vector3(0, 3, 0) }); //3=y of target that is declared above
    //go from center to left (a little bit lower) then left to center to right(a lil bit lower) then return to the center point
    slideFrames.push({ frame: 45, value: new Vector3(-3, 2, 0) }); 
    slideFrames.push({ frame: 90, value: new Vector3(0, 3, 0) });
    slideFrames.push({ frame: 135, value: new Vector3(3, 2, 0) });
    slideFrames.push({ frame: 180, value: new Vector3(0, 3, 0) });

    //Fading away to invisible in 3 secs. .visibility goes from 1 to 0
    fadeFrames.push({ frame: 0, value: 1 });
    fadeFrames.push({ frame: 180, value: 0 });

    rotateAnim.setKeys(rotateFrames); //applies to rotateFrames()
    slideAnim.setKeys(slideFrames);
    fadeAnim.setKeys(fadeFrames);

    //Assign animation to the target object
    this.target.animations.push(rotateAnim);
    this.target.animations.push(slideAnim);
    this.target.animations.push(fadeAnim);

    const onAnimationEnd = () => {
      console.log("animation ended");
      this.target.setEnabled(false); //turn of the target object within the scene
    };
    // this.scene.beginAnimation(this.target, 0, 180, true); //plays all the animation between frame 0 and frame 180 with loop option=true(Only works if Animation.ANIMATIONLOOPMODE_CYCLE)
      //this .beginAnimation is fine if we wanna play all the animation at da same time, but if we wanna play certain animations at different time then gotta use .beginDirectAnimation below:
    const animControl = this.scene.beginDirectAnimation( 
      this.target,
      [slideAnim, rotateAnim],//da same as .beginAnimation, except for having this array-> can specify which animation we wanna use
      0,
      180,
      true,
      1, //speed = 1 default speed (declare this just so we can get to onAnimationEnd lol)
      onAnimationEnd //method that gets executed when the animation is done
    );

    //onLeftClick -> activates fadeAnim
    this.scene.onPointerDown = async (evt) => {
      if (evt.button === 0) {
        await this.scene
          .beginDirectAnimation(this.target, [fadeAnim], 0, 180)
          .waitAsync(); //ensure that the animation fadeAnim has finished before stoppping 2 other animations
        animControl.stop(); //stop the 2 other animations
      }
    };
  }
}
