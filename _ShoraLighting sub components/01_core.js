
// Contains initialize stuff & MV/MZ overload (plugin command iterface)

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 1.61;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempMatrix = new PIXI.Matrix();
Shora.maskTexture = PIXI.RenderTexture.create(0, 0);
Shora._shadowTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);

Shora.DEBUG_GRAPHICS = new PIXI.Graphics();

// Regex
Shora.REGEX = {
    TAG: /\[([\w_\d]+)\]/,
    COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\]/,
    DOUBLE_COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/
};

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
            } else if (command === 'offset' || command === 'tint' || command === 'status') {
                let id = args[0] == '=' ? this._eventId : Number(args[0]);
                let character = id == 0 ? $gamePlayer : $gameMap._events[id];
                if (!character) {
                    Shora.warn(id + ' is not a valid event id.'); return;
                }
                if (!$shoraLayer.lighting.lights[id]) return;
                for (let i = 1; i <= 4; ++i) args[i] = Number(args[i]);
                if (command === 'offset') {
                    $gameLighting.setOffset(id, args[1], args[2], args[3], args[4]);
                } else if (command === 'tint') {
                    $gameLighting.setColor(id, args[1], args[2]);
                } else if (command === 'status') {
                    $gameLighting.setStatus(id, args[1]);
                }
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
        $gameLighting.addPointLight(Number(args.x), Number(args.y), args.ref);
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
            let parameters = JSON.parse(args.parameters);
            if (parameters.offset !== "") {
                parameters.offset = JSON.parse(parameters.offset);
                if (parameters.offset.x !== "") 
                    $gameLighting.setOffsetX(id, Number(parameters.offset.x), time, type);
                if (parameters.offset.y !== "") 
                    $gameLighting.setOffsetY(id, Number(parameters.offset.y), time, type);
            }
            if (parameters.hasOwnProperty('status') && parameters.status !== "") 
                $gameLighting.setStatus(id, parameters.status !== 'false');
            if (parameters.tint !== "") 
                $gameLighting.setColor(id, Number(parameters.tint), time);
        } else {
            Shora.warn('Event ' + id + " doesn't have a light to change parameter.");
        }
    });

}

Shora.CallCommand = function(params, line) {
    if (!line) return;
    let tag, command;
    if (command = line.shoraCommand()) {
        command[1] = command[1].toLowerCase();
        switch (command[1]) {
            case 'light':
                params.name = command[2];
                break;
            case 'pulsefactor':
            case 'pulsespeed':
            case 'flickintensity':
            case 'flickspeed':
                params.animation[command[1]] = Number(command[2]);
                break;
            default: 
                params[command[1]] = Number(command[2]);
        }
    } else if (tag = line.shoraTag()) {
        switch (tag[1].toLowerCase()) {
            case 'light':
                params.name = 'default';
                break;
            case 'shadow':
                params.shadow = true;
                break;
            case 'no_shadow':
                params.shadow = false;
                break;
            case 'static':
                params.static = true;
                break;
            case 'wall':
                params.bwall = false;
                break;
            case 'bwall':
                params.bwall = true;
            default: 
                Shora.warn(tag[1] + 'is not a valid tag.');
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

