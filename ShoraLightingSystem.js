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
            let a3 = angle(a,b) - angle(b,c);
            if (a3 < 0) a3 += 360;
            if (a3 > 360) a3 -= 360;
            return a3;
        };

        const sortPoints = (position, segments) => {
            let points = new Array(segments.length * 2);
            for (let i = 0; i < segments.length; ++i) {
                points[2*i] = [i, 0, angle(segments[i][0], position)];
                points[2*i+1] = [i, 1, angle(segments[i][1], position)];
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
          const a = (xk - xi) * (yj - yi);
          const b = (xj - xi) * (yk - yi);
          return a < b ? -1 : a > b ? 1 : 0;
        };

        const doLineSegmentsIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
          const d1 = computeDirection(x3, y3, x4, y4, x1, y1);
          const d2 = computeDirection(x3, y3, x4, y4, x2, y2);
          const d3 = computeDirection(x1, y1, x2, y2, x3, y3);
          const d4 = computeDirection(x1, y1, x2, y2, x4, y4);
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
                for (let j = 0; j < viewport.length; ++j) { // ?
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

    class ShadowManager {
        constructor() {
            this.system = ShadowSystem;

            this.transform = new PIXI.Transform();
            this.graphics = new PIXI.Graphics();
            this.renderTexture = PIXI.RenderTexture.create();
            this.sprite = new PIXI.Sprite(this.renderTexture);
            this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

            this.segments = [];
            this.lowerWalls = [];

            // this.customCasters = []; TODO

            this._upperGraphics = new PIXI.Graphics();
            this._upperTexture = PIXI.RenderTexture.create();
            this.upper = new PIXI.Sprite(this._upperTexture);

            this.haveIgnoreShadow = false;
            this._ignoreGraphics = new PIXI.Graphics();
            this._ignoreTexture = PIXI.RenderTexture.create();
            this.ignore = new PIXI.Sprite(this._ignoreTexture);

            // this._upperGraphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        }

        refresh() {
            this.clear();
            this.scanMapCaster();
    		this.createSegments();
        }

        clear() {
            const width = Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
            const height = Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);

            this.segments = [];
            this.lowerWalls = [];

            this._upperGraphics.clear();
            this._upperTexture.resize(width, height);

            this._ignoreGraphics.clear();
            this._ignoreTexture.resize(width, height);
        }


        scanMapCaster() {
            const width = $gameMap.width(),
                  height = $gameMap.height(),
                  tw = $gameMap.tileWidth(),
                  th = $gameMap.tileHeight(),
                  regionStart = shadowConfig.regionId.start,
                  regionEnd = shadowConfig.regionId.end,
                  topRegionId = shadowConfig.regionId.top,
                  ignoreShadowsId = shadowConfig.regionId.ignore,
                  wallID = shadowConfig.terrainTags.wall || 1,
                  topID = shadowConfig.terrainTags.topWall || 2;


            this.map = new Array(height)
                .fill(0)
                .map(() => new Array(width).fill(0));
            this.lower = new Array(height)
                .fill(0)
                .map(() => new Array(width).fill(0));

            let id, h;

            for (let x = 0; x < width; ++x) {
                h = 0;
                for (let y = height - 1; y >= 0; --y) {
                    id = $gameMap.terrainTag(x, y);
                    if (id == wallID) {
                        if (y !== height - 1 && $gameMap.terrainTag(x, y + 1) !== wallID) h = 0;
                        h += 1;
                    } else if (id == topID) {
                        this.map[y][x] = h + 1;
                    } else {
                        h = 0;
                    }
                }
            }

            // drawing 
            this._upperGraphics.beginFill($gameLighting.topBlockAmbient);
            this._ignoreGraphics.beginFill(0xffffff);

            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    id = $gameMap.regionId(j, i);
                    if (regionStart <= id && id <= regionEnd) {
                        if (!this.map[i][j]) {
                            this.map[i][j] = id - regionStart + 1; 
                        }
                    }
                    if (id === topRegionId) {
                        this._upperGraphics.drawRect(j * tw, i * th, tw, th);
                    }
                    if (id === ignoreShadowsId) {
                        this.haveIgnoreShadow = true;
                        this._ignoreGraphics.drawRect(j * tw, i * th, tw, th);
                    }
                }
            }

            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    h = this.map[i][j];
                    if (!h) continue;
                    this._upperGraphics.drawRect(j * tw, i * th, tw, th);
                    if (i + h - 1 < height) this.lower[i + h - 1][j] = h - 1; 
                }
            }

            this._upperGraphics.endFill();
            this._ignoreGraphics.endFill();
            Graphics.app.renderer.render(this._upperGraphics, this._upperTexture);
            Graphics.app.renderer.render(this._ignoreGraphics, this._ignoreTexture);

        }

        check(y, x1, x2) {
            if (y === 0) return 0;
            if (x1 > x2) [x1, x2] = [x2, x1];

            let tw = $gameMap.tileWidth(),
                th = $gameMap.tileHeight();
            // todo: check for custom shadow cast
            if (y % th !== 0) {
                // custom
                return 0;
            }

            // todo: check for differ continous height
            // wait how did it not bug this part
            
            // how?
            y = y / th - 1;
            return Math.min(this.lower[y][Math.floor(x1 / tw)], this.lower[y][Math.ceil(x2 / tw) - 1]);
        }


        outOfBound(x, y) {
    		return x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length;
        }
        
        addUpperSegment(x, y, h, vert, horz) {
    		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
    		horz.push([x * tw, (y + h) * th, (x + 1) * tw, (y + h) * th]);
        }
        
        addLowerSegment(x, y, h, vert, horz) {
    		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
    		horz.push([(x + 1) * tw, (y + h + 1) * th, x * tw, (y + h + 1) * th]);
            // lower walls
    		this.lowerWalls.push([(x + 1) * tw, (y + h + 1) * th, x * tw, (y + h + 1) * th, h]);
        }
        
        addRightSegment(x, y, h, vert, horz) {
    		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
    		vert.push([(x + 1) * tw, (y + h) * th, (x + 1) * tw, (y + h + 1) * th]);
        }
        
        addLeftSegment(x, y, h, vert, horz) {
    		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
    		vert.push([x * tw, (y + h) * th, x * tw, (y + h + 1) * th]);
        }
        
        addCaster(x, y, h, vert, horz) {
    		// Check left of this postion.
    		if (!this.outOfBound(x, y - 1) && this.map[y - 1][x]) {
    			// Check upper of this postion.
    			if (!this.outOfBound(x - 1, y)) {
    				if (this.map[y][x - 1] !== h + 1) {
    					this.addLeftSegment(x, y, h, vert, horz);
    				} 
    			}
    		} else {
    			// Check upper of this postion.
    			if (!this.outOfBound(x - 1, y)) {
    				this.addUpperSegment(x, y, h, vert, horz);
    				// Check left of this postion.
    				if (this.map[y][x - 1] !== h + 1) {
    					this.addLeftSegment(x, y, h, vert, horz);
    				} 
    			} 
    		} 

    		// Check right of this postion.
    		if (!this.outOfBound(x + 1, y)) {
    			if (this.map[y][x + 1] !== h + 1) {
    				this.addRightSegment(x, y, h, vert, horz);
    			}
    		}

    		// Check lower of this postion.
    		if (!this.outOfBound(x, y + 1)) {
    			if (this.map[y + 1][x] !== h + 1) {
    				this.addLowerSegment(x, y, h, vert, horz);
    			}
    		}
        }
        
        mergeHorizontalSegments(a) {
            // y = s[1] = s[3], quan ly doan [s[0], s[2]]
            for (let i = 0; i < a.length; ++i)
                if (a[i][0] > a[i][2]) [a[i][0], a[i][2]] = [a[i][2], a[i][0]];
            let cmp = function(u, v) {
                if (u[1] == v[1])
                    return u[0] < v[0] ? -1 : 1;
                return u[1] < v[1] ? -1 : 1;
            };
            a.sort(cmp);
            let res = [];
            for (let i = 0; i < a.length;) {
                let j = i + 1, cur = a[i][2];
                while (j < a.length && a[j][1] == a[i][1] && a[j][0] <= cur) 
                    cur = Math.max(cur, a[j][2]), j++;
                j--;
                res.push([a[i][0], a[i][1], cur, a[i][3]]);
                i = j + 1;
            }
            return res;
        }

        mergeVerticalSegments(a) {
            // x = s[0] = s[2], quan ly doan [s[1], s[3]]
            for (let i = 0; i < a.length; ++i)
                if (a[i][1] > a[i][3]) [a[i][1], a[i][3]] = [a[i][3], a[i][1]];
            let cmp = function(u, v) {
                if (u[0] == v[0])
                    return u[1] < v[1] ? -1 : 1;
                return u[0] < v[0] ? -1 : 1;
            };
            a.sort(cmp);
            let res = [];
            for (let i = 0; i < a.length;) {
                let j = i + 1, cur = a[i][3];
                while (j < a.length && a[j][0] == a[i][0] && a[j][1] <= cur) 
                    cur = Math.max(cur, a[j][3]), j++;
                j--;
                res.push([a[i][0], a[i][1], a[i][2], cur]);
                i = j + 1;
            }
            return res;
        }

        mergeLowerWalls(a) {
            // y = s[1] = s[3], quan ly doan [s[2], s[0]]
            let cmp = function(u, v) {
                if (u[1] == v[1])
                    return u[0] > v[0] ? -1 : 1;
                return u[1] < v[1] ? -1 : 1;
            };
            a.sort(cmp);
            let res = [];
            for (let i = 0; i < a.length;) {
                let j = i + 1, cur = a[i][2];
                while (j < a.length && a[j][1] == a[i][1] && a[j][4] == a[i][4] && a[j][0] >= cur) 
                    cur = Math.min(cur, a[j][2]), j++;
                j--;
                res.push([a[i][0], a[i][1], cur, a[i][3], a[i][4]]);
                i = j + 1;
            }
            return res;
        }
        
        createSegments() {

            let vert = [], horz = [];

    		for (var y = 0; y < this.map.length; y++) {
    			for (var x = 0; x < this.map[y].length; x++) {
    				if (this.map[y][x]) {
    					this.addCaster(x, y, this.map[y][x] - 1, vert, horz);
    				}
    			}
    		}

            this.segments = this.system.getSegments(
                                this.mergeVerticalSegments(vert).concat(
                                this.mergeHorizontalSegments(horz)
                                ));

    		// Lower walls
            this.lowerWalls = this.mergeLowerWalls(this.lowerWalls);
            this.lowerWalls.sort((a, b) => b[0] - a[0]);
        }
        
        worldToScreenX(x) {
            return Math.round($gameMap.adjustX(x));
        }

        worldToScreenY(y) {
            return Math.round($gameMap.adjustY(y));
        }

        getWallHeight(x, y) {
            let tw = $gameMap.tileWidth(), eps = 0.1; // tw * h + 6 + eps
            for (const [x2, y2, x1, y1, h] of this.lowerWalls) {
                if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                    return y1 - y + eps;
                }
            }
            return 0;
        }

        drawWall(index, polygon, oy) {
    		let [x, y] = polygon[index], last = (index == 0 ? polygon.length - 1 : index - 1);
    		let [nx, ny] = polygon[last]; 

            if (y != ny || y > oy) return;

    		let tw = $gameMap.tileWidth();

            // 2 possiblities: nx to x is 1 height, or multiple height
            let h = this.check(y, nx, x);
            if (h === 0) return;
            if (h !== -1) {
                this.graphics.lineTo(nx, ny - tw * h)
    		 		    .lineTo(x, y - tw * h);
            }
            
    	}; 

        getShadowGraphics(lighting) {
            const ox = lighting.x + lighting.config.shadowoffsetx + $gameMap.displayX() * $gameMap.tileWidth();
            let oy = lighting.y + lighting.config.shadowoffsety + $gameMap.displayY() * $gameMap.tileHeight();
            
            if (!lighting.config.bwall) {
                oy += this.getWallHeight(ox, oy);
            }

            const bounds = lighting.getBounds();
            bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + lighting.config.shadowoffsetx;
            bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + lighting.config.shadowoffsety;

            const polygon = this.system.computeViewport(
                            [ox, oy], this.segments,
                            [bounds.left, bounds.top],
                            [bounds.right, bounds.bottom]);
            const tw = $gameMap.tileWidth();

            this.graphics.clear();

            this.graphics.beginFill(shadowConfig.ambient);
    		this.graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    		this.graphics.endFill();

    		this.graphics.beginFill(0xffffff);
    		this.graphics.moveTo(polygon[0][0], polygon[0][1]);
    		for (let i = 1; i < polygon.length; ++i) {
                this.drawWall(i, polygon, oy);
                this.graphics.lineTo(polygon[i][0], polygon[i][1]);
            }
            this.graphics.lineTo(polygon[0][0], polygon[0][1]);
            this.drawWall(0, polygon, oy);
    		this.graphics.endFill(); 

    		//drawing lower-walls
            this.graphics.beginFill(shadowConfig.ambient); 
            let leftBound = bounds.left, rightBound = bounds.right, downBound = bounds.bottom;
    		for (let i = 0, l = this.lowerWalls.length; i < l; ++i) {
    			let [x2, y2, x1, y1, height] = this.lowerWalls[i];
                if (y1 >= oy && y1-tw*height <= downBound && x1 <= rightBound && x2 >= leftBound) {
                    this.graphics.moveTo(x1, y1);
                    this.graphics.lineTo(x1, y1-tw*height);
                    this.graphics.lineTo(x2, y2-tw*height);
                    this.graphics.lineTo(x2, y2);
                }
    		}
            this.graphics.endFill();   

            this.transform.pivot.set(ox, oy);
            this.transform.position.set(lighting.width / 2, lighting.height / 2);
            this.transform.updateLocalTransform();
            const transform = this.transform.localTransform;

            this.renderTexture.resize(lighting.width, lighting.height);
            Graphics.app.renderer.render(this.graphics, this.renderTexture, true, transform);
            Graphics.app.renderer.render(this.upper, this.renderTexture, false, transform);


            return this.sprite;
        }


    }

    const shadowManager = new ShadowManager();

    class Lighting extends PIXI.Sprite {
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

    function registerLight(configJSON) {
        configJSON = JSON.parse(configJSON);
        configJSON.offset = JSON.parse(configJSON.offset) || {};
        configJSON.colorfilter = JSON.parse(configJSON.colorfilter) || {};
        configJSON.animation = JSON.parse(configJSON.animation) || {};
        configJSON.animation.flicker = JSON.parse(configJSON.animation.flicker) || {};
        configJSON.animation.pulse = JSON.parse(configJSON.animation.pulse) || {};
        configJSON.animation.rotation = JSON.parse(configJSON.animation.rotation) || {};

        let name = configJSON.name;
        if (name == "<-- CHANGE_THIS -->") 
            return console.warn('Please set the reference of light, aka it name when adding new custom light. Register progress canceled.'); 

        const config = {
            name: configJSON.name,
            filename: configJSON.filename,

            status: configJSON.status !== 'false',
            radius: Number(configJSON.radius || 100) / 100,
            angle: (Number(configJSON.angle) || 0) / 57.6,
            direction: configJSON.direction === 'true',
            tint: ColorManager.stringToHex(configJSON.tint || 0),

            bwall: configJSON.bwall === 'true',
            shadow: configJSON.shadow === 'true',
            shadowambient: configJSON.shadowambient ? ColorManager.stringToHex(configJSON.shadowambient) : shadowConfig.ambient,
            shadowoffsetx: Number(configJSON.shadowoffsetx) || 0,
            shadowoffsety: Number(configJSON.shadowoffsety) || 0,

            offset: {
                x: Number(configJSON.offset.x) || 0,
                y: Number(configJSON.offset.y) || 0,
            },

            colorfilter: {
                hue: Number(configJSON.colorfilter.hue) || 0,
                brightness: Number(configJSON.colorfilter.brightness),
                colortone: ColorManager.toRGBA(configJSON.colorfilter.colortone || "rgba(0,0,0,0)"),
                blendcolor: ColorManager.toRGBA(configJSON.colorfilter.blendcolor || "rgba(0,0,0,0)"),
            },

            animation: {
                flicker: {
                    status: configJSON.animation.flicker.status === 'true',
                    intensity: Number(configJSON.animation.flicker.flickintensity) || 0,
                    speed: Number(configJSON.animation.flicker.flickspeed) || 0,
                },
                pulse: {
                    status: configJSON.animation.pulse.status === 'true',
                    factor: Number(configJSON.animation.pulse.pulsefactor) || 0,
                    speed: Number(configJSON.animation.pulse.pulsespeed) || 0,
                },
                rotation: {
                    speed: Number(configJSON.animation.rotation.rotatespeed) || 0,
                },
            },
        };

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

            this.blurFilter = [new KawaseBlurFilter(this.data.softShadowStr, this.data.softShadowQlt)];
            this.layer = new PIXI.Container();
            this.layer.filters = this.data.softShadow ? this.blurFilter : null;
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

    const gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        gainItem.call(this, item, amount, includeEquip);
        $gamePlayer.scanLighting();
    };

    const refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        refresh.call(this);
        this.scanLighting();
    };

    Game_Player.prototype.scanLighting = function() {
        let note = '';
        let lightConfig = {id: 0};

        if ($gameParty.leader())
            note = $gameParty.leader().actor().note.split('\n');

        for (const line of note)
            parseNotes(lightConfig, line);

        if (lightConfig.name) {
            this.setLighting(lightConfig);
            return;
        } 

        lightConfig = {id: 0};
        for (const item of $gameParty.items()) {
            note = item.note.split('\n');
            for (const line of note) {
                parseNotes(lightConfig, line);
            }
            if (lightConfig.name) {
                this.setLighting(lightConfig);
                return;
            }
        }
    };

    Game_Player.prototype.setLighting = function(config) {
        if (this.lighting) {
            lightingManager.removeCharacterLighting(this._lightConfig);
            this.lighting = false;
        }
        this._lightConfig = config;
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
        shadowManager.refresh();
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
