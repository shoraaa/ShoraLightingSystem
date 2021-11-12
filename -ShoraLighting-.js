/*:
 * @plugindesc 1.3b
 * <Shora Lighting System>
 * @author Shora
 * @desc Shora Lighting System for MV/MZ. 
 * @url https://forums.rpgmakerweb.com/index.php?members/shora.158648/
 * @help
 *
 * @command Set Light Parameters
 * @desc Change the light color in tick(s) time. Use during transition between event pages.
 * @arg id
 * @text Light Id
 * @desc Id of the character carrying light. 0 is player. (Note: Leave blank to set as THIS event);
 * @arg parameters
 * @text New Parameter
 * @type struct<ConfigSettings>
 * @arg time
 * @text Time
 * @desc Time (in tick) between transtition. If you are going to set state, ignore this.
 * @default 60
 * @arg type
 * @text Transition Type
 * @type select
 * @option Not Change
 * @value 
 * @option Linear
 * @value 1
 * @option EaseInOut
 * @value 2
 * @desc The animation movement type. 1 = linear; 2 = easeInOut; Leave empty to use remain light type+.
 * 
 * @command Set Map Ambient
 * @desc Change the map Ambient color in tick(s) time.
 * @arg color
 * @text Color
 * @desc Destination Color of map shadow.
 * @default #000000
 * @arg time
 * @text Time
 * @desc Time (in tick) between transtition.
 * @default 60
 *
 * @command Set Shadow Ambient
 * @desc Only the dynamic light get effected, the rest will be effected on map change. Change the shadow ambient color in tick(s) time.
 * @arg color
 * @text Color
 * @desc Destination Color of map shadow.
 * @default #000000
 *
 * @command Set Top Block Ambient
 * @desc Only the dynamic light get effected, the rest will be effected on map change. Change the top block shadow color in tick(s) time.
 * @arg color
 * @text Color
 * @desc Destination Color of map shadow.
 * @default #000000
 *
 * @param version
 * @text RPG Maker Version [MV/MZ]
 * @desc Version of your RPG Maker Engine. 
 * @default MZ
 *
 * @param sep
 * @text ==================================
 * @default
 *
 * @param Game
 * @text [Game: Settings]
 * @type struct<GameSettings>
 * @desc Settings for game.
 * @default {"regionStart":"1","regionEnd":"4"}
 * 
 * @param sep0
 * @text ==================================
 * @default
 * 
 * @param Map
 * @type struct<MapSettings>
 * @text [Map: Default]
 * @desc Default Settings map ambient and all light default shadow/top block ambient...
 * @default {"ambient":"#232323","shadowAmbient":"#333333","topBlockAmbient":"#333333"}
 * 
 * @param sep1
 * @text ==================================
 * @default 
 * 
 * @param default
 * @text [Lights: Default]
 * @type struct<LightSettings>
 * @desc The default settings for all light. You can use [light] or [light default] in actor/item note or event comment to use this setting. * 
 * @default {"name":"default","filename":"lights","range":"1","sep0":"==================================","tint":"#ffffff","colorfilter":"{\"hue\":\"0\",\"colortone\":\"rgba(0,0,0,0)\",\"blendcolor\":\"rgba(0,0,0,0)\",\"brightness\":\"255\"}","sep1":"==================================","animation":"{\".Static\":\"=====================\",\"flicker\":\"{\\\"status\\\":\\\"false\\\",\\\"flickintensity\\\":\\\"1\\\",\\\"flickspeed\\\":\\\"1\\\"}\",\".Dynamic\":\"=====================\",\"pulse\":\"{\\\"status\\\":\\\"true\\\",\\\"pulsefactor\\\":\\\"1\\\",\\\"pulsespeed\\\":\\\"1\\\"}\",\"rotation\":\"{\\\"rotatespeed\\\":\\\"1\\\"}\"}","sep2":"==================================","offset":"{\"x\":\"0\",\"y\":\"0\"}","direction":"false","rotation":"0","sep4":"==================================","shadow":"true","static":"auto","bwall":"false"{"name":"default","filename":"lights","sep0":"==================================","tint":"#ffffff","colorfilter":"{\"hue\":\"0\",\"colortone\":\"rgba(8,243,242,194)\",\"blendcolor\":\"rgba(96,151,221,229)\",\"brightness\":\"255\"}","sep1":"==================================","offset":"{\"x\":\"0\",\"y\":\"0\"}","animation":"{\".Static\":\"=====================\",\"flicker\":\"{\\\"status\\\":\\\"false\\\",\\\"flickintensity\\\":\\\"1\\\",\\\"flickspeed\\\":\\\"1\\\"}\",\".Dynamic\":\"=====================\",\"pulse\":\"{\\\"status\\\":\\\"false\\\",\\\"pulsefactor\\\":\\\"1\\\",\\\"pulsespeed\\\":\\\"1\\\"}\",\"rotation\":\"{\\\"rotatespeed\\\":\\\"1\\\"}\"}","direction":"false","sep4":"==================================","shadow":"true","static":"auto","bwall":"false","shadowambient":""}
 *  
 * @param LightList
 * @text [Lights: Custom]
 * @type struct<LightSettings>[]
 * @default []
 *
 */

/*~struct~GameSettings:
 * @param regionStart
 * @text Region Id Start Index
 * @desc Starting index of the shadow region id.
 * @default 1
 * 
 * @param regionEnd
 * @text Region Id End Index
 * @desc Ending index of the shadow region id.
 * @default 3
 */
/*~struct~MapSettings:
 * @param ambient
 * @text Default Ambient
 * @desc Color of map' shadow. Hexadecimal.
 * @default #333333
 * @param shadowAmbient
 * @text Default Shadow Ambient
 * @desc This decide the color you see in the blocked part of light. Black = not see any thing. Use it to manipulate ambient shadow.
 * @default #333333
 * @param topBlockAmbient
 * @text Default Top Block Ambient
 * @desc Black = top block completely block light. You can set it a little bright to make it feel more visually.
 * @default #333333
 */
/*~struct~LightSettings:
 * @param name
 * @text Ref
 * @desc The registered name for this light. Use [light <name>] to use it. Ex: [light flashlight]; [light] is equivalent as [light default]
 * @default <-- CHANGE_THIS -->
 * 
 * @param filename
 * @text Image
 * @type file
 * @dir img/lights/
 * @desc The filename of the default light (string).
 * @default lights
 * 
 * @param sep0
 * @text ==================================
 * @default
 * 
 * @param tint
 * @text [Color: Tint]
 * @desc The tint of the default light (Hexadecimal). #ffffff is unchanged.  -1 to generate random color.
 * @default #ffffff
 * 
 * @param colorfilter
 * @text [Color: Filters]
 * @type struct<ColorFilterSettings>
 * @desc The color setting for default light.
 * @default {"hue":"0","colortone":"rgba(0,0,0,0)","blendcolor":"rgba(0,0,0,0)","brightness":"255"}
 * 
 * @param sep1
 * @text ==================================
 * @default 
 * 
 *
 * 
 * @param offset
 * @text [Advanced: Offset]
 * @type struct<OffsetSettings>
 * @desc The offset coordinate.
 * @default {"x":"0","y":"0"}
 * 
 * @param animation
 * @text [Advanced: Animation]
 * @type struct<AnimationSettings>
 * @desc The animation setting for default light.
 * @default {".Static":"=====================","flicker":"{\"status\":\"true\",\"flickintensity\":\"1\",\"flickspeed\":\"1\"}",".Dynamic":"=====================","pulse":"{\"status\":\"false\",\"pulsefactor\":\"1\",\"pulsespeed\":\"1\"}","rotation":"{\"rotatespeed\":\"1\"}"}
 * 
 * @param direction
 * @text [Advanced: Direction]
 * @type boolean
 * @desc Sync with direction setting. Will be overrided if set advanced rotation.
 * @default false
 * 
 * @param sep4
 * @text ==================================
 * @default 
 * 
 * @param shadow
 * @text [Shadow]
 * @type boolean
 * @desc Set the shadow status.
 * @default true
 * 
 * @param static
 * @text [Shadow: Static]
 * @desc The static/dynamic state for light. (true/auto)
 * @default auto
 * 
 * @param bwall
 * @text [Shadow: z-Index]
 * @type boolean
 * @desc Is this light behind the wall or not?
 * @default false
 *
 * @param shadowambient
 * @text [Shadow: Ambient]
 * @desc Leave blank for default. Optional advanced choice to make this light shadow color differ from the rest (hex). 
 * @default
 *
 */
/*~struct~ColorFilterSettings:
 * @param hue
 * @text Hue
 * @desc The hue of the default light. From 1 to 360 (intenger).
 * @default 0
 * 
 * @param colortone
 * @text Color Tone
 * @desc The color tone of light' shader: rgba(r, g, b, a);
 * @default rgba(0, 0, 0, 0)
 * 
 * @param blendcolor
 * @text Blend Color
 * @desc The blend color of light' shader: rgba(r, g, b, a);
 * @default rgba(0, 0, 0, 0)
 * 
 * @param brightness
 * @text Brightness
 * @type Number
 * @desc The brightness of light' shader. Default is 255.
 * @default 255
 */
/*~struct~AnimationSettings:
 * @param .Static
 * @text [Effects: Static]
 * @default 
 * @param flicker
 * @text - [Flicker]
 * @parent Static
 * @type struct<FlickerAnimation>
 * @param .Dynamic
 * @text [Effect: Dynamic]
 * @default 
 * @param pulse
 * @text - [Pulse]
 * @parent Dynamic
 * @type struct<PulseAnimation>
 * @param rotation
 * @text - [Rotation]
 * @parent Dynamic
 * @type struct<RotationAnimation>
*/
/*~struct~OffsetSettings:
 * @param x
 * @text X
 * @desc The offset in horizontical coordinate.
 * @default 0
 * 
 * @param y
 * @text Y
 * @desc The offset in vertical coordinate.
 * @default 0
*/
/*~struct~ConfigSettings:
 * 
 * @param offset
 * @text Offset
 * @type struct<OffsetSettings>
 * @desc The offset coordinate.
 * 
 * @param tint
 * @text Color
 * @desc The tint of the light (Hexadecimal). #ffffff is unchanged.  -1 to generate random color.
 * 
*/

/*~struct~FlickerAnimation:
 * @param status
 * @text Status
 * @type boolean
 * @default true
 * 
 * @param flickintensity
 * @text Intensity
 * @type number
 * @desc The intensity for flick animation.
 * @default 1
 * 
 * @param flickspeed
 * @text Speed
 * @type number
 * @desc The speed for flick animation.
 * @default 1
*/
/*~struct~PulseAnimation:
 * @param status
 * @text Status
 * @type boolean
 * @default false
 * 
 * @param pulsefactor
 * @text Factor
 * @type number
 * @desc The intensity for flick animation.
 * @default 1
 * 
 * @param pulsespeed
 * @text Speed
 * @type number
 * @desc The speed for pulse animation.
 * @default 1
*/
/*~struct~RotationAnimation:
 * @param rotatespeed
 * @text Speed
 * @type number
 * @desc The speed for rotate animation. (round per second)
 * @default 1
*/


// Contains initialize stuff & MV/MZ overload (plugin command iterface)

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 1.3;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempMatrix = new PIXI.Matrix();
Shora.maskTexture = PIXI.RenderTexture.create(0, 0);

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

Shora.MVOverload = function() {
    Graphics.app = { renderer: Graphics._renderer };
}

/* overload for rpgm mv */
if (Shora.Lighting.PARAMETERS.version.toUpperCase() == 'MV') {

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
            console.log(this._eventId);
            if (command === 'ambient') {
                $gameLighting.setMapAmbient(args[0], args[1]);
            } else if (command === 'shadowambient') {
                $gameLighting.setShadowAmbient(args[0]);
            } else if (command === 'topblockambient') {
                $gameLighting.setTopBlockAmbient(args[0]);
            } else if (command === 'offset' || command === 'tint') {
                let id = args[0] == '=' ? this._eventId : Number(args[0]);
                let character = id == 0 ? $gamePlayer : $gameMap._events[id];
                if (!character) {
                    Shora.warn(id + ' is not a valid event id.'); return;
                }
                for (let i = 1; i <= 4; ++i) args[i] = Number(args[i]);
                if (command === 'offset') {
                    $gameLighting.setOffset(id, args[1], args[2], args[3], args[4] || 1);
                } else if (command === 'tint') {
                    $gameLighting.setColor(id, args[1], args[2]);
                }
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
    PluginManager.registerCommand(pluginName, 'Add Point Light', args => {
        //
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
        let character = id == 0 ? $gamePlayer : $gameMap._events[id];
        if (!character) {
            Shora.warn(id + ' is not a valid event id.'); return;
        }
        if (character.hasLight) {
            let time = Number(args.time);
            let type = Number(args.type);
            let parameters = JSON.parse(args.parameters);
            if (parameters.offset !== "") {
                parameters.offset = JSON.parse(parameters.offset);
                if (parameters.offset.x !== "") $gameLighting.setOffsetX(id, Number(parameters.offset.x), time, type);
                if (parameters.offset.y !== "") $gameLighting.setOffsetY(id, Number(parameters.offset.y), time, type);
            }
            if (parameters.tint !== "") $gameLighting.setColor(id, Number(parameters.tint), time);
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

// RPGM Override

// Spriteset_Map
((_) => {
    _.type = () => 'map';

    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) this.removeChild($shoraLayer.lighting.lightSprite);
        destroy.call(this, options);
    }

    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        createUpperLayer.call(this);
        this.createShoraLayer();
    }

    _.createShoraLayer = function() {
        $shoraLayer.createLayer(this);
        $shoraLayer.loadScene();
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        this.updateShoraLayer();
    }

    _.updateShoraLayer = function() {
        $shoraLayer.update();
    }
})(Spriteset_Map.prototype);

// Game_Map
((_) => {
    const setup = _.setup;
    _.setup = function(mapId) {
        setup.call(this, mapId);
        this._lighting = [];
        if ($dataMap) {
            this.scanNoteTags($dataMap.note.split('\n'));
            this.scanTileNoteTag(this.tileset().note.split('\n'));
        }
    }

    _.scanNoteTags = function(lines) {
        for (command of lines) {
            
        }
    }

    _.scanTileNoteTag = function() {
        //
    }

})(Game_Map.prototype);

// Game_Character
((_) => {
    const initialize = _.initialize;
    _.initialize = function() {
        initialize.call(this);
        this.initLighting();
    }

    _.initLighting = function() {
        this.hasLight = false;
        this.lighting = null;
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        this.updateLighting();
    }

    _.updateLighting = function() {
        if (this.hasLight && !this.lighting) {
            $gameLighting.add(this.lightingParams)
            this.lighting = 1;
        }
        if (!this.hasLight && this.lighting) {
            $gameLighting.remove(this._eventId || 0);
            this.lighting = null;
            this.lightingParams = {};
        }
    }

})(Game_Character.prototype);

// Game_Party
((_) => {
    const gainItem = _.gainItem;
    _.gainItem = function(item, amount, includeEquip) {
        gainItem.call(this, item, amount, includeEquip);
        $gamePlayer.scanLighting();
    }

})(Game_Party.prototype);

// Game_Player
((_) => {
    const refresh = _.refresh;
    _.refresh = function() {
        refresh.call(this);
        this.scanLighting();
    }
    _.scanLighting = function() {
        let note = '';
        if ($gameParty.leader()){
            note = $gameParty.leader().actor().note.split('\n');
        }
        let lightingParams = { id: 0, auto: true };
        for (let line of note) {
            Shora.CallCommand(lightingParams, line);
        }
        if (lightingParams.name) {
            this.setLighting(lightingParams);
        } else {
        	let lightingParams = { id: 0, auto: true };
            for (const item of $gameParty.items()) {
                const note = item.note.split('\n');
                for (let line of note) {
                    Shora.CallCommand(lightingParams, line);
                }
            }
            if (lightingParams.name) {
                this.setLighting(lightingParams);
        	} else this.hasLight = false;
        }
    }
    _.setLighting = function(params) {
        params.static = false;
        if (this.hasLight) {
            this.hasLight = false;
            this.updateLighting();
        }
        this.hasLight = true;
        this.lightingParams = params;
    }
})(Game_Player.prototype);

// Game_Event
((_) => {
    const setupPageSettings = _.setupPageSettings;
    _.setupPageSettings = function() {
        setupPageSettings.call(this);
        if (this.hasLight) this.destroyLighting();
        if (!this._erased) this.setupLighting();
    }

    const clearPageSettings = _.clearPageSettings;
    _.clearPageSettings = function() {
        clearPageSettings.call(this);
        if (this.hasLight) this.destroyLighting();
    }

    _.destroyLighting = function() {
        this.hasLight = false;
        $gameLighting.remove(this._eventId || 0);
        this.lighting = null;
        this.lightingParams = {};
    }
    
    _.setupLighting = function() {
        let lightParams = [];
        let static = true;
        this.page().list.forEach((comment) => {
            if (comment.code === 205) static = false;
            if (comment.code === 108 || comment.code === 408) {
                lightParams.push(comment.parameters.join());
            }
        });
        this.lightingParams = {};
        for (line of lightParams) {
            Shora.CallCommand(this.lightingParams, line);
        }
        if (!static) this.lightingParams.static = static;
        this.lightingParams.id = this._eventId;
        this.hasLight = !!this.lightingParams.name;
    }

})(Game_Event.prototype);

// DataManager
((_) => {
    const createGameObjects = _.createGameObjects;
    _.createGameObjects = function() {
        createGameObjects.call(this);
        $shoraLayer = new Layer();
    }
})(DataManager);

class Layer {
    constructor() {
        /* MV ONLY */
        if (Shora.Lighting.PARAMETERS.version.toUpperCase() == 'MV') {
            Shora.MVOverload();
        }

        this.baseTextureCache = {};
        this.lightingCache = {};
        this.mapId = 0;
        this.preload();
    }
    
    preload() {
        const fs = require('fs');
        const path = require('path');
        Shora.DIR_PATH = path.join(path.dirname(process.mainModule.filename));
        let cache = this.baseTextureCache;
        let dirPath = path.join(Shora.DIR_PATH, 'img', 'lights');
        fs.readdir(dirPath, function (err, files) {
            if (err) return Shora.warn('Unable to scan directory: ' + err);
            files.forEach(function(file) {
                cache[file] = ImageManager.loadLight(file);
            });
        });
    }

    /**
     * Load a base texture from cache.
     * @param {String} name 
     */
    load(name) {
        return this.baseTextureCache[name + '.png']._baseTexture;
    }

    /**
     * Return the texture of cached lighting.
     * @param {String} name 
     */
    textureCache(name) {
        return this.lightingCache[name];
    }

    /**
     * Create a layer instance.
     * @param {Spriteset_Base} spriteset 
     */
    createLayer(spriteset) {  
        this._spriteset = spriteset;
    }

    loadScene() {
        Shora.MessageY = 0;

        if ($gameMap.mapId() === this.mapId && this.lighting) {
            this._spriteset.addChild(this.lighting.lightSprite); return;
        }

        this.mapId = $gameMap.mapId();
        if (this.lighting) 
            this.lighting.destroy();
        switch (this._spriteset.type()) {
            case 'map':
                this.lighting = new LightingLayer();
        }
        this._spriteset.addChild(this.lighting.lightSprite);
    }

    update() {
        this.updateLight();
    }

    updateLight() {
        this.lighting.update();
    }
    
}

// $shoraLayer = new Layer();

class LightingLayer {
    constructor() {
        this.lights = [];
        this.layer = new PIXI.Container();
        this.layer.filters = [new PIXI.filters.BlurFilter(1e-4, 2e-4)];

        this.lightTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.lightSprite = new PIXI.Sprite(this.lightTexture);
        this.lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        $gameShadow.refresh();
        this.createDarkenLayer();
        this.createLightingSprite();
    }

    destroy() {
        this.lights = null;
        this.layer.destroy(true);
        this.layer.filters = null;
        this.layer = null;
        this.lightTexture.destroy(true);
        this.lightSprite = null;
        this.lightTexture = null;
        $gameLighting._lighting = [];
    }

    createDarkenLayer() {
        this._surface = new LightingSurface();
	    this.layer.addChild(this._surface);
    }

    createLightingSprite() {
        for (const light of $gameLighting.lighting) 
            this.addLight(light);
    }

    /**
     * Add a light sprite to layer.
     * @param {Object} options 
     */
    addLight(options) {
        const lighting = new LightingSprite(options);
        this.lights[options.id] = lighting;
        this.layer.addChild(lighting);
        if (lighting.shadow) 
            this.layer.addChild(lighting.shadow.mask);
    }

    /**
     * Remove a light sprite to layer.
     * @param {Number} id 
     */
    removeLight(id) {
		let index = this.layer.children.findIndex(light => light.id === id);
        if (index === -1) { Shora.warn('cant remove light' + id); return; }
        const light = this.layer.removeChildAt(index);
        this.lights[light.id] = null;
        light.destroy(light.static);
	}

    update() {
        if (this._displayX !== $gameMap.displayX() || this._displayY !== $gameMap.displayY()) {
            this._displayX = $gameMap.displayX(); this._displayY = $gameMap.displayY();
            this.updateDisplay();
        }
        for (const child of this.layer.children) {
            if (child.update) child.update();
        }
        Graphics.app.renderer.render(this.layer, this.lightTexture, false);
    }

    updateDisplay() {
        $gameLighting.updateDisplay();
        $gameShadow.update();
        for (const child of this.layer.children) {
            if (child.updateDisplay) child.updateDisplay();
        }
    }

    // command
    setMapAmbient(color, time) {
        this._surface.setMapAmbient(color, time);
    }

}

class LightingSurface extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = 0xffffff;
        this.ambient = new ColorAnimation(this, $gameLighting.PARAMETERS.ambient);
    }

    destroy() {
        this.ambient.destroy();
        this.ambient = null;
        super.destroy();
    }

    setMapAmbient(color, time) {
        $gameLighting.PARAMETERS.ambient = color;
        this.ambient.set(color, time || 1);
    }

    update() {
        this.ambient.update();
        $gameLighting.PARAMETERS.ambient = this.tint;
    }
    updateDisplay() {
        //
    }

}

class LightingSprite extends PIXI.Sprite {

    get character() {
        if (!this.id) return $gamePlayer;
        return $gameMap._events[this.id];
    }

    constructor(options) {
        super();

        this.renderable = false;
        this.id = options.id;
        this.static = options.static;

        this.fileName = options.filename;
        this.lightName = options.name;
        this.colorFilter = options.colorfilter;

        this.updateTexture();

        this.offset = new OffsetAnimation(options.offset.x, options.offset.y);
        this.setPostion(options);
        this.anchor = new PIXI.Point(0.5, 0.5);
        this.bwall = options.bwall;

         if (options.direction) {
            this.direction = new DirectionManager(this);
        }

        // animation
        this.pulse = new PulseAnimation(this, options.animation.pulse);
        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new ColorAnimation(this, Number(options.tint));

        this._shadow = options.shadow;
        if (this._shadow) {
            this._static = options.static;
            this.shadowOffsetX = options.shadowOffsetX || 0;
            this.shadowOffsetY = options.shadowOffsetY || 0; 
            if (!this.bwall) // 54.00001; tw * h + 6 + eps
            	this.shadowOffsetY += $gameShadow.getWallHeight(this.globalX(), this.globalY());
            this.renderTexture = PIXI.RenderTexture.create(this.width, this.height); // texture to cache
            this.shadow = new Shadow(this.globalX() + this.shadowOffsetX, this.globalY() + this.shadowOffsetY, this.globalBounds(), options.shadowambient);
            this.setMask(this.shadow.mask);
            this.shadow.mask.renderable = true;
            this.snapshot();
            this.setMask(null);
            this.shadow.mask.renderable = false;
            if (this._static) {
                this.setMask(null);
                this.shadow.destroy();
                this.shadow = null;
            }
        } else {
            this.blendMode = PIXI.BLEND_MODES.ADD;
        }

        this.updateDisplay();
    }

    setMask(sprite) {
        if (!sprite) {
            this.mask = null;
            this.filters = null;
            this.blendMode = PIXI.BLEND_MODES.ADD;
            return;
        }
        if (sprite instanceof PIXI.Graphics) {
            this.filters = null;
            this.mask = sprite;
            this.blendMode = PIXI.BLEND_MODES.ADD;
        } else {
            this.mask = null;
            this.blendMode = 0;
            if (!this.shadowFilter) {
                this.shadowFilter = [new PIXI.SpriteMaskFilter(sprite)];
                this.shadowFilter[0].blendMode = PIXI.BLEND_MODES.ADD;
            }
            this.filters = this.shadowFilter;
        }
    }

    destroy() {
        // this.character.lighting = null;
        // this.character = null; // ref -> get
        this.pulse.destroy();
        this.flicker.destroy();
        this.color.destroy();
        if (this.direction) this.direction.destroy();
        if (this._shadow) {
            this.renderTexture.destroy(true);
            this.renderTexture = null;
            if (this.shadow) this.shadow.destroy();
            this.shadow = null;
            //this.shadowFilter[0].destroy();
            this.shadowFilter = null;
        }
        this.pulse = null;
        this.flicker = null;
        this.color = null;
        this.offset = null;
        this.rotate = null;
        this.filters = null;
        super.destroy();
    }

    snapshot() {
        TextureManager.snapshot(this)
    }

    update() {
        this.updatePostion();
        this.updateShadow();
        this.updateAnimation();
    }

    needRecalculateShadow() {
        return !this.character.isStopping() || 
        this.offset.updating();
    }

    needUpdateShadowMask() {
        return this.needRecalculateShadow() || 
        (this.direction && this.direction.rotate.updating()) || !this.id;
    }

    updateShadow() {
        if (!this._shadow || this._static || !this.renderable) return;

        // if shadow stopped -> take a snap
        if (this.needUpdateShadowMask()) {
            // update shadow
            this.shadow.mask.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
            this.shadow.mask.y = -$gameMap.displayY() * $gameMap.tileHeight();
            if (this.needRecalculateShadow()) {
                this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
            } else {
                this.shadow.mask.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
                this.shadow.mask.y = -$gameMap.displayY() * $gameMap.tileHeight();
            }
            // update mask 
            if (!this.filters) {
                this.updateTexture(); 
                this.setMask(this.shadow.mask);
            }
            
        } else if (this.filters) {
            // snap
            console.log('snap')
            this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
            this.shadow.mask.renderable = true;
            this.shadowOffsetX += $gameMap.displayX() * $gameMap.tileWidth();
            this.shadowOffsetY += $gameMap.displayY() * $gameMap.tileWidth();
            this.snapshot();
            this.shadowOffsetX -= $gameMap.displayX() * $gameMap.tileWidth();
            this.shadowOffsetY -= $gameMap.displayY() * $gameMap.tileWidth();
            this.setMask(null);
            this.shadow.mask.renderable = false;
        }
    }

    updatePostion() {
        this.x = this.character.screenX() + this.offset.x;
        this.y = this.character.screenY() + this.offset.y;
    }

    updateAnimation() {
        if (!this.renderable) return;
        this.flicker.update();
        this.offset.update();
        this.color.update();
        this.pulse.update();
        if (this.direction) this.direction.update();
    }

    updateDisplay() {
        let [x, y] = [this.character.screenX(), this.character.screenY()];
        let minX = x - (this.width / 2),
            minY = y - (this.height / 2),
            maxX = x + (this.width / 2),
            maxY = y + (this.height / 2);
        this.renderable = $gameLighting.inDisplay(minX, minY, maxX, maxY);
    }

    globalX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
    }

    globalY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
    }

    globalBounds() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
        return bounds;
    }

    localBounds() {
        const bounds = this.getBounds();
        bounds.x += this.shadowOffsetX;
        bounds.y += this.shadowOffsetY;
        return bounds;
    }

    setPostion(options) {
        // this.character = options.character; // ref -> set
        this.x = this.character.screenX();
        this.y = this.character.screenY();
    }

    updateTexture() {
        this.texture = TextureManager.filter($shoraLayer.load(this.fileName), this.colorFilter, this.lightName);
    }

    // command
    /**
     * Set light to color in time tick(s).
     * @param {Number} color 
     * @param {Number} time 
     */
    setColor(color, time) {
        this.color.set(color, time || 1);
    }

    setOffsetX(x, time, type) {
        this.offset.setX(x, time || 1, type);
    }

    setOffsetY(y, time, type) {
        this.offset.setY(y, time || 1, type);
    }

    setOffset(x, y, time, type) {
        this.offset.setX(x, time || 1, type);
        this.offset.setY(y, time || 1, type);
    }
    /*
    setShadow(shadow) {
        this._shadow = shadow;
    }

    setStatic(_static) {
        this.static = _static;
    }
    */
}

class Shadow {
    get mask() {
        return this.shadowMask;
    }
    constructor(ox, oy, bounds, shadowAmbient) {
        // TODO: Calculate Transform.
        this._shadowMask = new PIXI.Graphics();
        this._shadowTexture = PIXI.RenderTexture.create($gameLighting.width(), $gameLighting.height());
        this.shadowMask = new PIXI.Sprite(this._shadowTexture);
        this.shadowAmbient = shadowAmbient;
        this.updateGlobal(ox, oy, bounds);
    }

    destroy() {
        this.polygon = null; this.bounds = null; this._parallelSegments = null;
        this._shadowMask.destroy(true); this._shadowMask = null;
        this._shadowTexture = null; this.shadowMask = null;
        /* this will get destroyed by layer call
        this._shadowTexture.destroy(true); 
        this.shadowMask.destroy(true); 
        */
        this.bounds = null;
    }

    update(x, y, bounds) {
        //console.log("update x =" + x + " y = " + y);
        this.bounds = bounds;
        this.polygon = ShadowSystem.computeViewport([x, y], $gameShadow.segments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        //this.bounds = bounds;
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(y, $gameShadow.lowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
    }

    updateGlobal(ox, oy, bounds) {
        //console.log("update global x =" + ox + " y = " + oy);
        this.bounds = bounds;
        this.polygon = ShadowSystem.computeViewport([ox, oy], $gameShadow.globalSegments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(oy, $gameShadow.globalLowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        let {x, y} = $gameShadow.upperWalls;
        $gameShadow.upperWalls.x = $gameShadow.upperWalls.y = 0;
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
        $gameShadow.upperWalls.x = x; $gameShadow.upperWalls.y = y;
    }

    drawWall(index, oy, lowerWalls) {
		let [x, y] = this.polygon[index], last = (index == 0 ? this.polygon.length - 1 : index - 1);
		let [nx, ny] = this.polygon[last];

		let tw = $gameMap.tileWidth();
		if (y == ny) {
			if (!this._parallelSegments[y]) this._parallelSegments[y] = [];
			this._parallelSegments[y].push([nx, x]);
		}
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
			if (y == ny && y == y1 && x >= x1 && x <= x2 && nx >= x1 && nx <= x2 && oy >= y1) {
				this._shadowMask.lineTo(nx, ny - tw * height)
							   .lineTo(x, y - tw * height)
			}
		}
	};

    containParallelSegment(y, u, v) {
		if (!this._parallelSegments[y]) return false;
		let lo = 0, hi = this._parallelSegments[y].length - 1, result = -1;
		while (lo <= hi) {
			let mid = (lo + hi) >> 1;
			if (this._parallelSegments[y][mid][0] >= u) {
				result = mid;
				hi = mid - 1;
			} else lo = mid + 1;
		}
		if (result == -1) return false;
		let [x1, x2] = this._parallelSegments[y][result];
		if (v >= x1) return true;
		if (result === 0) return false; 
        [x1, x2] = this._parallelSegments[y][result - 1];
		//if (v >= x1) return true;
        return false;
	}

    draw(oy, lowerWalls) {
        this._shadowMask.beginFill(this.shadowAmbient);
		this._shadowMask.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this._shadowMask.endFill();

		this._shadowMask.beginFill(0xffffff);
		this._shadowMask.moveTo(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i, oy, lowerWalls);
            this._shadowMask.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this._shadowMask.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0, oy, lowerWalls);
		if (this.polygon[0][1] == this.polygon[this.polygon.length - 1][1]) {
			if (!this._parallelSegments[this.polygon[0][1]]) this._parallelSegments[this.polygon[0][1]] = [];
			this._parallelSegments[this.polygon[0][1]].push([this.polygon[0][0], this.polygon[this.polygon.length - 1][0]]);
		}
		this._shadowMask.endFill(); 

		for (let y in this._parallelSegments) {
			for (let i in this._parallelSegments[y]) {
				if (this._parallelSegments[y][i][0] > this._parallelSegments[y][i][1])
				[this._parallelSegments[y][i][0], this._parallelSegments[y][i][1]] = [this._parallelSegments[y][i][1], this._parallelSegments[y][i][0]];
			}
			this._parallelSegments[y].sort((a, b) => a[0] - b[0]);
		}

		//drawing lower-walls
        this._shadowMask.beginFill(this.shadowAmbient); 
        let tw = $gameMap.tileWidth();
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
            if (this.containParallelSegment(y1, x1, x2)) continue;
			this._shadowMask.moveTo(x1, y1);
			this._shadowMask.lineTo(x1, y1-tw*height);
			this._shadowMask.lineTo(x2, y2-tw*height);
			this._shadowMask.lineTo(x2, y2);
		}
        this._shadowMask.endFill();
        
        /* drawing top-walls
        this._shadowMask.beginFill(0x333333);
        for (let i = Math.max(0, Math.floor(this.bounds.top / 48));
            i <= Math.min($gameShadow.topWalls.length - 1, Math.ceil(this.bounds.bottom / 48)); ++i) {
            let j = $gameShadow.topWalls[i].pair_floor_search(this.bounds.left, 1) + 1;
            for (; j < $gameShadow.topWalls[i].length && $gameShadow.topWalls[i][j][0] < this.bounds.right; ++j) {
                let [begin, end] = $gameShadow.topWalls[i][j];
                this._shadowMask.drawRect(begin, i*48, end-begin, 48);
            }
        }
        this._shadowMask.endFill();
        */
    }
}

var ShadowSystem = (function() {

    const epsilon = () => 0.0000001;

    const equal = (a, b) => {
        if (Math.abs(a[0] - b[0]) < epsilon() && Math.abs(a[1] - b[1]) < epsilon()) return true;
        return false;
    };

    const parentOfThis = (index) => {
        return Math.floor((index-1)/2);
    };

    const child = (index) => {
        return 2*index+1;
    };

    const angle = (a, b) => {
        return Math.atan2(b[1]-a[1], b[0]-a[0]) * 180 / Math.PI;
    };

    const angle2 = (a, b, c) => {
        let a1 = angle(a,b);
        let a2 = angle(b,c);
        let a3 = a1 - a2;
        if (a3 < 0) a3 += 360;
        if (a3 > 360) a3 -= 360;
        return a3;
    };

    const sortPoints = (position, segments) => {
        let points = new Array(segments.length * 2);
        for (let i = 0; i < segments.length; ++i) {
            for (let j = 0; j < 2; ++j) {
                let a = angle(segments[i][j], position);
                points[2*i+j] = [i, j, a];
            }
        }
        points.sort(function(a,b) {return a[2]-b[2];});
        return points;
    };

    const intersectLines = (a1, a2, b1, b2) => {
        let dbx = b2[0] - b1[0];
        let dby = b2[1] - b1[1];
        let dax = a2[0] - a1[0];
        let day = a2[1] - a1[1];
        
        let u_b  = dby * dax - dbx * day;
        if (u_b != 0) {
            let ua = (dbx * (a1[1] - b1[1]) - dby * (a1[0] - b1[0])) / u_b;
            return [a1[0] - ua * -dax, a1[1] - ua * -day];
        }
        return [];
    };

    const distance = (a, b) => {
        let dx = a[0]-b[0];
        let dy = a[1]-b[1];
        return dx*dx + dy*dy;
    };

    const isOnSegment = (xi, yi, xj, yj, xk, yk) => {
      return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) &&
             (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
    };

    const computeDirection = (xi, yi, xj, yj, xk, yk) => {
      a = (xk - xi) * (yj - yi);
      b = (xj - xi) * (yk - yi);
      return a < b ? -1 : a > b ? 1 : 0;
    };

    const doLineSegmentsIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
      d1 = computeDirection(x3, y3, x4, y4, x1, y1);
      d2 = computeDirection(x3, y3, x4, y4, x2, y2);
      d3 = computeDirection(x1, y1, x2, y2, x3, y3);
      d4 = computeDirection(x1, y1, x2, y2, x4, y4);
      return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
              ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
             (d1 == 0 && isOnSegment(x3, y3, x4, y4, x1, y1)) ||
             (d2 == 0 && isOnSegment(x3, y3, x4, y4, x2, y2)) ||
             (d3 == 0 && isOnSegment(x1, y1, x2, y2, x3, y3)) ||
             (d4 == 0 && isOnSegment(x1, y1, x2, y2, x4, y4));
    };

    const lessThan = (index1, index2, position, segments, destination) => {
        let inter1 = intersectLines(segments[index1][0], segments[index1][1], position, destination);
        let inter2 = intersectLines(segments[index2][0], segments[index2][1], position, destination);
        if (!equal(inter1, inter2)) {
            let d1 = distance(inter1, position);
            let d2 = distance(inter2, position);
            return d1 < d2;
        }
        let end1 = 0;
        if (equal(inter1, segments[index1][0])) end1 = 1;
        let end2 = 0;
        if (equal(inter2, segments[index2][0])) end2 = 1;
        let a1 = angle2(segments[index1][end1], inter1, position);
        let a2 = angle2(segments[index2][end2], inter2, position);
        if (a1 < 180) {
            if (a2 > 180) return true;
            return a2 < a1;
        }
        return a1 < a2;
    };

    const remove = (index, heap, position, segments, destination, map) => {
        map[heap[index]] = -1;
        if (index == heap.length - 1) {
            heap.pop();
            return;
        }
        heap[index] = heap.pop();
        map[heap[index]] = index;
        let cur = index;
        let parent = parentOfThis(cur);
        if (cur != 0 && lessThan(heap[cur], heap[parent], position, segments, destination)) {
            while (cur > 0) {
                let parent = parentOfThis(cur);
                if (!lessThan(heap[cur], heap[parent], position, segments, destination)) {
                    break;
                }
                map[heap[parent]] = cur;
                map[heap[cur]] = parent;
                let temp = heap[cur];
                heap[cur] = heap[parent];
                heap[parent] = temp;
                cur = parent;
            }
        } else {
            while (true) {
                let left = child(cur);
                let right = left + 1;
                if (left < heap.length && lessThan(heap[left], heap[cur], position, segments, destination) &&
                        (right == heap.length || lessThan(heap[left], heap[right], position, segments, destination))) {
                    map[heap[left]] = cur;
                    map[heap[cur]] = left;
                    let temp = heap[left];
                    heap[left] = heap[cur];
                    heap[cur] = temp;
                    cur = left;
                } else if (right < heap.length && lessThan(heap[right], heap[cur], position, segments, destination)) {
                    map[heap[right]] = cur;
                    map[heap[cur]] = right;
                    let temp = heap[right];
                    heap[right] = heap[cur];
                    heap[cur] = temp;
                    cur = right;
                } else break;
            }
        }
    };

    const insert = (index, heap, position, segments, destination, map) => {
        let intersect = intersectLines(segments[index][0], segments[index][1], position, destination);
        if (intersect.length == 0) return;
        let cur = heap.length;
        heap.push(index);
        map[index] = cur;
        while (cur > 0) {
            let parent = parentOfThis(cur);
            if (!lessThan(heap[cur], heap[parent], position, segments, destination)) {
                break;
            }
            map[heap[parent]] = cur;
            map[heap[cur]] = parent;
            let temp = heap[cur];
            heap[cur] = heap[parent];
            heap[parent] = temp;
            cur = parent;
        }
    };

    const compute = (position, segments) => {
        let bounded = [];
        let minX = position[0];
        let minY = position[1];
        let maxX = position[0];
        let maxY = position[1];
        for (let i = 0; i < segments.length; ++i) {
            for (let j = 0; j < 2; ++j) {
                minX = Math.min(minX, segments[i][j][0]);
                minY = Math.min(minY, segments[i][j][1]);
                maxX = Math.max(maxX, segments[i][j][0]);
                maxY = Math.max(maxY, segments[i][j][1]);
            }
            bounded.push([[segments[i][0][0], segments[i][0][1]], [segments[i][1][0], segments[i][1][1]]]);
        }
        --minX;
        --minY;
        ++maxX;
        ++maxY;
        bounded.push([[minX, minY],[maxX, minY]]);
        bounded.push([[maxX, minY],[maxX, maxY]]);
        bounded.push([[maxX, maxY],[minX, maxY]]);
        bounded.push([[minX, maxY],[minX, minY]]);
        let polygon = [];
        let sorted = sortPoints(position, bounded);
        let map = new Array(bounded.length);
        for (let i = 0; i < map.length; ++i) map[i] = -1;
        let heap = [];
        let start = [position[0] + 1, position[1]];
        for (let i = 0; i < bounded.length; ++i) {
            let a1 = angle(bounded[i][0], position);
            let a2 = angle(bounded[i][1], position);
            let active = false;
            if (a1 > -180 && a1 <= 0 && a2 <= 180 && a2 >= 0 && a2 - a1 > 180) active = true;
            if (a2 > -180 && a2 <= 0 && a1 <= 180 && a1 >= 0 && a1 - a2 > 180) active = true;
            if (active) {
                insert(i, heap, position, bounded, start, map);
            }
        }
        for (let i = 0; i < sorted.length;) {
            let extend = false;
            let shorten = false;
            let orig = i;
            let vertex = bounded[sorted[i][0]][sorted[i][1]];
            let old_segment = heap[0];
            do {
                if (map[sorted[i][0]] != -1) {
                    if (sorted[i][0] == old_segment) {
                        extend = true;
                        vertex = bounded[sorted[i][0]][sorted[i][1]];
                    }
                    remove(map[sorted[i][0]], heap, position, bounded, vertex, map);
                } else {
                    insert(sorted[i][0], heap, position, bounded, vertex, map);
                    if (heap[0] != old_segment) {
                        shorten = true;
                    }
                }
                ++i;
                if (i == sorted.length) break;
            } while (sorted[i][2] < sorted[orig][2] + epsilon());

            if (extend) {
                polygon.push(vertex);
                let cur = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                if (!equal(cur, vertex)) polygon.push(cur);
            } else if (shorten) {
                polygon.push(intersectLines(bounded[old_segment][0], bounded[old_segment][1], position, vertex));
                polygon.push(intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex));
            } 
        }
        return polygon;
    };

    const computeViewport = (position, segments, viewportMinCorner, viewportMaxCorner) => {
        let brokenSegments = [];
        let viewport = [[viewportMinCorner[0],viewportMinCorner[1]],[viewportMaxCorner[0],viewportMinCorner[1]],[viewportMaxCorner[0],viewportMaxCorner[1]],[viewportMinCorner[0],viewportMaxCorner[1]]];
        for (let i = 0; i < segments.length; ++i) {
            if (segments[i][0][0] < viewportMinCorner[0] && segments[i][1][0] < viewportMinCorner[0]) continue;
            if (segments[i][0][1] < viewportMinCorner[1] && segments[i][1][1] < viewportMinCorner[1]) continue;
            if (segments[i][0][0] > viewportMaxCorner[0] && segments[i][1][0] > viewportMaxCorner[0]) continue;
            if (segments[i][0][1] > viewportMaxCorner[1] && segments[i][1][1] > viewportMaxCorner[1]) continue;
            let intersections = [];
            for (let j = 0; j < viewport.length; ++j) {
                let k = j + 1;
                if (k == viewport.length) k = 0;
                if (doLineSegmentsIntersect(segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1], viewport[j][0], viewport[j][1], viewport[k][0], viewport[k][1])) {
                    let intersect = intersectLines(segments[i][0], segments[i][1], viewport[j], viewport[k]);
                    if (intersect.length != 2) continue;
                    if (equal(intersect, segments[i][0]) || equal(intersect, segments[i][1])) continue;
                    intersections.push(intersect);
                }
            }
            let start = [segments[i][0][0], segments[i][0][1]];
            while (intersections.length > 0) {
                let endIndex = 0;
                let endDis = distance(start, intersections[0]);
                for (let j = 1; j < intersections.length; ++j) {
                    let dis = distance(start, intersections[j]);
                    if (dis < endDis) {
                        endDis = dis;
                        endIndex = j;
                    }
                }
                brokenSegments.push([[start[0], start[1]], [intersections[endIndex][0], intersections[endIndex][1]]]);
                start[0] = intersections[endIndex][0];
                start[1] = intersections[endIndex][1];
                intersections.splice(endIndex, 1);
            }
            brokenSegments.push([start, [segments[i][1][0], segments[i][1][1]]]);
        }

        let viewportSegments = [];
        for (let i = 0; i < brokenSegments.length; ++i) {
            if (inViewport(brokenSegments[i][0], viewportMinCorner, viewportMaxCorner) && inViewport(brokenSegments[i][1], viewportMinCorner, viewportMaxCorner)) {
                viewportSegments.push([[brokenSegments[i][0][0], brokenSegments[i][0][1]], [brokenSegments[i][1][0], brokenSegments[i][1][1]]]);
            }
        }
        let eps = epsilon() * 10;
        viewportSegments.push([[viewportMinCorner[0]-eps,viewportMinCorner[1]-eps],[viewportMaxCorner[0]+eps,viewportMinCorner[1]-eps]]);
        viewportSegments.push([[viewportMaxCorner[0]+eps,viewportMinCorner[1]-eps],[viewportMaxCorner[0]+eps,viewportMaxCorner[1]+eps]]);
        viewportSegments.push([[viewportMaxCorner[0]+eps,viewportMaxCorner[1]+eps],[viewportMinCorner[0]-eps,viewportMaxCorner[1]+eps]]);
        viewportSegments.push([[viewportMinCorner[0]-eps,viewportMaxCorner[1]+eps],[viewportMinCorner[0]-eps,viewportMinCorner[1]-eps]]);
        return compute(position, viewportSegments);
    };

    const inViewport = (position, viewportMinCorner, viewportMaxCorner) => {
        if (position[0] < viewportMinCorner[0] - epsilon()) return false;
        if (position[1] < viewportMinCorner[1] - epsilon()) return false;
        if (position[0] > viewportMaxCorner[0] + epsilon()) return false;
        if (position[1] > viewportMaxCorner[1] + epsilon()) return false;
        return true;
    };

    const breakIntersections = (segments) => {
        let output = [];
        for (let i = 0; i < segments.length; ++i) {
            let intersections = [];
            for (let j = 0; j < segments.length; ++j) {
                if (i == j) continue;
                if (doLineSegmentsIntersect(segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1], segments[j][0][0], segments[j][0][1], segments[j][1][0], segments[j][1][1])) {
                    let intersect = intersectLines(segments[i][0], segments[i][1], segments[j][0], segments[j][1]);
                    if (intersect.length != 2) continue;
                    if (equal(intersect, segments[i][0]) || equal(intersect, segments[i][1])) continue;
                    intersections.push(intersect);
                }
            }
            let start = [segments[i][0][0], segments[i][0][1]];
            while (intersections.length > 0) {
                let endIndex = 0;
                let endDis = distance(start, intersections[0]);
                for (let j = 1; j < intersections.length; ++j) {
                    let dis = distance(start, intersections[j]);
                    if (dis < endDis) {
                        endDis = dis;
                        endIndex = j;
                    }
                }
                output.push([[start[0], start[1]], [intersections[endIndex][0], intersections[endIndex][1]]]);
                start[0] = intersections[endIndex][0];
                start[1] = intersections[endIndex][1];
                intersections.splice(endIndex, 1);
            }
            output.push([start, [segments[i][1][0], segments[i][1][1]]]);
        }
        return output;
    };

    const getSegments = (segments) => {
        let newSegments = [];
        for (let i = 0; i < segments.length; ++i) {
            let [p1x, p1y, p2x, p2y] = segments[i];
            newSegments.push([[p1x, p1y], [p2x, p2y]]);
        }
        newSegments = breakIntersections(newSegments);
        return newSegments;
    };

    let exports = {};

    exports.computeViewport = computeViewport;
    exports.compute = compute;
    exports.getSegments = getSegments;

    return exports;

})();

Shora.Animation = class {
    constructor(sprite, status) {
        this._sprite = sprite;
        this._status = status;
    }
    static get transition() {
        return [
            function(time) { // linear
                return time;
            },
            function(time) { // easeInOut
                let sqt = time * time;
                return sqt / (2.0 * (sqt - time) + 1.0);
            }
        ]
    }
    destroy() {
        this._sprite = null;
    }
}

class FlickerAnimation extends Shora.Animation {
    constructor(sprite, options) {
        super(sprite, options.status);

        this.oalpha = 1;
	    this.flickIntensity = options.flickintensity || 1;
        this.flickSpeed = options.flickspeed || 1;
        
	    this._flickSpeed = 20 * this.flickSpeed;
	    this._flickIntensity = 1 / (1.1 * this.flickIntensity);
	    this._flickMax = 1000;
	    this._flickCounter = this.flickMax;
    }

    update() {
        if (!this._status) return;
        if (this._flickCounter > 0 && Math.randomInt(this._flickCounter / 5) !== 0) {
            this._flickCounter -= this._flickSpeed;
            this._sprite.alpha = this.oalpha;
        } else {
            this._flickCounter = this._flickMax;
            this._sprite.alpha = this._flickIntensity;
        }
    }
}

class PulseAnimation extends Shora.Animation {
    constructor(sprite, options) {
        super(sprite, options.status);
        this.pulsating = true;
        this.range = 1;
        this.pulseFactor = options.pulsefactor / 100;
        this.pulseMax = this.range + this.pulseFactor;
		this.pulseMin = this.range - this.pulseFactor;
        this.pulseSpeed = options.pulsespeed / 1000;
        
        this.tick = this.space = 0;
    }

    set(range, time) {
        this.tick = time;
        this.space = (range - this.range) / time;
    }

    updating() {
        return this.pulseFactor !== 0;
    }

    update() {
    	if (!this._status) return;
        let spd = Math.random() / 500 + this.pulseSpeed;
        if (this.pulsating) {
	        if (this._sprite.scale.x < this.pulseMax) {
	            this._sprite.scale.x += spd;
	            this._sprite.scale.y += spd;
	        } else {
	            this.pulsating = false;
	        }
	    } else {
	        if (this._sprite.scale.x > this.pulseMin) {
	            this._sprite.scale.x -= spd;
	            this._sprite.scale.y -= spd;
	        } else {
	            this.pulsating = true;
	        }
	    }
    }
}

class RotationAnimation extends Shora.Animation {
    constructor(sprite, angle) {
        super(sprite, 0);
        this.r0 = this.r1 = angle; 
        this.delta = this.tick = this.time = 0;
        this._sprite.rotation = angle;
    }

    updating() {
        return this._sprite.rotation || this.tick < this.time;
    }

    update() {
        if (this.tick < this.time) {
            this._sprite.rotation = this.r0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
        }
    }

    set(angle, time, type) {
        this.r0 = this._sprite.rotation; this.r1 = angle;
        this.delta = this.r1 - this.r0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class DirectionManager {
    constructor(sprite) {
        this._sprite = sprite; 
        this.direction = this._sprite.character.direction();
        this.rotate = new RotationAnimation(sprite, this.angle());
    }

    destroy() {
        this.rotate.destroy();
        this.rotate = null;
        this._sprite = null;
    }

    angle() {
        let dest = [3.125, 4.6875, 1.5625, 0]; //[ [3.125, 4.6875, 1.5625, 0], [-3.125, -1.5625, -4.6825, 6.25] ];
        let x = dest[this.direction / 2 - 1];
        if (Math.abs(this._sprite.rotation - 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation -= 6.25;
        else if (Math.abs(this._sprite.rotation + 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation += 6.25;
        return x;
    }

    update() {
        if (this.direction != this._sprite.character.direction()) {
            this.direction = this._sprite.character.direction();
            this.rotate.set(this.angle(), 20, 2);
         }
        this.rotate.update();
    }

}

class OffsetAnimation {
    constructor(x, y) {
        this.x = this.ox = x;
        this.y = this.oy = y;
        this.tick_x = 2; this.time_x = this.delta_x = 1;
        this.tick_y = 2; this.time_y = this.delta_y = 1;
        this.type_x = this.type_y = 0;
    }

    updating() {
        return this.tick_x <= this.time_x || this.tick_y <= this.time_y;
    }

    setX(x, time, type) {
        this.ox = this.x;
        this.delta_x = x - this.ox;
        this.time_x = time; this.tick_x = 1;
        if (type) this.type_x = type - 1;
    }

    setY(y, time, type) {
        this.oy = this.y;
        this.delta_y = y - this.oy;
        this.time_y = time; this.tick_y = 1;
        if (type) this.type_y = type - 1;
    }

    update() {
        if (this.tick_x <= this.time_x) {
            this.x = this.ox + Shora.Animation.transition[this.type_x](this.tick_x / this.time_x) * this.delta_x;
            this.tick_x++;
        }
        if (this.tick_y <= this.time_y) {
            this.y = this.oy + Shora.Animation.transition[this.type_y](this.tick_y / this.time_y) * this.delta_y;
            this.tick_y++;
        }
    }
}

class ColorAnimation extends Shora.Animation {
    constructor(sprite, color) {
        super(sprite);
        this._sprite.tint = color || Math.round(Math.random() * 0xfffff);

        this.ocolor = Shora.ColorManager.hexToRGB(color);
        this.dcolor = this.ocolor;
        this.tick = this.len = 0;
    }
    set(color, time) {
        this.tick = 0; this.len = time;
        this.ocolor = this.dcolor;
        this.dcolor = Shora.ColorManager.hexToRGB(color);
    }
    update() {
        if (this.tick < this.len) {
            let p = this.tick / this.len;
            this._sprite.tint = Shora.ColorManager.transition(p, this.ocolor, this.dcolor);
            this.tick++;
        }
    }
}

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
    filter: function(baseTexture, colorFilter, name) {
        //return new PIXI.Texture(baseTexture);
        if (!colorFilter) return baseTexture;
        if ($shoraLayer.textureCache(name)) return $shoraLayer.textureCache(name);
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
		return $shoraLayer.lightingCache[name] = renderedTexture;
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
        
        Graphics.app.renderer.render(sprite.shadow.mask, Shora.maskTexture, false, Shora.tempMatrix, true);
        let maskSprite = new PIXI.Sprite(Shora.maskTexture);
        Shora.MASK = maskSprite;

        sprite.filters = [new PIXI.SpriteMaskFilter(maskSprite)];

		//sprite.renderTexture.resize(sprite.width, sprite.height);
        Graphics.app.renderer.render(sprite, sprite.renderTexture);
        sprite.filters = null;
        maskSprite.destroy(1);

        sprite.x = x; 
        sprite.y = y; 
        sprite.anchor.set(0.5);
        sprite.rotation = rotation; 
        sprite.pulse.set(1, 1);
        sprite.texture = sprite.renderTexture;
    } 
}

class GameLighting {
    constructor() {
        this.LIGHTING = {};
        this.loadParameters();
        this.loadLighting();
    }

    loadParameters() {
        this.PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Map']);
        this.PARAMETERS.ambient = this.PARAMETERS.ambient.toHexValue();
        this.PARAMETERS.shadowAmbient = this.PARAMETERS.shadowAmbient.toHexValue();
        this.PARAMETERS.topBlockAmbient = this.PARAMETERS.topBlockAmbient.toHexValue();
        
        this.GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
        this.GAME_PARAMETERS.regionStart = Number(this.GAME_PARAMETERS.regionStart);
        this.GAME_PARAMETERS.regionEnd = Number(this.GAME_PARAMETERS.regionEnd);
    }

    loadLighting() {
        // add default light
        this.addLighting(Shora.Lighting.PARAMETERS['default']);
        // add custom light
        this.addCustomLighting(Shora.Lighting.PARAMETERS['LightList']);
    }

    addCustomLighting(list) {
        list = JSON.parse(list);
        for (let i = 0; i < list.length; ++i) {
            this.addLighting(list[i]);
        }
    }

    /**
     * Register new lighting type.
     * @param {String} name 
     * @param {Object} settings 
     */
    addLighting(settings) {
        const parameters = JSON.parse(settings);
        let name = parameters.name;
        if (name == "") {
            console.warn('Lighting name field cannot be left empty. Cancelling register process.'); 
            return;
        }
        console.log('Lighting ' + name + ' has been registered');
        parameters.direction = parameters.direction === 'true';
        parameters.tint = parameters.tint.toHexValue();
        parameters.bwall = parameters.bwall === 'true';
        parameters.shadow = parameters.shadow === 'true';
        parameters.static = parameters.static === 'true';
        
        parameters.shadowambient = 
        	parameters.shadowambient == "" ?  
        	this.PARAMETERS.shadowAmbient :
        	parameters.shadowambient.toHexValue();

        parameters.offset = JSON.parse(parameters.offset);
        for (const p in parameters.offset) {
            parameters.offset[p] = Number(parameters.offset[p]);
        }

        parameters.colorfilter = JSON.parse(parameters.colorfilter);
        parameters.colorfilter.hue = Number(parameters.colorfilter.hue);
        parameters.colorfilter.brightness = Number(parameters.colorfilter.brightness);
        parameters.colorfilter.colortone = parameters.colorfilter.colortone.toRGBA();
        parameters.colorfilter.blendcolor = parameters.colorfilter.blendcolor.toRGBA();

        parameters.animation = JSON.parse(parameters.animation);
        for (const p in parameters.animation) {
            if (p[0] === '.') continue;
            parameters.animation[p] = JSON.parse(parameters.animation[p]);
            for (let a in parameters.animation[p]) {
                parameters.animation[p][a] = JSON.parse(parameters.animation[p][a]);
            }
        }

        parameters.name = name;
        this.LIGHTING[name] = parameters;
    }

    /**
     * A list of lights of map.
     */
    get lighting() {
        return $gameMap._lighting;
    }

    /**
     * Add a lighting instance to scene.
     * 
     * @param {Game_Character} character 
     * @param {Object} options 
     */
    add(options) {
        if (!this.LIGHTING[options.name]) {
            Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
            options.name = 'default';
        }
        const params = {...this.LIGHTING[options.name], ...options};
        this.remove(params.id);
        this.lighting.push(params);
        return $shoraLayer.lighting.addLight(params);
    }

    /**
     * Remove a lighting instance from scene.
     * @param {Number} id 
     */
    remove(id) {
        let i;
        if ((i = this.lighting.findIndex(light => light.id === id)) !== -1) {
            this.lighting.splice(i, 1);
            $shoraLayer.lighting.removeLight(id);
        }
    }

    inDisplay(minX, minY, maxX, maxY) {
        return maxX >= this.minX && minX <= this.maxX && maxY >= this.minY && minY <= this.maxY;
    } 

    // update
    updateDisplay() {
        this.minX = 0; // todo
        this.minY = 0;
        this.maxX = Graphics._width;
        this.maxY = Graphics._height;
    }

    // command
    setMapAmbient(color, time) {
        $shoraLayer.lighting.setMapAmbient(color.toHexValue(), Number(time) || 1);
    }

    setShadowAmbient(color, time) {
    	this.PARAMETERS.shadowAmbient = color.toHexValue();
    }

    setTopBlockAmbient(color, time) {
    	this.PARAMETERS.topBlockAmbient = color.toHexValue();
    }


    // params
    shadowColor() {
        return this.PARAMETERS.ambient;
    }

    regionStart() {
        return this.GAME_PARAMETERS.regionStart;
    }

    regionEnd() {
        return this.GAME_PARAMETERS.regionEnd;
    }

    width() {
        return Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
    }

    height() {
        return Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);
    }

    setOffset(id, x, y, time, type) {
        $shoraLayer.lighting.lights[id].setOffset(x, y, time, type);
    }

    setOffsetX(id, x, time, type) {
        $shoraLayer.lighting.lights[id].setOffsetX(x, time, type);
    }

    setOffsetY(id, y, time, type) {
        $shoraLayer.lighting.lights[id].setOffsetY(y, time, type);
    }

    setColor(id, color, time) {
        $shoraLayer.lighting.lights[id].setColor(color, time);
    }
}

$gameLighting = new GameLighting();

class GameShadow {
    constructor() {
        this._segments = [];
        this.segments = [];
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];

        this.topWalls = []; // todo
    }

    refresh() {
        this._segments = [];
        this.segments = [];
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];
        this.upperWalls = new PIXI.Graphics();
        this.scanMapCaster();
		this.createSegments();
    }

    scanMapCaster() {
        this.map = new Array($gameMap.height())
            .fill(0)
            .map(() => new Array($gameMap.width()).fill(0));

        let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
        let regionStart = $gameLighting.regionStart();
        let regionEnd = $gameLighting.regionEnd();
        this.upperWalls.beginFill($gameLighting.PARAMETERS.topBlockAmbient);
        let flag = false, begin = 0, width = 0;
        for (var i = 0; i < $gameMap.height(); ++i) {
            this.topWalls.push([]);
            for (var j = 0; j < $gameMap.width(); ++j) {
                if (($gameMap.regionId(j, i) >= regionStart) && ($gameMap.regionId(j, i) <= regionEnd)) {
                    this.map[i][j] = $gameMap.regionId(j, i) - regionStart + 1; 
                }
                if (this.map[i][j]) {
                    this.upperWalls.drawRect(j * tw, i * th, tw, th);
                    if (!flag) {
                        flag = true;
                        begin = j * 48;
                    }
                    width += 48;
                } else if (flag) {
                    flag = false;
                    this.topWalls[i].push([begin, begin+width]);
                    width = 0;
                }
            }
        }
        this.upperWalls.endFill();
    }

    outOfBound(x, y) {
		return x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length;
    }
    
    addUpperSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.horizontalSegments.push([x * tw, (y + height) * th, (x + 1) * tw, (y + height) * th]);
    }
    
    addLowerSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.horizontalSegments.push([(x + 1) * tw, (y + height + 1) * th, x * tw, (y + height + 1) * th]);
        //[x2, y2, x1, y1, height]
		this.lowerWalls.push([(x + 1) * tw, (y + height + 1) * th, x * tw, (y + height + 1) * th, height]);
    }
    
    addRightSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.verticalSegments.push([(x + 1) * tw, (y + height) * th, (x + 1) * tw, (y + height + 1) * th]);
    }
    
    addLeftSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.verticalSegments.push([x * tw, (y + height) * th, x * tw, (y + height + 1) * th]);
    }
    
    addCaster(x, y, height) {
		// Check left of this postion.
		if (!this.outOfBound(x, y - 1) && this.map[y - 1][x]) {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				if (!this.map[y][x - 1]) {
					this.addLeftSegment(x, y, height);
				} 
			}
		} else {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				this.addUpperSegment(x, y, height);
				// Check left of this postion.
				if (!this.map[y][x - 1]) {
					this.addLeftSegment(x, y, height);
				} 
			} 
		} 

		// Check right of this postion.
		if (!this.outOfBound(x + 1, y)) {
			if (!this.map[y][x + 1]) {
				this.addRightSegment(x, y, height);
			}
		}

		// Check lower of this postion.
		if (!this.outOfBound(x, y + 1)) {
			if (!this.map[y + 1][x]) {
				this.addLowerSegment(x, y, height);
			}
		}
    }

    // TODO: binary search
    //[x2, y2, x1, y1, height]

    optimizeSegments(s) {
		for (let i = 0; i < s.length; ++i) {
			let [x1, y1] = [s[i][2], s[i][3]];
			for (let j = 0; j < s.length; ++j) {
				let [x2, y2] = [s[j][0], s[j][1]];
				if (x1 === x2 && y1 === y2) {
					s[i][2] = s[j][2];
					s[i][3] = s[j][3];
					s.splice(j, 1);
					i -= 1;
					break;
				}
			}
		}
    }
    
    createSegments() {
		for (let y = 0; y < this.map.length; y++) {
			for (let x = 0; x < this.map[y].length; x++) {
				if (this.map[y][x]) {
					this.addCaster(x, y, this.map[y][x]);
				}
			}
		}
		// Shadow Casters
		this.optimizeSegments(this.verticalSegments);
		this.optimizeSegments(this.horizontalSegments);
		this._segments = this.horizontalSegments.concat(this.verticalSegments);

		this.segments = ShadowSystem.getSegments(this._segments);
        this.originalSegments = this.segments.map(s => s.map(p => p.map(x => x / 48)));

		// Lower walls
        this.optimizeSegments(this.lowerWalls);
        this.lowerWalls.sort((a, b) => b[0] - a[0]);
        this.originalLowerWalls = this.lowerWalls.map(s => s.map(p => p >= $gameMap.tileWidth() ? p / $gameMap.tileWidth() : p));

        this.globalSegments = JSON.parse(JSON.stringify(this.segments));
        this.globalLowerWalls = JSON.parse(JSON.stringify(this.lowerWalls));
    }
    
    screenX(x) {
        let tw = $gameMap.tileWidth();
        return Math.round($gameMap.adjustX(x) * tw);
    }

    screenY(y) {
        let th = $gameMap.tileHeight();
        return Math.round($gameMap.adjustY(y) * th);
    }

    update() {
        // Update segments
        for (let i = 0; i < this.segments.length; ++i) {
            this.segments[i][0][0] = this.screenX(this.originalSegments[i][0][0]);
            this.segments[i][0][1] = this.screenY(this.originalSegments[i][0][1]);
            this.segments[i][1][0] = this.screenX(this.originalSegments[i][1][0]);
            this.segments[i][1][1] = this.screenY(this.originalSegments[i][1][1]);
        }
        // Update lower walls
        for (let i = 0; i < this.lowerWalls.length; ++i) {
            this.lowerWalls[i][0] = this.screenX(this.originalLowerWalls[i][0]);
            this.lowerWalls[i][1] = this.screenY(this.originalLowerWalls[i][1]);
            this.lowerWalls[i][2] = this.screenX(this.originalLowerWalls[i][2]);
            this.lowerWalls[i][3] = this.screenY(this.originalLowerWalls[i][3]);
        }
        // upper walls // todo
        this.upperWalls.x = -$gameMap.displayX() * $gameMap.tileWidth();
        this.upperWalls.y = -$gameMap.displayY() * $gameMap.tileHeight();
    }

    getWallHeight(x, y) {
        let tw = $gameMap.tileWidth(), eps = 0.0001; // tw * h + 6 + eps
        for (const [x2, y2, x1, y1, h] of this.globalLowerWalls) {
            if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                return (y1 - y) / 2 + eps;
            }
        }
        return 0;
    }
}

$gameShadow = new GameShadow();