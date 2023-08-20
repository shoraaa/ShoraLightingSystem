(function () {
    'use strict';

    /*:
     * @plugindesc 
     * [v2.0TS] A Lighting and Shadow plugin for RPG Maker MV/MZ, written in Typescript, powered by pixi.js library.
     * @author Shora
     * @url https://forums.rpgmakerweb.com/index.php?members/shora.158648/
     * @help
     * Forums Post: https://forums.rpgmakerweb.com/index.php?threads/mz-mv-v1-5-released-shora-lighting-plugin-dynamic-2-5d-ambient-shadow-effect.131410/
     * Starting Guide: https://github.com/dattranxxx/-ShoraLighting-/wiki/Getting-Started
     * Itch.io Page: https://shoraaa.itch.io/shora-lighting-plugin-demo
     * 
     * Go check the forum post for more info on the plugin, and wiki for an easy start!
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
     * @desc The animation movement type. 1 = linear; 2 = easeInOut; Leave empty to use remain light type.
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
     * @arg type
     * @text Transition Type
     * @type select
     * @option Not Change
     * @value 
     * @option Linear
     * @value 1
     * @option EaseInOut
     * @value 2
     * @desc The animation movement type. 1 = linear; 2 = easeInOut; Leave empty to use remain light type.
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
     * @param sep
     * @text ==================================
     * @default
     *
     * @param Game
     * @text [Game: Settings]
     * @type struct<GameSettings>
     * @desc Settings for game.
     * @default {"regionStart":"1","regionEnd":"10","topRegionId":"50","ignoreShadowsId":"51"}
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
     * @default {"name":"default","filename":"lights","status":"true","sep0":"","tint":"#ffffff","colorfilter":"{\"hue\":\"0\",\"colortone\":\"rgba(0,0,0,0)\",\"blendcolor\":\"rgba(0,0,0,0)\",\"brightness\":\"255\"}","sep1":"","offset":"{\"x\":\"0\",\"y\":\"0\"}","animation":"{\".Static\":\"=====================\",\"flicker\":\"{\\\"status\\\":\\\"true\\\",\\\"flickintensity\\\":\\\"1\\\",\\\"flickspeed\\\":\\\"1\\\"}\",\".Dynamic\":\"=====================\",\"pulse\":\"{\\\"status\\\":\\\"false\\\",\\\"pulsefactor\\\":\\\"5\\\",\\\"pulsespeed\\\":\\\"1\\\"}\",\"rotation\":\"{\\\"rotatespeed\\\":\\\"1\\\"}\"}","direction":"false","sep4":"","shadow":"true","static":"auto","bwall":"false","shadowambient":"","shadowoffsetx":"0","shadowoffsety":"0"}
     *  
     * 
     * @param LightList
     * @text [Lights: Custom]
     * @type struct<LightSettings>[]
     * @default []
     * 
     * @param sep2
     * @text ==================================
     * @default 
     * 
     * @param helper
     * @text [Helper]
     * @type struct<Helper>
     * @default {"colors":"[\"{\\\"name\\\":\\\"white\\\",\\\"color\\\":\\\"#ffffff\\\"}\",\"{\\\"name\\\":\\\"black\\\",\\\"color\\\":\\\"#000000\\\"}\",\"{\\\"name\\\":\\\"red\\\",\\\"color\\\":\\\"#ff000000\\\"}\",\"{\\\"name\\\":\\\"green\\\",\\\"color\\\":\\\"#00ff00\\\"}\",\"{\\\"name\\\":\\\"blue\\\",\\\"color\\\":\\\"#0000ff\\\"}\",\"{\\\"name\\\":\\\"orange\\\",\\\"color\\\":\\\"#ffa500\\\"}\",\"{\\\"name\\\":\\\"cyan\\\",\\\"color\\\":\\\"#00ffff\\\"}\",\"{\\\"name\\\":\\\"pink\\\",\\\"color\\\":\\\"#ffc0cb\\\"}\"]","disableEngineShadow":"true"}
     * @desc Helper parameters to improve QoL.
     * 
     * @param sep3
     * @text ==================================
     * 
     * @param filter
     * @text [Advanced: Filters]
     * @type struct<FilterSettings>
     * @desc Apply filter to the whole map for better light intensity and blending. Can be called using $shoraLayer.colorFilter
     * @default {"il":"","status":"false","brightness":"1.5","sep":"","ss":"","softShadow":"true","softShadowStr":"1","softShadowQlt":"2"}
     */

    /*~struct~GameSettings:
     * @param regionStart
     * @text [Shadow: Start Id]
     * @desc Starting index of the shadow region id.
     * @default 1
     * 
     * @param regionEnd
     * @text [Shadow: End Id]
     * @desc Ending index of the shadow region id.
     * @default 10
     * 
     * @param topRegionId
     * @text [Top-Roof: Id]
     * @desc Region id specified for top roof without any wall. Shouldn't in the range of wall's id.
     * @default 50
     * 
     * @param ignoreShadowsId
     * @text [Ignore-Shadow: Id]
     * @desc Region id specified for tile that shadow cannot be cast to, mean that it will always be light here.
     * @default 51
     * 
     * @param wallID
     * @text [Terrain Tags: Wall]
     * @desc Terrain tags specified for tile that is wall.
     * @default 1
     * 
     * @param topID
     * @text [Terrain Tags: Top Wall]
     * @desc Terrain tags specified for tile that is top wall.
     * @default 2
     * 
     */

    /*~struct~MapSettings:
     * @param ambient
     * @text [Default: Ambient]
     * @desc Color of map' shadow. Hexadecimal.
     * @default #333333
     * @param shadowAmbient
     * @text [Default: Shadow Ambient]
     * @desc This decide the color you see in the blocked part of light. Black = not see any thing. Use it to manipulate ambient shadow.
     * @default #333333
     * @param topBlockAmbient
     * @text [Default: Top Block Ambient]
     * @desc Black = top block completely block light. You can set it a little bright to make it feel more visually.
     * @default #333333
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
     * @default Currently No Effect
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
     * @param status
     * @text Status [On/Off]
     * @desc The status of the light.
     * @type boolean
     * 
     * @param radius
     * @text Radius [%]
     * @desc Radius (scale) of the light. By percentage of original image.
     * 
     * @param angle
     * @text Angle [°]
     * @desc Angle rotation of the light. By dgree. 
     * 
     * @param offset
     * @text Offset [X/Y]
     * @type struct<OffsetSettings>
     * @desc The offset coordinate.
     * 
     * @param tint
     * @text Color [Hex]
     * @desc The tint of the light (Hexadecimal). #ffffff is unchanged.  -1 to generate random color.
     * 
     * @param shadow
     * @text Shadow [On/Off]
     * @desc The status of shadow
     * @type boolean
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
     * @text Range
     * @type number
     * @desc The percentage of radius that light will pulse (Ex: 5% -> 95-105)
     * @default 5
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

    /*~struct~LightSettings:
     * @param name
     * @text Ref [Name]
     * @desc The registered name for this light. Use [light <name>] to use it. Ex: [light flashlight]; [light] is equivalent as [light default]
     * @default <-- CHANGE_THIS -->
     * 
     * @param filename
     * @text Image [.png]
     * @type file
     * @dir img/lights/
     * @desc The filename of the default light (string).
     * @default lights
     * 
     * @param status
     * @text Status [On/Off]
     * @type boolean
     * @desc Initial State of the light. 
     * @default true
     * 
     * @param radius
     * @text Radius [%]
     * @desc Radius (scale) of the light. By percentage of original image.
     * @default 100
     * 
     * @param angle
     * @text Angle [°]
     * @desc Angle rotation of the light. By dgree. 
     * @default 0
     * 
     * @param direction
     * @text [Angle = Direction]
     * @type boolean
     * @desc Sync with character direction. Will be override angle.
     * @default false
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
     * @default {".Static":"=====================","flicker":"{\"status\":\"true\",\"flickintensity\":\"1\",\"flickspeed\":\"1\"}",".Dynamic":"=====================","pulse":"{\"status\":\"false\",\"pulsefactor\":\"5\",\"pulsespeed\":\"1\"}","rotation":"{\"rotatespeed\":\"1\"}"}
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
     * @param shadowoffsetx
     * @text [Shadow: X-Offset]
     * @default 0
     * 
     * @param shadowoffsety
     * @text [Shadow: Y-Offset]
     * @default 0
     *
     */

    /*~struct~FilterSettings:
     * @param il
     * @text [Intensity Light]
     * @param status
     * @text - Status
     * @desc The status of the filters.
     * @type boolean
     * @default false
     * 
     * @param brightness
     * @text - Value
     * @desc The default brightness value. Leave blank for not apply.
     * @default 1.5
     * 
     * @param sep
     * @text ==================================
     * @param ss
     * @text [Soft Shadow]
     * @param softShadow
     * @text - Status
     * @type boolean
     * @default true
     * @param softShadowStr
     * @text - Strength
     * @defalt Strength of the soft shadow.
     * @default 1
     * @param softShadowQlt
     * @text - Quality
     * @defalt Quality of the soft shadow.
     * @default 2
    */

    /*~struct~Helper:
     * @param colors
     * @text [Colors: Defined List]
     * @desc You can defined color here, for usage like [light -tint red] instead of [light -tint #ff0000].
     * @type struct<DefinedColor>[]
     * 
     * @param disableEngineShadow
     * @text [Disable Engine Shadow?]
     * @desc Helper parameters to disable the default engine shadow. 
     * @default true
    */

    /*~struct~DefinedColor:
     * @param name
     * @default white
     * @param color
     * @default #ffffff
    */

    const pluginName = 'ShoraLightingSystem';
    const pluginVersion = '2.0';
    const engineName = Number(PIXI.VERSION[0]) < 5 ? 'MV' : 'MZ';

    console.log(pluginName + ' v' + pluginVersion);

    if (engineName === 'MV') {
        ImageManager.loadLight = function(filename) {
            return this.loadBitmap('img/lights/', filename.substring(0, filename.length), true);
        };
    } else {
        ImageManager.loadLight = function(filename) {
            const url = 'img/lights/' + Utils.encodeURI(filename + '.png');
            return Bitmap.load(url);
        };
    }

    class LightingColorFilter extends PIXI.Filter {
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
    }


    const ColorManager = {
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

    const TextureManager = {
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


    function parseNotes(config, notes) {
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

    const engineParameters$1 = PluginManager.parameters(pluginName);

    const mapConfig = JSON.parse(engineParameters$1['Map']);
    const gameConfig = JSON.parse(engineParameters$1['Game']);
    const helperConfig = JSON.parse(engineParameters$1['helper']);
    const filterConfig = JSON.parse(engineParameters$1['filter']);

    const colors = JSON.parse(helperConfig.colors);

    for (const colorJSON of colors) {
        const color = JSON.parse(colorJSON);
        ColorManager.register(color.name, color.color);
    }

    const lightConfig = {
        ambient: ColorManager.stringToHex(mapConfig.ambient),
        intensity: {
            status: true,
            strength: 1,
        },

    };

    const shadowConfig = {
        engineShadow: helperConfig.disableEngineShadow !== 'true',
        regionId: {
            start: Number(gameConfig.regionStart),
            end: Number(gameConfig.regionEnd),
            top: Number(gameConfig.topRegionId),
            ignore: Number(gameConfig.ignoreShadowsId),
        },
        terrainTags: {
            wall: Number(gameConfig.wallID),
            topWall: Number(gameConfig.topID),
        },
        ambient: ColorManager.stringToHex(mapConfig.shadowAmbient),
        topAmbient: ColorManager.stringToHex(mapConfig.topBlockAmbient),
        soft: {
            status: filterConfig.softShadow === 'true',
            strength: Number(filterConfig.softShadowStr),
            quality: Number(filterConfig.softShadowQlt),
        }

    };

    var ShadowSystem = (function() {

        const graphics = new PIXI.Graphics();

        const epsilon = () => 0.0000001;

        const equal = (a, b) => {
            if (Math.abs(a[0] - b[0]) < epsilon() && Math.abs(a[1] - b[1]) < epsilon()) return true;
            return false;
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

        const calculate = (lighting) => {
            graphics.clear();
            graphics.beginFill(0x111111).drawRect(0, 0, 50, 50).endFill();
            return graphics;
        };

        let exports = {};

        exports.calculate = calculate;
        exports.getSegments = getSegments;

        return exports;

    })();

    class Lighting extends PIXI.Sprite {
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

    class AmbientLayer extends PIXI.Graphics {
        constructor(config) {
            super();

            this.config = config;

            this.id = -1;
            this.tint = config.ambient;

            this.beginFill(0xffffff);
    	    this.drawRect(0, 0, Graphics.width, Graphics.height);
            this.endFill();

            this.blendMode = PIXI.BLEND_MODES.NORMAL;
        }

        update() {
            this.config.ambient = this.tint;
        }

    }

    const engineParameters = PluginManager.parameters(pluginName);

    const defaultLight = engineParameters['default'];
    const customLights = JSON.parse(engineParameters['LightList']);

    const baseLightingConfig = {};

    function registerLight(_config) {
        const config = JSON.parse(_config);
        let name = config.name;
        if (name == "<-- CHANGE_THIS -->") 
            return console.warn('Please set the reference of light, aka it name when adding new custom light. Register progress canceled.'); 

        config.radius = Number(config.radius || 100) / 100;
        config.angle = (Number(config.angle) || 0) / 57.6; 
        config.status = config.status !== 'false';

        config.direction = config.direction === 'true';
        config.tint = ColorManager.stringToHex(config.tint);
        config.bwall = config.bwall === 'true';
        config.shadow = config.shadow === 'true';
        
        config.shadowambient = 
            config.shadowambient == "" ?  shadowConfig.shadowambient : 
                                          ColorManager.stringToHex(config.shadowambient);

        config.offset = JSON.parse(config.offset);
        for (const p in config.offset) {
            config.offset[p] = Number(config.offset[p]);
        }

        config.shadowoffsetx = Number(config.shadowoffsetx);
        config.shadowoffsety = Number(config.shadowoffsety);
        
        config.colorfilter = JSON.parse(config.colorfilter);
        config.colorfilter.hue = Number(config.colorfilter.hue);
        config.colorfilter.brightness = Number(config.colorfilter.brightness);
        config.colorfilter.colortone = ColorManager.toRGBA(config.colorfilter.colortone);
        config.colorfilter.blendcolor = ColorManager.toRGBA(config.colorfilter.blendcolor);

        config.animation = JSON.parse(config.animation);
        for (const p in config.animation) {
            if (p[0] === '.') continue;
            config.animation[p] = JSON.parse(config.animation[p]);
            for (let a in config.animation[p]) {
                config.animation[p][a] = JSON.parse(config.animation[p][a]);
            }
        }

        config.name = name;
        baseLightingConfig[name] = config;
        TextureManager.load(config.filename);

        console.log('Shora Lighting: ' + name + ' registered');
    }

    registerLight(defaultLight);
    for (const config of customLights) {
        registerLight(config);
    }

    class LightingManager {
        constructor() {
            this.data = {
                _disabled: false,

                ambient: lightConfig.ambient,
                shadowAmbient: lightConfig.ambient,
                topBlockAmbient: lightConfig.topAmbient,

                softShadow: shadowConfig.soft.status,
                softShadowQlt: shadowConfig.soft.quality,
                softShadowStr: shadowConfig.soft.strength,
            };
            this.baseLightingConfig = baseLightingConfig;

            this.characterLighting = [];
            this.layer = new PIXI.Container();
        }

        createSprite() {
            if (this.sprite) {
                return;
            }
            this.texture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
            this.sprite = new PIXI.Sprite(this.texture);
            this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        }

        addAmbientLayer() {
            if (this.ambient) {
                return;
            }
            this.ambient = new AmbientLayer(this.data);
            this.layer.addChild(this.ambient);
        }

        /*! Post-Processing */
        loadScene(spriteset) {
            this.createSprite();
            this.addAmbientLayer();
            this.addAllCharacterLighting();
            spriteset._baseSprite.addChild(this.sprite);
        }

        removeScene(spriteset) {
            spriteset._baseSprite.removeChild(this.sprite);
            for (const lighting of this.characterLighting) {
                if (!lighting) {
                    continue;
                }
                this.removeCharacterLighting(lighting.config.id);
            }
        }

        addLight(config) {
            const character = config.id ? $gameMap._events[config.id] : $gamePlayer;
            const lighting = new Lighting(config, character);
            this.characterLighting.push(lighting);
            this.layer.addChild(lighting);
        }

        addAllCharacterLighting() {
            for (const config of $gameMap._lighting) {
                if (!config) {
                    continue;
                }
                this.addLight(config);
            }
        }

        update() {
            this.ambient.update();
            for (const lighting of this.characterLighting) {
                if (!lighting) {
                    continue;
                }
                lighting.update();
            }
            Graphics.app.renderer.render(this.layer, this.texture, false);
        }

        addCharacterLighting(config) {
            if (!this.baseLightingConfig[config.name]) {
                config.name = 'default';
            }

            const _config = {...this.baseLightingConfig[config.name], ...config};

            this.removeCharacterLighting(_config.id);
            $gameMap._lighting[config.id] = _config;
            this.addLight(_config);
        }

        removeCharacterLighting(cid) {
            if ($gameMap._lighting[cid] && this.characterLighting[cid]) {
                const lighting = this.characterLighting[cid];
                $gameMap._lighting[cid] = this.characterLighting[cid] = null;
                this.layer.removeChild(lighting);
                lighting.destroy();
            }
        }
    }

    const lightingManager = new LightingManager();

    const makeSaveContents = DataManager.makeSaveContents;
    const extractSaveContents = DataManager.extractSaveContents;

    DataManager.makeSaveContents = function() {
        const contents = makeSaveContents();
        contents.lighting = lightingManager.data;
        return contents;
    };

    DataManager.extractSaveContents = function(contents) {
        extractSaveContents(contents);
        lightingManager.data = contents.lighting;
    };

    if (!shadowConfig.engineShadow) {
        Tilemap.prototype._addShadow = function() {}; 
        if (engineName === 'MV') {
            ShaderTilemap.prototype._addShadow = function() {}; 
            ShaderTilemap.prototype._drawShadow = function() {};
        }
    }

    const initialize = Game_Character.prototype.initialize;
    Game_Character.prototype.initialize = function() {
        initialize.call(this);
        this._lightConfig = {};
        this.lighting = false;
    };

    const update$1 = Game_Character.prototype.update;

    Game_Character.prototype.update = function() {
        update$1.call(this);
        this.updateLighting();
    };

    Game_Character.prototype.updateLighting = function() {
        if (!!this._lightConfig.status && !this.lighting) {
            this.lighting = true;
            lightingManager.addCharacterLighting(this._lightConfig);
        }
        if (!this._lightConfig.status && this.lighting) {
            this.lighting = false;
            lightingManager.removeCharacterLighting(this._lightConfig);
        }
    };

    const setupPageSettings = Game_Event.prototype.setupPageSettings;

    Game_Event.prototype.setupPageSettings = function() {
        setupPageSettings.call(this);
        if (!this._erased) {
            this.setupLighting();
        }
    };

    Game_Event.prototype.setupLighting = function() {
        this._lightConfig = {};
        this.page().list.forEach((comment) => {
            if (comment.code === 108 || comment.code === 408) 
                parseNotes(this._lightConfig, comment.parameters.join(''));
        });
        this._lightConfig.id = this._eventId;
    };

    const setup = Game_Map.prototype.setup;

    Game_Map.prototype.setup = function(mapId) {
        setup.call(this, mapId);
        this._lighting = [];
    };

    if (engineName === 'MV') {
        const _createRenderer = Graphics._createRenderer;
        Graphics._createRenderer = function() {
            _createRenderer.call(this);
            this.app = { renderer: this._renderer };
        };
    }

    const destroy = Spriteset_Map.prototype.destroy;
    const createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    const update = Spriteset_Map.prototype.update;

    Spriteset_Map.prototype.destroy = function(options) {
        lightingManager.removeScene(this);
        destroy.call(this, options);
    };

    Spriteset_Map.prototype.createUpperLayer = function() {
        createUpperLayer.call(this);
        lightingManager.loadScene(this);
    };

    Spriteset_Map.prototype.update = function() {
        update.call(this);
        lightingManager.update();
    };

    class Game_Lighting {
        constructor() {
            console.log(pluginName + " API had been construted. Use the method provided by $gameLighting to get started.");
        }

        setPluginState(state) {
        }

        enable() {

        }

        disable() {
            
        }

        setStatus(id, status) {
            
        }

        setRadius(id) {

        }

        setAngle(id) {

        }

        setShadow(id) {
            
        }

        setOffset(id) {

        }

        setOffsetX(id) {

        }

        setOffsetY(id) {

        }

        setTint(id) {

        }
    }
    window.$gameLighting = new Game_Lighting();

})();
