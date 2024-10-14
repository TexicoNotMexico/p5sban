import * as audio from "./audio";
import * as constants from "./constants";

export const playToggle = () => {
    if (audio.audio.isPlaying()) {
        audio.audio.pause();
    } else {
        audio.audio.play(0, 1, 0.7, constants.startTime - constants.startTimeOffset);
    }
};

export const setup = () => {
    document.querySelector("canvas")!.addEventListener("click", () => {
        playToggle();
    });
};
