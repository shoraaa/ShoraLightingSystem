export class LightingColorFilter extends PIXI.Filter {
    constructor() {
        super(null, LightingColorFilter._fragmentSrc());
        this.uniforms.hue = 0;
        this.uniforms.colorTone = [0, 0, 0, 0];
        this.uniforms.blendColor = [0, 0, 0, 0];
        this.uniforms.brightness = 255;
    };

    setHue(hue) {
        this.uniforms.hue = Number(hue);
    };

    setColorTone(tone) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.colorTone = tone.clone();
    };

    setBlendColor(color) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.blendColor = color.clone();
    };


    setBrightness(brightness) {
        this.uniforms.brightness = Number(brightness);
    };

    static _fragmentSrc() {
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float hue;" +
            "uniform vec4 colorTone;" +
            "uniform vec4 blendColor;" +
            "uniform float brightness;" +
            "vec3 rgbToHsl(vec3 rgb) {" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float cmin = min(r, min(g, b));" +
            "  float cmax = max(r, max(g, b));" +
            "  float h = 0.0;" +
            "  float s = 0.0;" +
            "  float l = (cmin + cmax) / 2.0;" +
            "  float delta = cmax - cmin;" +
            "  if (delta > 0.0) {" +
            "    if (r == cmax) {" +
            "      h = mod((g - b) / delta + 6.0, 6.0) / 6.0;" +
            "    } else if (g == cmax) {" +
            "      h = ((b - r) / delta + 2.0) / 6.0;" +
            "    } else {" +
            "      h = ((r - g) / delta + 4.0) / 6.0;" +
            "    }" +
            "    if (l < 1.0) {" +
            "      s = delta / (1.0 - abs(2.0 * l - 1.0));" +
            "    }" +
            "  }" +
            "  return vec3(h, s, l);" +
            "}" +
            "vec3 hslToRgb(vec3 hsl) {" +
            "  float h = hsl.x;" +
            "  float s = hsl.y;" +
            "  float l = hsl.z;" +
            "  float c = (1.0 - abs(2.0 * l - 1.0)) * s;" +
            "  float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));" +
            "  float m = l - c / 2.0;" +
            "  float cm = c + m;" +
            "  float xm = x + m;" +
            "  if (h < 1.0 / 6.0) {" +
            "    return vec3(cm, xm, m);" +
            "  } else if (h < 2.0 / 6.0) {" +
            "    return vec3(xm, cm, m);" +
            "  } else if (h < 3.0 / 6.0) {" +
            "    return vec3(m, cm, xm);" +
            "  } else if (h < 4.0 / 6.0) {" +
            "    return vec3(m, xm, cm);" +
            "  } else if (h < 5.0 / 6.0) {" +
            "    return vec3(xm, m, cm);" +
            "  } else {" +
            "    return vec3(cm, m, xm);" +
            "  }" +
            "}" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float a = sample.a;" +
            "  vec3 hsl = rgbToHsl(sample.rgb);" +
            "  hsl.x = mod(hsl.x + hue / 360.0, 1.0);" +
            "  hsl.y = hsl.y * (1.0 - colorTone.a / 255.0);" +
            "  vec3 rgb = hslToRgb(hsl);" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float r2 = colorTone.r / 255.0;" +
            "  float g2 = colorTone.g / 255.0;" +
            "  float b2 = colorTone.b / 255.0;" +
            "  float r3 = blendColor.r / 255.0;" +
            "  float g3 = blendColor.g / 255.0;" +
            "  float b3 = blendColor.b / 255.0;" +
            "  float i3 = blendColor.a / 255.0;" +
            "  float i1 = 1.0 - i3;" +
            "  r = clamp((r / a + r2) * a, 0.0, 1.0);" +
            "  g = clamp((g / a + g2) * a, 0.0, 1.0);" +
            "  b = clamp((b / a + b2) * a, 0.0, 1.0);" +
            "  r = clamp(r * i1 + r3 * i3 * a, 0.0, 1.0);" +
            "  g = clamp(g * i1 + g3 * i3 * a, 0.0, 1.0);" +
            "  b = clamp(b * i1 + b3 * i3 * a, 0.0, 1.0);" +
            "  r = r * brightness / 255.0;" +
            "  g = g * brightness / 255.0;" +
            "  b = b * brightness / 255.0;" +
            "  gl_FragColor = vec4(r, g, b, a);" +
            "}";
        return src;
    }; 
};

export class KawaseBlurFilter extends PIXI.Filter {
    constructor(blur, quality) {
        const fragment = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;

        uniform vec2 uOffset;

        void main(void)
        {
            vec4 color = vec4(0.0);

            color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + uOffset.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - uOffset.y));

            // Average
            color *= 0.25;

            gl_FragColor = color;
        }
        `;
        super(null, fragment);
        this._kernels = [];
        this.uniforms.uOffset = new Float32Array(2);
        this._pixelSize = new Point(1);
        // if `blur` is array , as kernels
        if (Array.isArray(blur)) {
            this.kernels = blur;
        }
        else {
            this._blur = blur;
            this.quality = quality;
        }
    }
    /**
     * Overrides apply
     * @private
     */
    apply(filterManager, input, output, clear) {
        const uvX = this._pixelSize.x / input.sourceFrame.width;
        const uvY = this._pixelSize.y / input.sourceFrame.height;
        let offset;
        if (this._quality === 1 || this._blur === 0) {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            const renderTarget = filterManager.getRenderTarget(true);
            let source = input;
            let target = renderTarget;
            let tmp;
            const last = this._quality - 1;
            for (let i = 0; i < last; i++) {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, 1);
                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);
            filterManager.returnRenderTarget(renderTarget);
        }
    }
    _updatePadding() {
        this.padding = Math.ceil(this._kernels.reduce((acc, v) => acc + v + 0.5, 0));
    }
    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    _generateKernels() {
        const blur = this._blur;
        const quality = this._quality;
        const kernels = [blur];
        if (blur > 0) {
            let k = blur;
            const step = blur / quality;
            for (let i = 1; i < quality; i++) {
                k -= step;
                kernels.push(k);
            }
        }
        this._kernels = kernels;
        this._updatePadding();
    }
    /**
     * The kernel size of the blur filter, for advanced usage.
     * @default [0]
     */
    get kernels() {
        return this._kernels;
    }
    set kernels(value) {
        if (Array.isArray(value) && value.length > 0) {
            this._kernels = value;
            this._quality = value.length;
            this._blur = Math.max(...value);
        }
        else {
            // if value is invalid , set default value
            this._kernels = [0];
            this._quality = 1;
        }
    }
    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @default false
     */
    get clamp() {
        return this._clamp;
    }
    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    set pixelSize(value) {
        if (typeof value === 'number') {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value)) {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof Point) {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
        else {
            // if value is invalid , set default value
            this._pixelSize.x = 1;
            this._pixelSize.y = 1;
        }
    }
    get pixelSize() {
        return this._pixelSize;
    }
    /**
     * The quality of the filter, integer greater than `1`.
     * @default 3
     */
    get quality() {
        return this._quality;
    }
    set quality(value) {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    }
    /**
     * The amount of blur, value greater than `0`.
     * @default 4
     */
    get blur() {
        return this._blur;
    }
    set blur(value) {
        this._blur = value;
        this._generateKernels();
    }
}; 


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
        let filter = new LightingColorFilter();
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

    if (notes[0] === 'light') {
        notes[0] = 'default';
    }

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