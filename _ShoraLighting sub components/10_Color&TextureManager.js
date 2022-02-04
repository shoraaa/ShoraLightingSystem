Shora.ColorManager = {
    hexToRGB: function(c) {
        return [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, (c & 0x0000ff)];
    },
    RGBToHex: function([r, g, b]) {
        return (r << 16) + (g << 8) + (b);
    },
    transition: function(f, [r1, g1, b1], [r2, g2, b2]) {
        return ((r2 - r1) * f + r1) << 16 | ((g2 - g1) * f + g1) << 8 | ((b2 - b1) * f + b1);
    }
}

const TextureManager = {
    /**
     * Return a filtered texture.
     * @param {PIXI.BaseTexture} baseTexture 
     * @param {Object} colorFilter 
     */
    filter: function(options) {
        let baseTexture = $shoraLayer.load(options.filename);
        let colorFilter = options.colorfilter;
        let sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
        let filter = new ColorFilter();
		filter.setBrightness(colorFilter.brightness || 255);
		filter.setHue(colorFilter.hue === -1 ? Math.random() * 360 : colorFilter.hue);
		filter.setColorTone(colorFilter.colortone || [0, 0, 0, 0]); // 8, 243, 242, 194
		filter.setBlendColor(colorFilter.blendcolor || [0, 0, 0, 0]); // 96, 151, 221, 229
		sprite.filters = [filter];
        let renderedTexture = Graphics.app.renderer.generateTexture(sprite, 1, 1, sprite.getBounds());
        sprite.filters = null;
		sprite.destroy({texture: true});
		return new PIXI.Sprite(renderedTexture);
    },

    snapshot: function(sprite) {
        // todo: rotation angle correcting, no need filter when rotate        
        let region = sprite.shadow.bounds;
        let [x, y, rotation, scale] = [sprite.x, sprite.y, sprite.rotation, sprite.scale.x];
		sprite.x = 0;
		sprite.y = 0;
		sprite.anchor.set(0);
        sprite.mask = null;
        sprite.rotation = 0;
        sprite.renderable = true;
        sprite.filters = null;
        
        sprite.shadow.mask.renderable = true;
        Shora.maskTexture.resize(sprite.width, sprite.height);

        Shora.tempMatrix.tx = -region.x + sprite.shadowOffsetX;
        Shora.tempMatrix.ty = -region.y + sprite.shadowOffsetY;
        
		// sprite.renderTexture.resize(sprite.width, sprite.height);
        Graphics.app.renderer.render(sprite.filteredSprite, sprite.renderTexture, true, null, true);
        Graphics.app.renderer.render(sprite.shadow.mask, sprite.renderTexture, false, Shora.tempMatrix, true);

        sprite.x = x; 
        sprite.y = y; 
        sprite.anchor.set(0.5);
        sprite.rotation = rotation; 
        sprite.pulse.set(1, 1);
        sprite.texture = sprite.renderTexture;
    } 
}

