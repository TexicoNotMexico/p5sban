import * as constants from "./constants";

export const preload = () => {};

export const resize = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    const scale = Math.min(window.innerWidth / constants.canvasWidth, window.innerHeight / constants.canvasHeight);
    canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
};

export const setup = () => {
    p.createCanvas(constants.canvasWidth, constants.canvasHeight, p.WEBGL);
    p.pixelDensity(1);
    p.frameRate(constants.frameRate);

    resize();
};

export const draw = () => {
    p.background(0);
    p.push();
    p.fill(255);
    p.rect(0, 0, 100, 100);
    p.pop();
};
