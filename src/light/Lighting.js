import { TextureManager } from "../core/utils";
import { shadowManager } from "./ShadowManager";

export class Lighting extends PIXI.Sprite {
    constructor(config, position) {
        super();
        this.light = new PIXI.Sprite(TextureManager.filter(config));
        this.texture = PIXI.RenderTexture.create(this.light.width, this.light.height);
        this.anchor.set(0.5);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this.config = config;
        this.location = position;

        console.log(config);

        Graphics.app.renderer.render(this.light, this.texture, false);
    }

    destroy() { 
        this.light.destroy();
        super.destroy();
    }

    update() {
        if (!this.config.status) {
            return;
        }

        const old_x = this.mapX, old_y = this.mapY, 
              old_ox = this.config.offset.x, old_oy = this.config.offset.y;

        this.updatePosition();
        this.updateAnimation();

        if (old_x !== this.mapX || old_y !== this.mapY || 
            old_ox !== this.config.offset.x || old_oy != this.config.offset.y) {
            this.updateShadow();
        }
    }

    updatePosition() {
        this.x = this.location.screenX();
        this.y = this.location.screenY();
        this.mapX = this.location._realX;
        this.mapY = this.location._realY;
    }

    updateAnimation() {
        // offset, range, angle
    }

    updateShadow() {
        const shadow = shadowManager.getShadowGraphics(this);
        Graphics.app.renderer.render(this.light, this.texture);
        Graphics.app.renderer.render(shadow, this.texture, false);

    }

}