import * as Cfx from 'fivem-js';

export default class Scaleform extends Cfx.Scaleform {
    constructor(name: string) {
        super(name);
    }

    public render2DScreenSpace(location: Cfx.PointF, size: Cfx.PointF) {
        const x = location.x / Cfx.Screen.Width;
        const y = location.y / Cfx.Screen.Height;
        const width = size.x / Cfx.Screen.Width;
        const height = size.y / Cfx.Screen.Height;
        DrawScaleformMovie(this.handle, x + width / 2, y + height / 2, width, height, 255, 255, 255, 255, 0);
    }
}
