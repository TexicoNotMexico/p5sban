import p5 from "p5";

export let genzenFont: p5.Font;

export const fontPreload = () => {
    genzenFont = p.loadFont("/src/assets/GenZenGothic.ttf");
};
