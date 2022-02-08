
// Contains initialize stuff & MV/MZ overload (plugin command iterface)

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 1.61;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempGraphics = new PIXI.Graphics();

// Shora.tempMatrix = new PIXI.Matrix();
// Shora.tempRenderTexture = PIXI.RenderTexture.create(1280, 720);
// Shora.maskTexture = PIXI.RenderTexture.create(1280, 720);
// Shora.DEBUG_GRAPHICS = new PIXI.Graphics();

// Regex
Shora.REGEX = {
    TAG: /\[([\w_\d]+)\]/,
    COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\]/,
    DOUBLE_COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/
};

// Color Helper
Shora.Color = {};

Shora.MessageY = 0;
Shora.warn = function(err) {
    const message = new PIXI.Text('Shora Lighting Plugin: ' + err, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'left'});
    message.y += Shora.MessageY; Shora.MessageY += message.height;
    if (Graphics.app.stage) Graphics.app.stage.addChild(message);
}

Shora.EngineVersion = Shora.Lighting.PARAMETERS.version.toUpperCase();

/* overload for rpgm mv */
if (Shora.EngineVersion == 'MV') {

    ((_) => {
        const _createRenderer = Graphics._createRenderer;
        Graphics._createRenderer = function() {
            _createRenderer.call(this);
            this.app = { renderer: this._renderer };
        };
    })(Graphics); 

    ImageManager.loadLight = function(filename) {
        return this.loadBitmap('img/lights/', filename.substring(0, filename.length - 4), true);
    };
    /**
     * The color filter for WebGL.
     *
     * @class
     * @extends PIXI.Filter
     */
     function ColorFilter() {
        this.initialize(...arguments);
    }

    ColorFilter.prototype = Object.create(PIXI.Filter.prototype);
    ColorFilter.prototype.constructor = ColorFilter;

    ColorFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.hue = 0;
        this.uniforms.colorTone = [0, 0, 0, 0];
        this.uniforms.blendColor = [0, 0, 0, 0];
        this.uniforms.brightness = 255;
    };

    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     */
    ColorFilter.prototype.setHue = function(hue) {
        this.uniforms.hue = Number(hue);
    };

    /**
     * Sets the color tone.
     *
     * @param {array} tone - The color tone [r, g, b, gray].
     */
    ColorFilter.prototype.setColorTone = function(tone) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.colorTone = tone.clone();
    };

    /**
     * Sets the blend color.
     *
     * @param {array} color - The blend color [r, g, b, a].
     */
    ColorFilter.prototype.setBlendColor = function(color) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.blendColor = color.clone();
    };

    /**
     * Sets the brightness.
     *
     * @param {number} brightness - The brightness (0 to 255).
     */
    ColorFilter.prototype.setBrightness = function(brightness) {
        this.uniforms.brightness = Number(brightness);
    };

    ColorFilter.prototype._fragmentSrc = function() {
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

    // Plugin Command (MV)
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command) {
            command = command.toLowerCase();
            if (command === 'ambient') {
                $gameLighting.setMapAmbient(args[0], args[1]);
            } else if (command === 'shadowambient') {
                $gameLighting.setShadowAmbient(args[0]);
            } else if (command === 'topblockambient') {
                $gameLighting.setTopBlockAmbient(args[0]);
            } else if (command === 'offset' || command === 'tint' || command === 'radius' || 
                       command === 'angle' || command === 'status' || command === 'shadow') {
                let id = args[0] == '=' ? this._eventId : Number(args[0]);
                for (let i = 1; i <= 4; ++i) args[i] = Number(args[i]);
                if (command === 'offset') {
                    $gameLighting.setOffset(id, args[1], args[2], args[3], args[4]);
                } else if (command === 'tint') {
                    $gameLighting.setColor(id, args[1], args[2]);
                } else if (command === 'radius') {
                    $gameLighting.setRadius(id, args[1], args[2]);
                } else if (command === 'angle') {
                    $gameLighting.setAngle(id, args[1], args[2]);
                } else if (command === 'status') {
                    $gameLighting.setStatus(id, args[1]);
                } else if (command === 'shadow')
                    $gameLighting.setShadow(id, args[1]);
            } else if (command === 'static_light') {
                $gameLighting.addStaticLight(Number(args[0]), Number(args[1]), args[2]);
            }
        }
    }
} else {
    ImageManager.loadLight = function(filename) {
        const url = 'img/lights/' + Utils.encodeURI(filename);
        return Bitmap.load(url);
    };

    const { pluginName } = Shora.Lighting;

    // Add new statical light into map
    PluginManager.registerCommand(pluginName, 'Add Static Light', args => {
        $gameLighting.addStaticLight(Number(args.x), Number(args.y), args.ref);
    });

    // Change map ambient color
    PluginManager.registerCommand(pluginName, 'Set Map Ambient', args => {
        $gameLighting.setMapAmbient(args.color, Number(args.time) || 0);
    });

    // Change shadow ambient color
    PluginManager.registerCommand(pluginName, 'Set Shadow Ambient', args => {
        $gameLighting.setShadowAmbient(args.color);
    });

    // Change Top Block ambient color
    PluginManager.registerCommand(pluginName, 'Set Top Block Ambient', args => {
        $gameLighting.setTopBlockAmbient(args.color);
    });

    // Set light color
    PluginManager.registerCommand(pluginName, 'Set Light Parameters', function(args) {
        let id = args.id == "" ? this._eventId : Number(args.id);
        if ($gameMap._lighting[id]) {
            let time = Number(args.time);
            let type = Number(args.type);
            let params = JSON.parse(args.parameters);
            if (params.offset !== "") {
                params.offset = JSON.parse(params.offset);
                if (params.offset.x !== "") 
                    $gameLighting.setOffsetX(id, Number(params.offset.x), time, type);
                if (params.offset.y !== "") 
                    $gameLighting.setOffsetY(id, Number(params.offset.y), time, type);
            }
            if (params.status !== "") 
                $gameLighting.setStatus(id, params.status !== 'false');
            if (params.shadow !== "") 
                $gameLighting.setStatus(id, params.shadow !== 'false');
            if(params.radius !== "")
                $gameLighting.setRadius(id, Number(params.radius) / 100, time, type);
            if(params.angle !== "")
                $gameLighting.setAngle(id, Number(params.angle), time, type);
            if (params.tint !== "") 
                $gameLighting.setColor(id, Number(params.tint), time);
        } else {
            Shora.warn('Event ' + id + " doesn't have a light to change parameter.");
        }
    });

}

Shora.CallCommand = function(settings, command) {
    if (!command || command.length <= 2) return;
    // [<name>, <param1>, <value1>, ..]
    command = command.substring(1, command.length - 1).split(' ');
    // fallback
    if (command.length === 2) 
        return console.warn('Please use the new syntax for lights comment: \n[<name> -<param1> <value1> -<param2> <value2> ...]'), settings.name = command[1];
    if (command[0] === 'light') command[0] = 'default';
    if (!$shoraLayer.LIGHTING[command[0]]) return;
    settings.name = command[0];
    for (let i = 1; i < command.length; i += 2) {
        value = command[i + 1];
        switch (command[i].toLowerCase()) {
            case '-radius':
            case '-r':
                settings.radius = Number(value) / 100;
                break;
            case '-angle':
            case '-a':
                settings.angle = Number(value);
                break;
            case '-offsetx':
            case '-x':
                settings.offsetx = Number(value);
                break;
            case '-offsety':
            case '-y':
                settings.offsety = Number(value);
                break;
            case '-shadowoffsetx':
            case '-sx':
                settings.shadowoffsetx = Number(value);
                break;
            case '-shadowoffsety':
            case '-sy':
                settings.shadowoffsety = Number(value);
                break;
            case '-direction':
            case '-d':
                settings.direction = value === 'on';
                break;
            case '-tint':
            case '-t':
                settings.tint = value.toHexValue();
                break;
            case '-shadow':
            case '-sh':
                settings.shadow = value === 'on';
                break;
            case 'behindwall':
            case 'bw':
                settings.bwall = value === 'on';
                break;
        }
    }
    
};

Array.prototype.lowerBound = function(x) {
    // return minimum i that a[i] >= x
    let lo = 0, hi = this.length - 1, mid, res = -1;
    while (lo <= hi) {
        mid = (lo + hi) >> 1;
        if (a[mid] >= x) {
            res = mid;
            hi = mid - 1;
        } else lo = mid + 1;
    }
    return res;
};
Array.prototype.floorSearch = function(x) {
    // return minimum i that a[i] <= x
    let lo = 0, hi = this.length - 1, mid, res = -1;
    while (lo <= hi) {
        mid = (lo + hi) >> 1;
        if (a[mid] <= x) {
            res = mid;
            lo = mid + 1;
        } else hi = mid - 1;
    }
    return res;
};
Array.prototype.pairFloorSearch = function(x, j) {
    // return minimum i that a[i][j] <= x
    let lo = 0, hi = this.length - 1, mid, res = -1;
    while (lo <= hi) {
        mid = (lo + hi) >> 1;
        if (this[mid][j] <= x) {
            res = mid;
            lo = mid + 1;
        } else hi = mid - 1;
    }
    return res;
};
String.prototype.toHexValue = function() {
    if (Shora.Color[this]) return Shora.Color[this];
    if (this.length == 6) return parseInt(this, 16);
    return parseInt(this.substr(1), 16);
};
String.prototype.toRGBA = function() {
    let s = this.substr(5, this.length - 6);
    let a = s.split(",");
    return a.map(x => Number(x.trim()));
};
String.prototype.shoraTag = function() {
    return this.match(Shora.REGEX.TAG);
};
String.prototype.shoraCommand = function() {
    return this.match(Shora.REGEX.COMMAND);
};
String.prototype.shoraDoubleCommands = function() {
    return this.match(Shora.REGEX.DOUBLE_COMMAND);
};

class KawaseBlurFilter extends PIXI.Filter {
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
}