import p5 from "p5";

declare global {
    const p: p5;
}

declare module "p5" {
    interface SoundFile {
        jump(time: number): void;
    }
}
