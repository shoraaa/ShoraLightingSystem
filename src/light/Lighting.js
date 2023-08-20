import { TextureManager } from "../core/utils";
import { ShadowSystem } from "./ShadowSystem";

export class Lighting extends PIXI.Sprite {
    constructor(config, position) {
        super(new PIXI.RenderTexture());

        this.config = config;
        this.location = position;

        this.filename = config.filename;
        this.id = config.id;

        this.lightSprite = new PIXI.Sprite(TextureManager.filter(config));

        this.anchor.set(0.5);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this.texture.resize(this.lightSprite.width, this.lightSprite.height);
        Graphics.app.renderer.render(this.lightSprite, this.texture, false);
    }

    destroy() { 
        this.lightSprite.destroy();
        super.destroy();
    }

    update() {
        if (!this.config.status) {
            return;
        }

        const old_x = this.x, old_y = this.y, 
              old_ox = this.config.offset.x, old_oy = this.config.offset.y;

        this.updatePosition();
        this.updateAnimation();

        if (old_x !== this.x || old_y !== this.y || 
            old_ox !== this.config.offset.x || old_oy != this.config.offset.y) {
            this.updateShadow();
        }
    }

    updatePosition() {
        this.x = this.location.screenX();
        this.y = this.location.screenY();
    }

    updateAnimation() {
        // offset, range, angle
    }

    updateShadow() {
        const shadow = ShadowSystem.calculate(this);
        Graphics.app.renderer.render(this.lightSprite, this.texture);
        Graphics.app.renderer.render(shadow, this.texture, false);

    }

}