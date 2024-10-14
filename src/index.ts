import Matter, { Engine, World, Bodies } from "matter-js";
import * as decomp from "poly-decomp-es";
import * as constants from "./constants";
import * as fonts from "./fonts";
import * as audio from "./audio";
import * as control from "./control";
import * as time from "./time";
import { EasingFunctions } from "./ease";

let engine: Matter.Engine;
let fallingLyrics: string[];
let fallingBodies: { body: Matter.Body; isAdded: boolean }[] = [];
let solidBody: Matter.Body;

export const preload = () => {
    fonts.fontPreload();
    audio.preload();
};

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

    control.setup();

    // FIXME: cant decomp for some reason
    Matter.Common.setDecomp(decomp);

    engine = Engine.create();

    solidBody = Matter.Body.create({
        position: { x: 0, y: 0 },
    });

    solidBody = Bodies.fromVertices(
        0,
        constants.canvasHeight / 2 + constants.canvasHeight / 5,
        [
            Matter.Vertices.clockwiseSort(
                fonts.genzenFont.textToPoints(constants.solidLyrics, 0, 0, constants.lyricsSize).flat()
            ),
        ],
        { isStatic: true }
    );
    World.add(engine.world, [solidBody]);

    fallingLyrics = constants.fallingLyrics.replace(/\r?\n/g, "").split("").reverse();

    fallingBodies = fallingLyrics.map((lyric) => ({
        body: Bodies.fromVertices(
            p.random(-300, 300),
            -(constants.canvasHeight / 2 + p.random(0, constants.canvasHeight / 3)),
            [Matter.Vertices.clockwiseSort(fonts.genzenFont.textToPoints(lyric, 0, 0, constants.lyricsSize).flat())]
        ),
        isAdded: false,
    }));

    p.textFont(fonts.genzenFont);

    resize();
};

export const draw = () => {
    p.background(0);

    if (audio.audio.isPlaying()) {
        Engine.update(engine);
    }

    if (audio.audio.isPlaying() && time.currentTime() !== 0) {
        fallingBodies.forEach(({ body, isAdded }, idx, arr) => {
            if (!isAdded) {
                if (
                    p.lerp(
                        constants.startTime,
                        constants.endTime,
                        EasingFunctions.easeInQuad(p.norm(idx, 0, arr.length - 1))
                    ) < time.currentTime()
                ) {
                    Matter.Body.applyForce(body, body.position, { x: p.random(-0.04, 0.04), y: 0.15 });
                    Matter.Body.rotate(body, p.random(-p.PI, p.PI));
                    World.add(engine.world, [body]);
                    arr[idx].isAdded = true;
                    console.log(`${fallingLyrics[idx]} added`);
                }
            } else {
                // p.push();
                // {
                //     p.fill(128);
                //     p.beginShape();
                //     {
                //         for (let point of body.vertices) {
                //             p.vertex(point.x, point.y);
                //         }
                //     }
                //     p.endShape(p.CLOSE);
                // }
                // p.pop();
                p.push();
                {
                    p.fill(255);
                    p.translate(body.position.x, body.position.y);
                    p.rotate(body.angle);
                    p.textSize(constants.lyricsSize);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(fallingLyrics[idx], 0, 0);
                }
                p.pop();
            }
        });
    }

    Matter.Body.setPosition(solidBody, {
        x: 0,
        y: p.lerp(
            constants.canvasHeight / 2 + constants.canvasHeight / 5,
            0,
            p.min(
                p.norm(
                    time.currentTime(),
                    constants.startTime - constants.startTimeOffset,
                    constants.startTime - constants.solidBodyStopTimeOffset
                ),
                1
            )
        ),
    });

    // p.push();
    // {
    //     p.fill(128);
    //     p.beginShape();
    //     {
    //         for (let point of solidBody.vertices) {
    //             p.vertex(point.x, point.y);
    //         }
    //     }
    //     p.endShape(p.CLOSE);
    // }
    // p.pop();
    p.push();
    {
        p.fill(255);
        p.translate(solidBody.position.x, solidBody.position.y);
        p.rotate(solidBody.angle);
        p.textSize(constants.lyricsSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(constants.solidLyrics, 0, 0);
    }
    p.pop();
};
