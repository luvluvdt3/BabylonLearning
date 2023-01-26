import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
  } from "@babylonjs/core";
  
  export class BasicScene {
    scene: Scene;
    engine: Engine;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);
      this.scene = this.CreateScene();
  
      this.engine.runRenderLoop(() => { //constantly render(update) the scene -> important to have when we have animations to work with
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
      const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene); //the viewer's point of view -name-starting point-located in-
      camera.attachControl(); //can move the carema around with mouse
  
      const hemiLight = new HemisphericLight(
        "hemiLight",
        new Vector3(0, 1, 0),
        this.scene
      ); //simulates the ambient environment light, no shadows though
  
      hemiLight.intensity = 0.5;
  
      const ground = MeshBuilder.CreateGround(
        "ground",
        { width: 10, height: 10 },
        this.scene
      ); 
  
      const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
  
      ball.position = new Vector3(0, 1, 0); //1 position is just above the ground
      return scene;
    }
  }