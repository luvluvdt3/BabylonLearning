import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {//a default interface for loading screen
  //Mandatory variables from the interface
  loadingUIBackgroundColor: string;
  loadingUIText: string;

  constructor(
    private loadingBar: HTMLElement,
    private percentLoaded: HTMLElement,
    private loader: HTMLElement
  ) {}//empty since there aint no need to make it local variables, but only to have "access" to them

  displayLoadingUI(): void { //Mandatory method from the interface
    this.loadingBar.style.width = "0%";
    this.percentLoaded.innerText = "0%";
  }

  hideLoadingUI(): void { //Mandatory method from the interface
    this.loader.id = "loaded";

    setTimeout(() => {
      this.loader.style.display = "none";
    }, 1000);
  }

  updateLoadStatus(status: string): void {//method to be used in CustomLoading
    this.loadingBar.style.width = `${status}%`;
    this.percentLoaded.innerText = `${status}%`;
  }
}
