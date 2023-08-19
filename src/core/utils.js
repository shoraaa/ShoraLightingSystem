


export const ColorManager = {
    registered: {},
    register: function(name, color) {
        ColorManager.registered[name] = ColorManager.stringToHex(color);
    },


    stringToHex: function(color) {
        if (ColorManager.registered[color]) {
            return ColorManager.registered[color];
        }
        if (color.length == 6) {
            return parseInt(color, 16);
        }
        return parseInt(color.substr(1), 16);
    },

    toRGBA: function(color) {
        let s = color.substr(5, color.length - 6);
        let a = s.split(",");
        return a.map(x => Number(x.trim()));
    },


};

export const TextureManager = {
    bitmapCache: {},
    filteredCache: {},

    load: function(filename) {
        TextureManager.bitmapCache[filename] = ImageManager.loadLight(filename);
    },

    filter: function(options) {
        if (TextureManager.filteredCache[options.name]) {
            return TextureManager.filteredCache[options.name];
        }
        let baseTexture = TextureManager.bitmapCache[options.filename]._baseTexture;
        let sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
        let colorFilter = options.colorfilter;
        let filter = new ColorFilter();
		filter.setBrightness(colorFilter.brightness || 255);
		filter.setHue(colorFilter.hue === -1 ? Math.random() * 360 : colorFilter.hue);
		filter.setColorTone(colorFilter.colortone || [0, 0, 0, 0]); // 8, 243, 242, 194
		filter.setBlendColor(colorFilter.blendcolor || [0, 0, 0, 0]); // 96, 151, 221, 229
		sprite.filters = [filter];
        let renderedTexture = Graphics.app.renderer.generateTexture(sprite, 1, 1, sprite.getBounds());
        sprite.filters = null;
		sprite.destroy({ texture: true });
		return TextureManager.filteredCache[options.name] = renderedTexture;
    }
};


export function parseNotes(config, notes) {
    if (!notes || notes.length <= 2 || notes[0] !== '[' || notes[notes.length - 1] !== ']') return;
    // [<name>, <param1>, <value1>, ..]
    notes = notes.substring(1, notes.length - 1).split(' ');
    
    // fallback
    if (notes.length === 2) {
        console.warn('Please use the new syntax for lights comment: \n[<name> -<param1> <value1> -<param2> <value2> ...]');
        config.name = notes[1];
        config.status = true;
        return;
    }

    if (notes[0] === 'light') notes[0] = 'default';
    if (!$gameLighting.baseLightingConfig[notes[0]]) return;

    config.name = notes[0];
    config.status = true;

    for (let i = 1; i < notes.length; i += 2) {
        let value = notes[i + 1];
        switch (notes[i].toLowerCase()) {
            case '--radius':
            case '-r':
                config.radius = Number(value) / 100;
                break;
            case '--angle':
            case '-a':
                config.angle = Number(value) / 57.6;
                break;
            case '--offsetx':
            case '-ox':
                config.offsetx = Number(value);
                break;
            case '--offsety':
            case '-oy':
                config.offsety = Number(value);
                break;
            case '--shadowoffsetx':
            case '-sx':
                config.shadowoffsetx = Number(value);
                break;
            case '--shadowoffsety':
            case '-sy':
                config.shadowoffsety = Number(value);
                break;
            case '--direction':
            case '-d':
                config.direction = value === 'on';
                break;
            case '--tint':
            case '-t':
                config.tint = value.toHexValue();
                break;
            case '--status':
            case '-st':
                config.status = value === 'on';
            case '--shadow':
            case '-sh':
                config.shadow = value === 'on';
                break;
            case '--behindwall':
            case '-bw':
                config.bwall = value === 'on';
                break;
        }
    }

}