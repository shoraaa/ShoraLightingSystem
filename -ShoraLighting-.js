/*:
 * @plugindesc 
 * [v2.0] Provide dynamic lighting to RPG Maker MV/MZ engine, intended to be easiest to start and most flexible when advanced! 
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
 * @default {"status":"false","sep0":"","brightness":"1.5"}
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


/* Core helper functions and plugin commands interface for MV/MZ. */

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 2.0;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.isMV = PIXI.VERSION[0] < 5;

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

Shora.CallCommand = function(settings, command) {
    if (!command || command.length <= 2 || command[0] !== '[' || command[command.length - 1] !== ']') return;
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
                settings.angle = Number(value) / 57.6;
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
            case '-behindwall':
            case '-bw':
                settings.bwall = value === 'on';
                break;
        }
    }
    
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

// remove engine shadow
if (JSON.parse(Shora.Lighting.PARAMETERS.helper).disableEngineShadow === 'true') {
    Tilemap.prototype._addShadow = function() {}; 
    if (Shora.isMV) {
        ShaderTilemap.prototype._addShadow = function() {}; 
        ShaderTilemap.prototype._drawShadow = function() {};
    }
}

const TextureManager = {
    /**
     * Return a filtered texture.
     * @param {PIXI.BaseTexture} baseTexture 
     * @param {Object} colorFilter 
     */
    filter: function(options) {
        if ($shoraLayer.textureCache[options.name])
            return new PIXI.Sprite($shoraLayer.textureCache[options.name]);
        let baseTexture = $shoraLayer.load(options.filename);
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
		sprite.destroy({texture: true});
        $shoraLayer.textureCache[options.name] = renderedTexture;
		return new PIXI.Sprite(renderedTexture);
    }
};



if (Shora.isMV) {

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
            } else if (command === 'offset' || command === 'offsetx' || command === 'offsety' || 
                        command === 'tint' || command === 'radius' || command === 'angle' || 
                        command === 'status' || command === 'shadow') {
                let id = args[0] == '=' ? this._eventId : Number(args[0]);
                if (command === 'offset') {
                    $gameLighting.setOffset(id, args[1], args[2], args[3], args[4]);
                } else if (command === 'offsetx') {
                    $gameLighting.setOffsetX(id, args[1], args[2], args[3]);
                } else if (command === 'offsety') {
                    $gameLighting.setOffsetY(id, args[1], args[2], args[3]);
                } else if (command === 'tint') {
                    $gameLighting.setTint(id, args[1], args[2], args[3]);
                } else if (command === 'radius') {
                    $gameLighting.setRadius(id, args[1], args[2], args[3]);
                } else if (command === 'angle') {
                    $gameLighting.setAngle(id, args[1], args[2], args[3]);
                } else if (command === 'status') {
                    $gameLighting.setStatus(id, args[1]);
                } else if (command === 'shadow')
                    $gameLighting.setShadow(id, args[1]);
            }
        }
    }
}



if (!Shora.isMV) {

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
        $gameLighting.setMapAmbient(args.color, Number(args.time) || 0, Number(args.type) || 0);
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
                $gameLighting.setOffsetX(id, params.offset.x, time, type);
                $gameLighting.setOffsetY(id, params.offset.y, time, type);
            }
            $gameLighting.setStatus(id, params.status);
            $gameLighting.setShadow(id, params.shadow);
            $gameLighting.setRadius(id, params.radius, time, type);
            $gameLighting.setAngle(id, params.angle, time, type);
            $gameLighting.setTint(id, params.tint, time, type);
        }
    });
    
    LightingShaderGenerator = new PIXI.BatchShaderGenerator(`
        precision highp float;
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec4 aColor;
        attribute float aTextureId;
        
        uniform mat3 projectionMatrix;
        uniform mat3 translationMatrix;
        uniform vec4 tint;
        
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        
        void main(void){
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        
            vTextureCoord = aTextureCoord;
            vTextureId = aTextureId;
            vColor = aColor * tint;
        }
    `, `
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        uniform sampler2D uSamplers[%count%];
    
        void main(void){
            vec4 color;
            %forloop%
            gl_FragColor = color * vColor;
        }
    `);
    
    LightingShaderGenerator.generateSampleSrc = function(maxTextures)
    {
        var src = '';
    
        src += '\n';
        src += '\n';
    
        maxTextures /= 2;
    
        for (var i = 0; i < maxTextures; i++)
        {
            if (i > 0)
            {
                src += '\nelse ';
            }
    
            if (i < maxTextures - 1)
            {
                src += "if(vTextureId < " + i + ".5)";
            }
    
            src += '\n{';
            src += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);";
            src += "\n\tcolor = color * texture2D(uSamplers[" + (maxTextures * 2 - i - 1) + "], vTextureCoord);";
            src += '\n}';
        }
    
        src += '\n';
        src += '\n';
    
        return src;
    };
}


// Contains initialize stuff & MV/MZ overload (plugin command iterface)

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 1.81;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempGraphics = new PIXI.Graphics();

Shora.tempMatrix = new PIXI.Matrix();
Shora.curRenderTexture = PIXI.RenderTexture.create();
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
                settings.angle = Number(value) / 57.6;
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
};

Shora.IsMV = PIXI.VERSION[0] < 5;
if (Shora.isMV) {

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
        } else if (command === 'offset' || command === 'offsetx' || command === 'offsety' || 
                    command === 'tint' || command === 'radius' || command === 'angle' || 
                    command === 'status' || command === 'shadow') {
            let id = args[0] == '=' ? this._eventId : Number(args[0]);
            if (command === 'offset') {
                $gameLighting.setOffset(id, args[1], args[2], args[3], args[4]);
            } else if (command === 'offsetx') {
                $gameLighting.setOffsetX(id, args[1], args[2], args[3]);
            } else if (command === 'offsety') {
                $gameLighting.setOffsetY(id, args[1], args[2], args[3]);
            } else if (command === 'tint') {
                $gameLighting.setTint(id, args[1], args[2], args[3]);
            } else if (command === 'radius') {
                $gameLighting.setRadius(id, args[1], args[2], args[3]);
            } else if (command === 'angle') {
                $gameLighting.setAngle(id, args[1], args[2], args[3]);
            } else if (command === 'status') {
                $gameLighting.setStatus(id, args[1]);
            } else if (command === 'shadow')
                $gameLighting.setShadow(id, args[1]);
        }
    }
}



}if (!Shora.IsMV) {

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
            $gameLighting.setOffsetX(id, params.offset.x, time, type);
            $gameLighting.setOffsetY(id, params.offset.y, time, type);
        }
        $gameLighting.setStatus(id, params.status);
        $gameLighting.setShadow(id, params.shadow);
        $gameLighting.setRadius(id, params.radius, time, type);
        $gameLighting.setAngle(id, params.angle, time, type);
        $gameLighting.setTint(id, params.tint, time, type);
    }
});

LightingShaderGenerator = new PIXI.BatchShaderGenerator(`
    precision highp float;
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec4 aColor;
    attribute float aTextureId;
    
    uniform mat3 projectionMatrix;
    uniform mat3 translationMatrix;
    uniform vec4 tint;
    
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    varying float vTextureId;
    
    void main(void){
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    
        vTextureCoord = aTextureCoord;
        vTextureId = aTextureId;
        vColor = aColor * tint;
    }
`, `
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    varying float vTextureId;
    uniform sampler2D uSamplers[%count%];

    void main(void){
        vec4 color;
        %forloop%
        gl_FragColor = color * vColor;
    }
`);

LightingShaderGenerator.generateSampleSrc = function(maxTextures)
{
    var src = '';

    src += '\n';
    src += '\n';

    maxTextures /= 2;

    for (var i = 0; i < maxTextures; i++)
    {
        if (i > 0)
        {
            src += '\nelse ';
        }

        if (i < maxTextures - 1)
        {
            src += "if(vTextureId < " + i + ".5)";
        }

        src += '\n{';
        src += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);";
        src += "\n\tcolor = color * texture2D(uSamplers[" + (maxTextures * 2 - i - 1) + "], vTextureCoord);";
        src += '\n}';
    }

    src += '\n';
    src += '\n';

    return src;
};

// ((_) => {
//     const contextChange = _.contextChange;
//     _.contextChange = function() {
//         contextChange.call(this);
//         this._lightingShader = LightingShaderGenerator.generateShader(this.MAX_TEXTURES);
//         // this._lightingShader = this._shader;
//         console.log(this._lightingShader.program.fragmentSrc);
//     };

//     _.render = function(element)
//     {
//         if (!element._texture.valid)
//         {
//             return;
//         }

//         if (this._vertexCount + (element.vertexData.length / 2) > this.size)
//         {
//             this.flush();
//         }

//         this._vertexCount += element.vertexData.length / 2;
//         this._indexCount += element.indices.length;
//         this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
//         this._bufferedElements[this._bufferSize++] = element;
//     };

//     _.bindAndClearLightingTexArray = function(texArray) {
//         var textureSystem = this.renderer.texture;
//         var _j;
//         for (var j = 0; j < texArray.count; j++)
//         {
//             textureSystem.bind(texArray.elements[j], texArray.ids[j]);
//             textureSystem.bind(texArray.elements[j].shadow, this.MAX_TEXTURES - texArray.ids[j] - 1);
//             texArray.elements[j] = null;
//         }
//         texArray.shadowTex = null;
//         texArray.count = 0;
//     };
//     _.buildLightingDrawCalls = function(texArray, start, finish)
//     {
//         var ref = this;
//         var elements = ref._bufferedElements;
//         var _attributeBuffer = ref._attributeBuffer;
//         var _indexBuffer = ref._indexBuffer;
//         var vertexSize = ref.vertexSize;
//         var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

//         var dcIndex = this._dcIndex;
//         var aIndex = this._aIndex;
//         var iIndex = this._iIndex;

//         var drawCall = drawCalls[dcIndex];

//         drawCall.start = this._iIndex;
//         drawCall.texArray = texArray;

//         for (var i = start; i < finish; ++i)
//         {
//             var sprite = elements[i];
//             var tex = sprite._texture.baseTexture;
//             var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
//                 tex.alphaMode ? 1 : 0][sprite.blendMode];
//             elements[i] = null;
//             this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
//             aIndex += sprite.vertexData.length / 2 * vertexSize;
//             iIndex += sprite.indices.length;
//             drawCall.blend = spriteBlendMode;
//         }
//         drawCall.size = iIndex - drawCall.start;
//         ++dcIndex;
//         this._dcIndex = dcIndex;
//         this._aIndex = aIndex;
//         this._iIndex = iIndex;
//     };
//     _.buildLightingTexturesAndDrawCalls = function() {
//         var ref = this;
//         var textures = ref._bufferedTextures;
//         var elements = ref._bufferedElements;
//         var MAX_TEXTURES = ref.MAX_TEXTURES / 2;
//         var textureArrays = PIXI.AbstractBatchRenderer._textureArrayPool;
//         var batch = this.renderer.batch;
//         var boundTextures = this._tempBoundTextures;
//         var touch = this.renderer.textureGC.count;

//         var TICK = ++PIXI.BaseTexture._globalBatch;
//         var countTexArrays = 0;
//         var texArray = textureArrays[0];
//         var start = 0;

//         batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

//         for (var i = 0; i < this._bufferSize; ++i)
//         {
//             var tex = textures[i];

//             textures[i] = null;
//             if (tex._batchEnabled === TICK)
//             {
//                 continue;
//             }

//             if (texArray.count >= MAX_TEXTURES)
//             {
//                 batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//                 this.buildLightingDrawCalls(texArray, start, i);
//                 start = i;
//                 texArray = textureArrays[++countTexArrays];
//                 ++TICK;
//             }

//             tex._batchEnabled = TICK;
//             tex.touched = touch;
//             texArray.elements[texArray.count] = tex;
//             texArray.count++;
//         }

//         if (texArray.count > 0)
//         {
//             batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//             this.buildLightingDrawCalls(texArray, start, this._bufferSize);
//             ++countTexArrays;
//             ++TICK;
//         }

//         // Clean-up

//         for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
//         {
//             boundTextures[i$1] = null;
//         }
//         PIXI.BaseTexture._globalBatch = TICK;
//     };
//     _.drawLightingBatches = function () {
//         var dcCount = this._dcIndex;
//         var ref = this.renderer;
//         var gl = ref.gl;
//         var stateSystem = ref.state;
//         var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

//         var curTexArray = null;

//         // Upload textures and do the draw calls
//         for (var i = 0; i < dcCount; i++)
//         {
//             var ref$1 = drawCalls[i];
//             var texArray = ref$1.texArray;
//             var type = ref$1.type;
//             var size = ref$1.size;
//             var start = ref$1.start;
//             var blend = ref$1.blend;

//             if (curTexArray !== texArray)
//             {
//                 curTexArray = texArray;
//                 this.bindAndClearLightingTexArray(texArray);
//             }

//             this.state.blendMode = blend;
//             stateSystem.set(this.state);
//             gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
//         }
//     };
//     _.flush = function() {
//         if (this._vertexCount === 0)
//         {
//             return;
//         }

//         this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
//         this._indexBuffer = this.getIndexBuffer(this._indexCount);
//         this._aIndex = 0;
//         this._iIndex = 0;
//         this._dcIndex = 0;

//         if (this.renderer.renderingLighting) {
//             this.buildLightingTexturesAndDrawCalls();
//             this.updateGeometry();
//             this.drawLightingBatches();
//         } else {
//             this.buildTexturesAndDrawCalls();
//             this.updateGeometry();
//             this.drawBatches();
//         }

//         // reset elements buffer for the next flush
//         this._bufferSize = 0;
//         this._vertexCount = 0;
//         this._indexCount = 0;
//     };
// })(PIXI.AbstractBatchRenderer.prototype); 

// function LightingRenderer(renderer) {
//     PIXI.ObjectRenderer.call(this, renderer);
//     this.shaderGenerator = LightingShaderGenerator;
//     this.geometryClass = PIXI.BatchGeometry;
//     this.vertexSize = 6;
//     this.state = PIXI.State.for2d();
//     this.size = PIXI.settings.SPRITE_BATCH_SIZE * 4;
//     this._vertexCount = 0;
//     this._indexCount = 0;
//     this._bufferedElements = [];
//     this._bufferedTextures = [];
//     this._bufferSize = 0;
//     this._shader = null;
//     this._packedGeometries = [];
//     this._packedGeometryPoolSize = 2;
//     this._flushId = 0;
//     this._aBuffers = {};
//     this._iBuffers = {};
//     this.MAX_TEXTURES = 1;

//     this.renderer.on('prerender', this.onPrerender, this);
//     renderer.runners.contextChange.add(this);

//     this._dcIndex = 0;
//     this._aIndex = 0;
//     this._iIndex = 0;
//     this._attributeBuffer = null;
//     this._indexBuffer = null;
//     this._tempBoundTextures = [];
// }

// if ( PIXI.ObjectRenderer ) { LightingRenderer.__proto__ = PIXI.ObjectRenderer; }
// LightingRenderer.prototype = Object.create( PIXI.ObjectRenderer && PIXI.ObjectRenderer.prototype );
// LightingRenderer.prototype.constructor = LightingRenderer;

// LightingRenderer._drawCallPool = [];
// LightingRenderer._textureArrayPool = [];

// /**
//  * Handles the `contextChange` signal.
//  *
//  * It calculates `this.MAX_TEXTURES` and allocating the
//  * packed-geometry object pool.
//  */
// LightingRenderer.prototype.contextChange = function contextChange ()
// {
//     var gl = this.renderer.gl;

//     // step 1: first check max textures the GPU can handle.
//     this.MAX_TEXTURES = Math.min(
//         gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
//         PIXI.settings.SPRITE_MAX_TEXTURES);
    
//     this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);

//     // we use the second shader as the first one depending on your browser
//     // may omit aTextureId as it is not used by the shader so is optimized out.
//     for (var i = 0; i < this._packedGeometryPoolSize; i++)
//     {
//         /* eslint-disable max-len */
//         this._packedGeometries[i] = new (this.geometryClass)();
//     }

//     this.initFlushBuffers();
// };

// /**
//  * Makes sure that static and dynamic flush pooled objects have correct dimensions
//  */
// LightingRenderer.prototype.initFlushBuffers = function initFlushBuffers ()
// {
//     var _drawCallPool = LightingRenderer._drawCallPool;
//     var _textureArrayPool = LightingRenderer._textureArrayPool;
//     // max draw calls
//     var MAX_SPRITES = this.size / 4;
//     // max texture arrays
//     var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;

//     while (_drawCallPool.length < MAX_SPRITES)
//     {
//         _drawCallPool.push(new PIXI.BatchDrawCall());
//     }
//     while (_textureArrayPool.length < MAX_TA)
//     {
//         _textureArrayPool.push(new PIXI.BatchTextureArray());
//     }
//     for (var i = 0; i < this.MAX_TEXTURES; i++)
//     {
//         this._tempBoundTextures[i] = null;
//     }
// };

// /**
//  * Handles the `prerender` signal.
//  *
//  * It ensures that flushes start from the first geometry
//  * object again.
//  */
// LightingRenderer.prototype.onPrerender = function onPrerender ()
// {
//     this._flushId = 0;
// };

// /**
//  * Buffers the "batchable" object. It need not be rendered
//  * immediately.
//  *
//  * @param {PIXI.DisplayObject} element - the element to render when
//  *    using this renderer
//  */
// LightingRenderer.prototype.render = function render (element)
// {
//     if (!element._texture.valid)
//     {
//         return;
//     }

//     if (this._vertexCount + (element.vertexData.length / 2) > this.size)
//     {
//         this.flush();
//     }

//     this._vertexCount += element.vertexData.length / 2;
//     this._indexCount += element.indices.length;
//     this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
//     this._bufferedElements[this._bufferSize++] = element;
// };

// LightingRenderer.prototype.buildTexturesAndDrawCalls = function buildTexturesAndDrawCalls ()
// {
//     var ref = this;
//     var textures = ref._bufferedTextures;
//     var MAX_TEXTURES = ref.MAX_TEXTURES;
//     var textureArrays = LightingRenderer._textureArrayPool;
//     var batch = this.renderer.batch;
//     var boundTextures = this._tempBoundTextures;
//     var touch = this.renderer.textureGC.count;

//     var TICK = ++PIXI.BaseTexture._globalBatch;
//     var countTexArrays = 0;
//     var texArray = textureArrays[0];
//     var start = 0;

//     batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

//     for (var i = 0; i < this._bufferSize; ++i)
//     {
//         var tex = textures[i];

//         textures[i] = null;
//         if (tex._batchEnabled === TICK)
//         {
//             continue;
//         }

//         if (texArray.count >= MAX_TEXTURES)
//         {
//             batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//             this.buildDrawCalls(texArray, start, i);
//             start = i;
//             texArray = textureArrays[++countTexArrays];
//             ++TICK;
//         }

//         tex._batchEnabled = TICK;
//         tex.touched = touch;
//         texArray.elements[texArray.count++] = tex;
//     }

//     if (texArray.count > 0)
//     {
//         batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//         this.buildDrawCalls(texArray, start, this._bufferSize);
//         ++countTexArrays;
//         ++TICK;
//     }

//     // Clean-up

//     for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
//     {
//         boundTextures[i$1] = null;
//     }
//     PIXI.BaseTexture._globalBatch = TICK;
// };

// /**
//  * Populating drawcalls for rendering
//  *
//  * @param {PIXI.BatchTextureArray} texArray
//  * @param {number} start
//  * @param {number} finish
//  */
// LightingRenderer.prototype.buildDrawCalls = function buildDrawCalls (texArray, start, finish)
// {
//     var ref = this;
//     var elements = ref._bufferedElements;
//     var _attributeBuffer = ref._attributeBuffer;
//     var _indexBuffer = ref._indexBuffer;
//     var vertexSize = ref.vertexSize;
//     var drawCalls = LightingRenderer._drawCallPool;

//     var dcIndex = this._dcIndex;
//     var aIndex = this._aIndex;
//     var iIndex = this._iIndex;

//     var drawCall = drawCalls[dcIndex];

//     drawCall.start = this._iIndex;
//     drawCall.texArray = texArray;

//     for (var i = start; i < finish; ++i)
//     {
//         var sprite = elements[i];
//         var tex = sprite._texture.baseTexture;
//         var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
//             tex.alphaMode ? 1 : 0][sprite.blendMode];

//         elements[i] = null;

//         if (start < i && drawCall.blend !== spriteBlendMode)
//         {
//             drawCall.size = iIndex - drawCall.start;
//             start = i;
//             drawCall = drawCalls[++dcIndex];
//             drawCall.texArray = texArray;
//             drawCall.start = iIndex;
//         }

//         this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
//         aIndex += sprite.vertexData.length / 2 * vertexSize;
//         iIndex += sprite.indices.length;

//         drawCall.blend = spriteBlendMode;
//     }

//     if (start < finish)
//     {
//         drawCall.size = iIndex - drawCall.start;
//         ++dcIndex;
//     }

//     this._dcIndex = dcIndex;
//     this._aIndex = aIndex;
//     this._iIndex = iIndex;
// };

// /**
//  * Bind textures for current rendering
//  *
//  * @param {PIXI.BatchTextureArray} texArray
//  */
//  LightingRenderer.prototype.bindAndClearTexArray = function bindAndClearTexArray (texArray)
// {
//     var textureSystem = this.renderer.texture;

//     for (var j = 0; j < texArray.count; j++)
//     {
//         textureSystem.bind(texArray.elements[j], texArray.ids[j]);
//         texArray.elements[j] = null;
//     }
//     texArray.count = 0;
// };

// LightingRenderer.prototype.updateGeometry = function updateGeometry ()
// {
//     var ref = this;
//     var packedGeometries = ref._packedGeometries;
//     var attributeBuffer = ref._attributeBuffer;
//     var indexBuffer = ref._indexBuffer;

//     if (!PIXI.settings.CAN_UPLOAD_SAME_BUFFER)
//     { /* Usually on iOS devices, where the browser doesn't
//         like uploads to the same buffer in a single frame. */
//         if (this._packedGeometryPoolSize <= this._flushId)
//         {
//             this._packedGeometryPoolSize++;
//             packedGeometries[this._flushId] = new (this.geometryClass)();
//         }

//         packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
//         packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

//         this.renderer.geometry.bind(packedGeometries[this._flushId]);
//         this.renderer.geometry.updateBuffers();
//         this._flushId++;
//     }
//     else
//     {
//         // lets use the faster option, always use buffer number 0
//         packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
//         packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

//         this.renderer.geometry.updateBuffers();
//     }
// };

// LightingRenderer.prototype.drawBatches = function drawBatches ()
// {
//     var dcCount = this._dcIndex;
//     var ref = this.renderer;
//     var gl = ref.gl;
//     var stateSystem = ref.state;
//     var drawCalls = LightingRenderer._drawCallPool;

//     var curTexArray = null;

//     // Upload textures and do the draw calls
//     for (var i = 0; i < dcCount; i++)
//     {
//         var ref$1 = drawCalls[i];
//         var texArray = ref$1.texArray;
//         var type = ref$1.type;
//         var size = ref$1.size;
//         var start = ref$1.start;
//         var blend = ref$1.blend;

//         if (curTexArray !== texArray)
//         {
//             curTexArray = texArray;
//             this.bindAndClearTexArray(texArray);
//         }

//         this.state.blendMode = blend;
//         stateSystem.set(this.state);
//         gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
//     }
// };

// /**
//  * Renders the content _now_ and empties the current batch.
//  */
// LightingRenderer.prototype.flush = function flush ()
// {
//     if (this._vertexCount === 0)
//     {
//         return;
//     }

//     this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
//     this._indexBuffer = this.getIndexBuffer(this._indexCount);
//     this._aIndex = 0;
//     this._iIndex = 0;
//     this._dcIndex = 0;

//     this.buildTexturesAndDrawCalls();
//     this.updateGeometry();
//     this.drawBatches();

//     // reset elements buffer for the next flush
//     this._bufferSize = 0;
//     this._vertexCount = 0;
//     this._indexCount = 0;
// };

// /**
//  * Starts a new sprite batch.
//  */
// LightingRenderer.prototype.start = function start ()
// {
//     this.renderer.state.set(this.state);

//     this.renderer.shader.bind(this._shader);

//     if (PIXI.settings.CAN_UPLOAD_SAME_BUFFER)
//     {
//         // bind buffer #0, we don't need others
//         this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
//     }
// };

// /**
//  * Stops and flushes the current batch.
//  */
// LightingRenderer.prototype.stop = function stop ()
// {
//     this.flush();
// };

// LightingRenderer.prototype.destroy = function destroy ()
// {
//     for (var i = 0; i < this._packedGeometryPoolSize; i++)
//     {
//         if (this._packedGeometries[i])
//         {
//             this._packedGeometries[i].destroy();
//         }
//     }

//     this.renderer.off('prerender', this.onPrerender, this);

//     this._aBuffers = null;
//     this._iBuffers = null;
//     this._packedGeometries = null;
//     this._attributeBuffer = null;
//     this._indexBuffer = null;

//     if (this._shader)
//     {
//         this._shader.destroy();
//         this._shader = null;
//     }

//     ObjectRenderer.prototype.destroy.call(this);
// };

// /**
//  * Fetches an attribute buffer from `this._aBuffers` that
//  * can hold atleast `size` floats.
//  *
//  * @param {number} size - minimum capacity required
//  * @return {ViewableBuffer} - buffer than can hold atleast `size` floats
//  * @private
//  */
// LightingRenderer.prototype.getAttributeBuffer = function getAttributeBuffer (size)
// {
//     // 8 vertices is enough for 2 quads
//     var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 8));
//     var roundedSizeIndex = PIXI.utils.log2(roundedP2);
//     var roundedSize = roundedP2 * 8;

//     if (this._aBuffers.length <= roundedSizeIndex)
//     {
//         this._iBuffers.length = roundedSizeIndex + 1;
//     }

//     var buffer = this._aBuffers[roundedSize];

//     if (!buffer)
//     {
//         this._aBuffers[roundedSize] = buffer = new PIXI.ViewableBuffer(roundedSize * this.vertexSize * 4);
//     }

//     return buffer;
// };

// /**
//  * Fetches an index buffer from `this._iBuffers` that can
//  * has atleast `size` capacity.
//  *
//  * @param {number} size - minimum required capacity
//  * @return {Uint16Array} - buffer that can fit `size`
//  *    indices.
//  * @private
//  */
// LightingRenderer.prototype.getIndexBuffer = function getIndexBuffer (size)
// {
//     // 12 indices is enough for 2 quads
//     var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 12));
//     var roundedSizeIndex = PIXI.utils.log2(roundedP2);
//     var roundedSize = roundedP2 * 12;

//     if (this._iBuffers.length <= roundedSizeIndex)
//     {
//         this._iBuffers.length = roundedSizeIndex + 1;
//     }

//     var buffer = this._iBuffers[roundedSizeIndex];

//     if (!buffer)
//     {
//         this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
//     }

//     return buffer;
// };

// /**
//  * Takes the four batching parameters of `element`, interleaves
//  * and pushes them into the batching attribute/index buffers given.
//  *
//  * It uses these properties: `vertexData` `uvs`, `textureId` and
//  * `indicies`. It also uses the "tint" of the base-texture, if
//  * present.
//  *
//  * @param {PIXI.Sprite} element - element being rendered
//  * @param {PIXI.ViewableBuffer} attributeBuffer - attribute buffer.
//  * @param {Uint16Array} indexBuffer - index buffer
//  * @param {number} aIndex - number of floats already in the attribute buffer
//  * @param {number} iIndex - number of indices already in `indexBuffer`
//  */
// LightingRenderer.prototype.packInterleavedGeometry = function packInterleavedGeometry (element, attributeBuffer, indexBuffer, aIndex, iIndex)
// {
//     var uint32View = attributeBuffer.uint32View;
//     var float32View = attributeBuffer.float32View;

//     var packedVertices = aIndex / this.vertexSize;
//     var uvs = element.uvs;
//     var indicies = element.indices;
//     var vertexData = element.vertexData;
//     var textureId = element._texture.baseTexture._batchLocation;

//     var alpha = Math.min(element.worldAlpha, 1.0);
//     var argb = (alpha < 1.0
//         && element._texture.baseTexture.alphaMode)
//         ? PIXI.utils.premultiplyTint(element._tintRGB, alpha)
//         : element._tintRGB + (alpha * 255 << 24);

//     // lets not worry about tint! for now..
//     for (var i = 0; i < vertexData.length; i += 2)
//     {
//         float32View[aIndex++] = vertexData[i];
//         float32View[aIndex++] = vertexData[i + 1];
//         float32View[aIndex++] = uvs[i];
//         float32View[aIndex++] = uvs[i + 1];
//         uint32View[aIndex++] = argb;
//         float32View[aIndex++] = textureId;
//     }

//     for (var i$1 = 0; i$1 < indicies.length; i$1++)
//     {
//         indexBuffer[iIndex++] = packedVertices + indicies[i$1];
//     }
// };

class LightingRenderer extends PIXI.AbstractBatchRenderer {
    constructor(renderer) {
        super(renderer);
        this.vertexSize = 6;
        this.geometryClass = PIXI.BatchGeometry;
        this.shaderGenerator = LightingShaderGenerator;
    }

    initFlushBuffers() {
        // shared the same pool with abstract renderer
        return;
    }
    contextChange() {
        super.contextChange();
        console.log(this._shader.program.fragmentSrc);
    };  
    render(element) {
        if (!element._texture.valid)
            return;

        if (this._vertexCount + (element.vertexData.length / 2) > this.size)
            this.flush();

        this._vertexCount += element.vertexData.length / 2;
        this._indexCount += element.indices.length;
        this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
        this._bufferedElements[this._bufferSize++] = element;
    };

    bindAndClearTexArray(texArray) {
        var textureSystem = this.renderer.texture;
        for (var j = 0; j < texArray.count; j++)
        {
            textureSystem.bind(texArray.elements[j], texArray.ids[j]);
            textureSystem.bind(texArray.elements[j].shadow, this.MAX_TEXTURES - texArray.ids[j] - 1);
            texArray.elements[j] = null;
        }
        texArray.count = 0;
    };
    buildDrawCalls(texArray, start, finish)
    {
        var ref = this;
        var elements = ref._bufferedElements;
        var _attributeBuffer = ref._attributeBuffer;
        var _indexBuffer = ref._indexBuffer;
        var vertexSize = ref.vertexSize;
        var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

        var dcIndex = this._dcIndex;
        var aIndex = this._aIndex;
        var iIndex = this._iIndex;

        var drawCall = drawCalls[dcIndex];

        drawCall.start = this._iIndex;
        drawCall.texArray = texArray;

        for (var i = start; i < finish; ++i)
        {
            var sprite = elements[i];
            var tex = sprite._texture.baseTexture;
            var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
                tex.alphaMode ? 1 : 0][sprite.blendMode];
            elements[i] = null;
            this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
            aIndex += sprite.vertexData.length / 2 * vertexSize;
            iIndex += sprite.indices.length;
            drawCall.blend = spriteBlendMode;
        }
        drawCall.size = iIndex - drawCall.start;
        ++dcIndex;
        this._dcIndex = dcIndex;
        this._aIndex = aIndex;
        this._iIndex = iIndex;
    };
    buildTexturesAndDrawCalls() {
        var ref = this;
        var textures = ref._bufferedTextures;
        var elements = ref._bufferedElements;
        var MAX_TEXTURES = ref.MAX_TEXTURES / 2;
        var textureArrays = PIXI.AbstractBatchRenderer._textureArrayPool;
        var batch = this.renderer.batch;
        var boundTextures = this._tempBoundTextures;
        var touch = this.renderer.textureGC.count;

        var TICK = ++PIXI.BaseTexture._globalBatch;
        var countTexArrays = 0;
        var texArray = textureArrays[0];
        var start = 0;

        batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

        for (var i = 0; i < this._bufferSize; ++i)
        {
            var tex = textures[i];

            textures[i] = null;
            if (tex._batchEnabled === TICK)
            {
                continue;
            }

            if (texArray.count >= MAX_TEXTURES)
            {
                batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                this.buildDrawCalls(texArray, start, i);
                start = i;
                texArray = textureArrays[++countTexArrays];
                ++TICK;
            }

            tex._batchEnabled = TICK;
            tex.touched = touch;
            texArray.elements[texArray.count] = tex;
            texArray.count++;
        }

        if (texArray.count > 0)
        {
            batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
            this.buildDrawCalls(texArray, start, this._bufferSize);
            ++countTexArrays;
            ++TICK;
        }

        // Clean-up

        for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
        {
            boundTextures[i$1] = null;
        }
        PIXI.BaseTexture._globalBatch = TICK;
    };
    drawBatches() {
        var dcCount = this._dcIndex;
        var ref = this.renderer;
        var gl = ref.gl;
        var stateSystem = ref.state;
        var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

        var curTexArray = null;

        // Upload textures and do the draw calls
        for (var i = 0; i < dcCount; i++)
        {
            var ref$1 = drawCalls[i];
            var texArray = ref$1.texArray;
            var type = ref$1.type;
            var size = ref$1.size;
            var start = ref$1.start;
            var blend = ref$1.blend;

            if (curTexArray !== texArray)
            {
                curTexArray = texArray;
                this.bindAndClearTexArray(texArray);
            }

            this.state.blendMode = blend;
            stateSystem.set(this.state);
            gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
        }
    };
    flush() {
        if (this._vertexCount === 0)
            return;

        this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
        this._indexBuffer = this.getIndexBuffer(this._indexCount);
        this._aIndex = 0;
        this._iIndex = 0;
        this._dcIndex = 0;

        this.buildTexturesAndDrawCalls();
        this.updateGeometry();
        this.drawBatches();

        // reset elements buffer for the next flush
        this._bufferSize = 0;
        this._vertexCount = 0;
        this._indexCount = 0;
    };
};

Shora.LightingRenderer = LightingRenderer;

}

/* Override MV/MZ functions. */

// Sprite
((_) => {
    _.addFilter = function(filter) {
        if (!this.filters) this.filters = [filter];
        else this.filters.push(filter);
    }
})(Sprite.prototype); 


// DataManger
((_) => {
    const createGameObjects = _.createGameObjects;
    _.createGameObjects = function() {
        $gameLighting = new GameLighting();
        $shoraLayer = new Layer();
        createGameObjects();
        $shoraLayer.reset();
    }
    const makeSaveContents = _.makeSaveContents;
    _.makeSaveContents = function() {
        const contents = makeSaveContents();
        contents.lighting = $gameLighting;
        return contents;
    }

    const extractSaveContents = _.extractSaveContents;
    _.extractSaveContents = function(contents) {
        extractSaveContents(contents);
        $gameLighting = contents.lighting;
        if (!contents.lighting) 
            $gameLighting = new GameLighting();
    }

})(DataManager); 


// Spriteset_Map
((_) => {
    _.type = () => 'map';
    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) 
            $shoraLayer.removeScene(this);
        destroy.call(this, options);
    }
    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        if (!$gameLighting._disabled)
            $shoraLayer.loadScene(this);
        createUpperLayer.call(this);
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        if (!$gameLighting._disabled)
            $shoraLayer.update();
    }
})(Spriteset_Map.prototype);


// Spriteset_Battle
((_) => {
    _.type = () => 'battle';
    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) 
            $shoraLayer.removeScene(this);
        destroy.call(this, options);
    }
    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        if (!$gameLighting._disabled && !$gameLighting._battleLightingDisabled)
            $shoraLayer.loadScene(this);
        createUpperLayer.call(this);
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        if (!$gameLighting._disabled && !$gameLighting._battleLightingDisabled)
            $shoraLayer.update();
    }
})(Spriteset_Battle.prototype);


// Game_Map
((_) => {
    const setup = _.setup;
    _.setup = function(mapId) {
        setup.call(this, mapId);
        this._lighting = [];
        this._staticLighting = [];
        if ($dataMap) {
            this.scanNoteTags($dataMap.note.split('\n'));
            this.scanTileNoteTag(this.tileset().note.split('\n'));
        }
    }

    _.scanNoteTags = function(lines) {

        this.lightingState = !$gameLighting._disabled, 
        this.lightingAmbient = $gameLighting.ambient;

        for (command of lines) {
            command = command.match(Shora.REGEX.COMMAND);
            if (!command) continue;
            switch (command[1].toLowerCase()) {
                case 'lighting':
                    this.lightingState = command[2] === 'on';
                    break;
                case 'ambient': 
                    this.lightingAmbient = command[2].toHexValue();;
                    break;
            }
        }

    }

    _.scanTileNoteTag = function() {
        //
    }

})(Game_Map.prototype);

// Game_Character
((_) => {
    // NEED REWORK
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
        let lightingParams = {id: 0};
        if ($gameParty.leader())
            note = $gameParty.leader().actor().note.split('\n');
        for (let line of note)
            Shora.CallCommand(lightingParams, line);
        if (lightingParams.name) {
            this.setLighting(lightingParams);
        } else {
        	lightingParams = {id: 0};
            for (const item of $gameParty.items()) {
                const note = item.note.split('\n');
                for (let line of note)
                    Shora.CallCommand(lightingParams, line);
                if (lightingParams.name) 
                    return this.setLighting(lightingParams);
            }
        	this.hasLight = false;
        }
    }
    _.setLighting = function(params) {
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
        this.lightingParams = {};
        this.page().list.forEach((comment) => {
            if (comment.code === 108 || comment.code === 408) 
                Shora.CallCommand(this.lightingParams, comment.parameters.join(''));
        });
        this.lightingParams.id = this._eventId;
        this.hasLight = !!this.lightingParams.name;
    }

})(Game_Event.prototype);


/* Lighting layer, contain ambient layer and lights layer. */
class Layer {
    constructor() {
        this.baseTextureCache = {}; // TODO: Wait for texture to load
        this.textureCache = {}; // TODO: Sprite Cache
        this.mapId = 0;

        this.LIGHTING = {};
        this._colorFilter = JSON.parse(Shora.Lighting.PARAMETERS.filter || '{}') ;

        this.loadParameters();
        this.loadLighting();
        
        this.lighting = null;
    }
    
    preload(filename) {
        this.baseTextureCache[filename] = ImageManager.loadLight(filename + '.png');
    }
    
    loadParameters() {
        let GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
        this._regionStart = Number(GAME_PARAMETERS.regionStart);
        this._regionEnd = Number(GAME_PARAMETERS.regionEnd);
        this._topRegionId = Number(GAME_PARAMETERS.topRegionId);
        this._ignoreShadowsId = Number(GAME_PARAMETERS.ignoreShadowsId);
        this._drawBelowPicture = GAME_PARAMETERS.drawBelowPicture === 'true';
        this._wallID = Number(GAME_PARAMETERS.wallID);
        this._topID = Number(GAME_PARAMETERS.topID);

        // Color List
        let COLORS = JSON.parse(JSON.parse(Shora.Lighting.PARAMETERS['helper']).colors);
        for (let i = 0; i < COLORS.length; ++i) {
            COLORS[i] = JSON.parse(COLORS[i]);
            Shora.Color[COLORS[i].name] = COLORS[i].color.toHexValue();
        }
    }

    /**
     * Load a base texture from cache.
     * @param {String} name 
     */
    load(name) {
        if (!this.baseTextureCache[name]) {
            if (name == undefined)
                throw new Error("Please don't change default lighting reference and set it back to 'default'");
            else
                throw new Error('Please add + ' + name + '.png light image to /img/lights/.');
        }
        return this.baseTextureCache[name]._baseTexture;
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
    addLighting(_settings) {
        const settings = JSON.parse(_settings);
        let name = settings.name;
        if (name == "<-- CHANGE_THIS -->") 
            return console.warn('Please set the reference of light, aka it name when adding new custom light. Register progress canceled.'); 
        
        this.preload(settings.filename);

        settings.radius = Number(settings.radius || 100) / 100;
        settings.angle = (Number(settings.angle) || 0) / 57.6; 
        settings.status = settings.status !== 'false';

        settings.direction = settings.direction === 'true';
        settings.tint = settings.tint.toHexValue();
        settings.bwall = settings.bwall === 'true';
        settings.shadow = settings.shadow === 'true';
        
        let defaultShadowAmbient = JSON.parse(Shora.Lighting.PARAMETERS['Map']).shadowAmbient;
        settings.shadowambient = 
            settings.shadowambient == "" ?  
            defaultShadowAmbient.toHexValue() :
            settings.shadowambient.toHexValue();

        settings.offset = JSON.parse(settings.offset);
        for (const p in settings.offset) {
            settings.offset[p] = Number(settings.offset[p]);
        }

        settings.shadowoffsetx = Number(settings.shadowoffsetx);
        settings.shadowoffsety = Number(settings.shadowoffsety);
        
        settings.colorfilter = JSON.parse(settings.colorfilter);
        settings.colorfilter.hue = Number(settings.colorfilter.hue);
        settings.colorfilter.brightness = Number(settings.colorfilter.brightness);
        settings.colorfilter.colortone = settings.colorfilter.colortone.toRGBA();
        settings.colorfilter.blendcolor = settings.colorfilter.blendcolor.toRGBA();

        settings.animation = JSON.parse(settings.animation);
        for (const p in settings.animation) {
            if (p[0] === '.') continue;
            settings.animation[p] = JSON.parse(settings.animation[p]);
            for (let a in settings.animation[p]) {
                settings.animation[p][a] = JSON.parse(settings.animation[p][a]);
            }
        }

        settings.name = name;
        this.LIGHTING[name] = settings;

        console.log('Shora Lighting: ' + name + ' registered');
    }

    reset() {
        this.mapId = 0;
    }

    updateIntensityFilter(spriteset, disable) {
        if (!disable && this._colorFilter.status == 'true') {
            if (Shora.isMV)
                spriteset._baseSprite.filters[0].brightness(Number(this._colorFilter.brightness));
            else
                spriteset._baseSprite.filters[0].setBrightness(Number(this._colorFilter.brightness) * 255);
        } else {
            if (Shora.isMV)
                spriteset._baseSprite.filters[0].brightness(1);
            else
                spriteset._baseSprite.filters[0].setBrightness(255);
        }
    }

    loadScene(spriteset) {
        // Automatically removeChild in old maps sprite
        this._spriteset = spriteset;
        if (!this.lighting)
            this.lighting = new LightingLayer();
        Shora.MessageY = 0;
        this.updateIntensityFilter(this._spriteset);
        if ($gameMap.mapId() === this.mapId && this._spriteset.type() == this._spritesetType && this.lighting) {
            this.lighting.update(); 
            if ($gameMap.lightingState) {
                this._spriteset._baseSprite.addChild(this.lighting.sprite);
            } else {
                this.updateIntensityFilter(spriteset, true);
            }
            return;
        }
        this._spritesetType = this._spriteset.type();
        this.mapId = $gameMap.mapId();
        this.lighting.initialize(this._spritesetType);
        if ($gameMap.lightingState) {
            this._spriteset._baseSprite.addChild(this.lighting.sprite);
        } else {
            this.updateIntensityFilter(spriteset, true);
        }
    }

    removeScene(spriteset) {
        this.updateIntensityFilter(spriteset, true);
        spriteset._baseSprite.removeChild($shoraLayer.lighting.sprite);
    }

    update() {
        if ($gameMap.mapId() != this.mapId)
            this.mapId = $gameMap.mapId(),
            $gameMap._lighting = [];
        this.lighting.update();
    }
    
}


class LightingLayer {
    constructor() {
        this.lights = [];
        this.softShadowFilters = [new KawaseBlurFilter($gameLighting.softShadowStr, $gameLighting.softShadowQlt)];
        
        this.layer = new PIXI.Container();
        this.texture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        this.createAmbientLayer();
    }

    initialize(spritesetType) {
        // soft shadow
        this.softShadowFilters[0]._blur = $gameLighting.softShadowStr;
        this.softShadowFilters[0].quality = $gameLighting.softShadowQlt;
        this.layer.filters = $gameLighting.softShadow ? this.softShadowFilters : null;
        // clear dynamic lighting layer
        for (const light of this.lights) if (light) 
            this.removeLight(light.id);
        this.lights = [];
        // shadow

        if (spritesetType === 'map') {
            $gameShadow.refresh();
            this.addLightingSprite();
        } else if (spritesetType === 'battle') {
            $gameShadow.clear();
            this.addBattleLightingSprite();
        }
        this.update();
    }

    destroy() {
        for (const light of this.lights) if (light) 
            this.removeLight(light.id);
        this.staticLighting.destroy(true);
        this.layer.removeChild(this.staticLighting);
        this.staticLighting = this._staticLighting = null;
        this.lights = null;
        this.layer.destroy(true);
        this.layer.filters = null;
        this.layer = null;
        this.sprite.destroy(true);
        this.sprite = null;
        this.texture = null;
    }

    createAmbientLayer() {
        this._ambient = new AmbientLayer();
	    this.layer.addChild(this._ambient);
    }

    addLightingSprite() {
        for (const light of $gameMap._lighting) if (light)
            this.addLight(light);
    }

    addBattleLightingSprite() {
        for (let i = 0; i < $shoraLayer._spriteset._actorSprites.length; ++i) {
            let ac = $shoraLayer._spriteset._actorSprites[i];
            console.log(ac);
        }
        for (let i = 0; i < $shoraLayer._spriteset._enemySprites.length; ++i) {
            let en = $shoraLayer._spriteset._enemySprites[i];
            console.log(en);
        }
    }

    /**
     * Add a light sprite to layer.
     * @param {Object} options 
     */
    addLight(options) {
        const light = new LightingSprite(options);
        this.lights[options.id] = light;
        this.layer.addChild(light);
    }

    addStaticLight(options) {
        return; // TODO
        const light = new LightingSprite(options);
        light.renderable = true;
        //light.texture.baseTexture.premultipliedAlpha = false;
        if (Shora.isMV)
            light.blendMode = PIXI.BLEND_MODES.NORMAL; // TODO
        //light.x += $gameMap.displayX() * $gameMap.tileWidth();
        //light.y += $gameMap.displayY() * $gameMap.tileHeight();
        Graphics.app.renderer.render(light, this._staticLighting, this._clearStaticLayer);
        this._clearStaticLayer = false;
        // lights will get automatically destroyed by texture collector
        // light.destroy();
    }

    /**
     * Remove a light sprite to layer.
     * @param {Number} id 
     */
    removeLight(id) {
        if (!this.lights[id]) 
            return Shora.warn('cant remove light' + id); 
        const light = this.lights[id];
        this.lights[id] = null;
        this.layer.removeChild(light);
        light.destroy();
	}

    update() {
        if (this._displayX !== $gameMap.displayX() || this._displayY !== $gameMap.displayY()) {
            this._displayX = $gameMap.displayX(); this._displayY = $gameMap.displayY();
            this.updateDisplay();
        }
        for (const child of this.layer.children) {
            if (child.update) child.update();
        }
        Graphics.app.renderer.render(this.layer, this.texture, false);
    }

    updateDisplay() {
        $gameLighting.updateDisplay();
        for (const child of this.layer.children) {
            if (child.updateDisplay) child.updateDisplay();
        }
    }

    // command
    setMapAmbient(color, time) {
        this._ambient.set(color, time);
    }

}

class AmbientLayer extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = $gameLighting.ambient;
        this.ambient = new TintAnimation(this, this);
    }

    destroy() {
        this.ambient.destroy();
        this.ambient = null;
        super.destroy();
    }

    set(color, time) {
        this.ambient.set(color, time || 1);
    }

    update() {
        this.ambient.update();
        $gameLighting.ambient = this.tint;
    }

}


/* The lighting itself, with its shadow and shadow's compute algorithm. */

class LightingSprite extends PIXI.Sprite {

    get character() {
        return this.id ? $gameMap._events[this.id] : $gamePlayer;
    }

    constructor(options) {
        super();

        let baseSprite = TextureManager.filter(options);
        this._baseSprite = baseSprite;
        this._baseSprite.anchor.set(0.5);

        this.renderable = true;
        this.id = options.id;
        this.fileName = options.filename;
        this.colorFilter = options.colorfilter;
        this.status = options.status;
        this.anchor.set(0.5);

        this.radius = new ScaleAnimation(this, options); // default radius = 100%
        this.setRadius(options.radius);
        this.pulse = new PulseAnimation(this, options.animation.pulse, options.radius);
        
        this.rotate = new AngleAnimation(this, options);
        this.setAngle(options.direction ? this.rotate.angle() : options.angle);

        this.offset = new OffsetAnimation(options.offset);
        this.setPostion(options);

        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new TintAnimation(this, options);

        this.texture = PIXI.RenderTexture.create(this._baseSprite.width, this._baseSprite.height);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this._baseSprite.position.set(this._baseSprite.width / 2, this._baseSprite.height / 2);
        Graphics.app.renderer.render(this._baseSprite, this.texture);

        this._shadow = options.shadow;
        this.bwall = options.bwall;
        this.shadowOffsetX = options.shadowoffsetx || 0;
        this.shadowOffsetY = options.shadowoffsety || 0; 
        if (!this.bwall) // 54.00001; tw * h + 6 + eps
            this.shadowOffsetY += $gameShadow.getWallHeight(this.sourceX(), this.sourceY());
        this.shadow = new Shadow(this, options.shadowambient);
        if (this._shadow) 
            this.shadow.render(this);
        this.forceRecalculateShadow = false;

        this._justMoving = 2;

    }


    destroy() {
        this._baseSprite.destroy(); // don't destroy texture
        this._baseSprite = null;

        this.radius.destroy();
        this.flicker.destroy();
        this.offset.destroy();
        this.color.destroy();
        this.rotate.destroy();
        this.shadow.destroy();
        this.pulse.destroy();
        this.radius = null;
        this.flicker = null;
        this.color = null;
        this.offset = null;
        this.rotate = null;
        this.shadow = null;
        this.pulse = null;

        super.destroy(true);
    }

    update() {
        if (!this.status) 
            return this.renderable = false;
        this.updateAnimation();
        this.updatePostion();
        this.updateTexture();
    }

    needRecalculateShadow() {
        if (this.forceRecalculateShadow) {
            return true;
        }
        if (this.offset._changed) 
            return true;
        if (this.character.isStopping()) {
            if (this._justMoving < 2) 
                return ++this._justMoving;
            return false;
        }
        return this._justMoving = 0, true;
    }

    needRerender() {
        return this.needRecalculateShadow() || this.radius._changed || this.rotate._changed;
    }

    updateTexture() {
        if (!this.renderable || !this.needRerender()) return;
        Graphics.app.renderer.render(this._baseSprite, this.texture);
        if (this._shadow) {
            if (this.needRecalculateShadow()) {
                this.forceRecalculateShadow = false;
                this.shadow.calculate(this);
            }
            this.shadow.render(this);
        }
    }

    updatePostion() {
        this.x = Math.round(this.character.screenX() + this.offset.x);
        this.y = Math.round(this.character.screenY() + this.offset.y);
    }

    updateAnimation() {
        this.offset.update();
        if (!this.renderable) return;
        this.flicker.update();
        this.color.update();
        this.pulse.update();
        this.radius.update();
        this.rotate.update();
    }

    updateDisplay() {
        let bounds = this.getBounds();
        this.renderable = $gameLighting.inDisplay(bounds.left, bounds.top, bounds.right, bounds.bottom);
    }

    sourceX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
    }

    sourceY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
    }

    sourceBound() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
        return bounds;
    }

    setPostion(options) {
        this.x = options.x != undefined ? $gameShadow.worldToScreenX(options.x)
         : this.character.screenX() + this.offset.x;
        this.y = options.y != undefined ? $gameShadow.worldToScreenY(options.y)
         : this.character.screenY() + this.offset.y;
    }

    setRadius(radius, time, type) {
        this.radius.set(radius, time || 1, type || 1);
    }

    setAngle(angle, time, type) {
        // update .rotation instead of .angle for pixiv4 support
        this.rotate.set(angle, time || 1, type || 1);
    }

    setColor(color, time) {
        this.color.set(color, time || 1);
    }

    setOffsetX(x, time, type) {
        this.offset.setX(x, time || 1, type || 1);
    }

    setOffsetY(y, time, type) {
        this.offset.setY(y, time || 1, type || 1);
    }

    setOffset(x, y, time, type) {
        this.offset.setX(x, time || 1, type || 1);
        this.offset.setY(y, time || 1, type || 1);
    }
    setShadow(shadow) {
        $gameMap._lighting[this.id].shadow = this._shadow = shadow;
        this.updateTexture();
    }

    setTint(color, time, type) {	
        this.color.set(color, time || 1, type || 1);	
    }	
}

class BattleLightingSprite extends PIXI.Sprite {

    get character() {
        
    }

    constructor(options) {
        super();


    }

}


/// TODO: Directly draw darken geometry into light texture
// using vertex shader to calculate those geometry.
// Currently it draw those into temporary sprite then into light texture
class Shadow {
    constructor(lighting, shadowAmbient) {
        this.graphics = new PIXI.Graphics();
        // todo: remove those
        let bounds = lighting.sourceBound();
        this.texture = PIXI.RenderTexture.create(bounds.width, bounds.height);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        this.ox = this.oy = 0;
        this.shadowAmbient = shadowAmbient;
        this.calculate(lighting);
        this.render(lighting);
    }

    destroy() {
        this.polygon = this.bounds = 
        this._parallelSegments = this.shadowAmbient = null;

        this.graphics.destroy(true);
        this.graphics = null;

        this.sprite.destroy(true);
        this.sprite = null;
    }

    calculate(lighting) {
        this.ox = lighting.sourceX(), this.oy = lighting.sourceY(), this.bounds = lighting.sourceBound();
        this.polygon = ShadowSystem.computeViewport(
                        [this.ox, this.oy], 
                        $gameShadow.segments, 
                        [this.bounds.left, this.bounds.top], 
                        [this.bounds.right, this.bounds.bottom]);
        this.draw(); 
    }

    render(lighting) {
        let ox = lighting.sourceX() - lighting.shadowOffsetX, 
            oy = lighting.sourceY() - lighting.shadowOffsetY, 
            rotation = lighting.rotation;

        // render the shadow mask
        this.graphics.pivot.set(ox, oy);
        this.graphics.position.set(this.texture.width / 2, this.texture.height / 2);
        this.graphics.scale.set(1 / lighting.scale.x);
        this.graphics.rotation = 2 * Math.PI - rotation;
        Graphics.app.renderer.render(this.graphics, this.texture);

        //  render the upper shadow mask
        $gameShadow.upper.pivot.set(ox, oy);
        $gameShadow.upper.position.set(this.texture.width / 2, this.texture.height / 2);
        $gameShadow.upper.scale.set(1 / lighting.scale.x);
        $gameShadow.upper.rotation = 2 * Math.PI - rotation;
        Graphics.app.renderer.render($gameShadow.upper, this.texture, false);

        // render the ignore shadow mask (not do if not nessecary)
        if ($gameShadow.haveIgnoreShadow) {
            $gameShadow.ignore.pivot.set(ox, oy);
            $gameShadow.ignore.position.set(this.texture.width / 2, this.texture.height / 2);
            $gameShadow.ignore.scale.set(1 / lighting.scale.x);
            $gameShadow.ignore.rotation = 2 * Math.PI - rotation;
            Graphics.app.renderer.render($gameShadow.ignore, this.texture, false);
        }

        // render everything to the light texture
        Graphics.app.renderer.render(this.sprite, lighting.texture, false);
    }

    drawWall(index) {
		let [x, y] = this.polygon[index], last = (index == 0 ? this.polygon.length - 1 : index - 1);
		let [nx, ny] = this.polygon[last]; 

        if (y != ny || y > this.oy) return;

		let tw = $gameMap.tileWidth();

        // 2 possiblities: nx to x is 1 height, or multiple height
        let h = $gameShadow.check(y, nx, x);
        if (h === 0) return;
        if (h !== -1) {
            this.graphics.lineTo(nx, ny - tw * h)
		 				 .lineTo(x, y - tw * h);
        } else {
            // TODO: walking through mutiple height

        }
        
	}; 

    draw() {
        this.graphics.clear();

        // BOTTLE NECK
        this.graphics.beginFill(this.shadowAmbient);
		this.graphics.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this.graphics.endFill();

		this.graphics.beginFill(0xffffff);
		this.graphics.moveTo(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i);
            this.graphics.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this.graphics.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0);
		this.graphics.endFill(); 

		//drawing lower-walls
        this.graphics.beginFill(this.shadowAmbient); 
        let tw = $gameMap.tileWidth(), leftBound = this.bounds.left, rightBound = this.bounds.right, downBound = this.bounds.bottom, topBound = this.bounds.top;
		for (let i = 0; i < $gameShadow.lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = $gameShadow.lowerWalls[i];
            if (y1 >= this.oy && y1-tw*height <= downBound && x1 <= rightBound && x2 >= leftBound) {
                this.graphics.moveTo(x1, y1);
                this.graphics.lineTo(x1, y1-tw*height);
                this.graphics.lineTo(x2, y2-tw*height);
                this.graphics.lineTo(x2, y2);
            }
		}
        this.graphics.endFill();   

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

    const push = (poly, x, y) => {
        if (x >= 48 && y >= 48 && x % 48 === 0 && y % 48 === 0
            && y / 48 - 1 < $gameShadow.lower.length && x / 48 - 2 < $gameShadow.lower[y / 48 - 1].length
            && poly.length >= 2 && poly[poly.length - 1] === y) {
            let h = $gameShadow.lower[y / 48 - 1][x / 48 - 2], 
                lx = poly[poly.length - 2], 
                uy = y - h * $gameMap.tileHeight();
            if (h) poly.push(lx, uy, x, uy);
        }
        poly.push(x, y);
    }

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
                push(polygon, vertex[0], vertex[1]);
                let cur = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                if (!equal(cur, vertex)) push(polygon, cur[0], cur[1]);
            } else if (shorten) {
                let u = intersectLines(bounded[old_segment][0], bounded[old_segment][1], position, vertex),
                    v = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                push(polygon, u[0], u[1]);
                push(polygon, v[0], v[1]);
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


/* All the animation classes, for use with lighting and ambient color changing. */

Shora.Animation = class {
    constructor(sprite, ref) {
        this._sprite = sprite;
        this._ref = ref;
        this._changed = false;
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
        this._sprite = this._ref = null;
    }
}

class FlickerAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);
        if (!ref.status) return;

        this.oalpha = 1;
	    this.flickIntensity = ref.flickintensity || 1;
        this.flickSpeed = ref.flickspeed || 1;
        
	    this._flickSpeed = 20 * this.flickSpeed;
	    this._flickIntensity = 1 / (1.1 * this.flickIntensity);
	    this._flickMax = 1000;
	    this._flickCounter = this.flickMax;
    }

    update() {
        if (!this._ref.status) return;
        if (this._flickCounter > 0 && Math.randomInt(this._flickCounter / 5) !== 0) {
            this._flickCounter -= this._flickSpeed;
            this._sprite.alpha = this.oalpha;
        } else {
            this._flickCounter = this._flickMax;
            this._sprite.alpha = this._flickIntensity;
        }
    }
}

class ScaleAnimation extends Shora.Animation {
    constructor(light, ref) {
        super(light, ref);
        this.s0 = this.s1 = this.maxRadius = 1;
        this.delta = this.tick = 0; 
        this.time = -1; 
    }

    update() {
        this._changed = false;

        if (this.tick <= this.time) {
            let oldRadius = this._ref.radius;
            this._ref.radius = this.s0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this._sprite.scale.set(this._ref.radius);
            this.tick++;
            this._changed = oldRadius !== this._ref.radius;
        } 

        if (!this._changed && this._sprite._shadow && this._ref.radius > this.maxRadius) {
            this._sprite.forceRecalculateShadow = true;
            this.maxRadius = this._ref.radius;
        }
    }

    set(scale, time, type) {
        if (scale === this.s1) return;
        this.s0 = this._sprite.scale.x; this.s1 = scale;
        this.delta = this.s1 - this.s0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class PulseAnimation extends Shora.Animation {
    constructor(light, ref, radius) {
        super(light, ref);
        if (!ref.status) return;

        const dif = radius * ref.pulsefactor / 100;
        this.maxRadius = radius + dif;
        this.minRadius = radius - dif;

        this.tick = Math.floor(ref.pulsespeed * 30);
        light.radius.set(this.maxRadius, this.tick, 2);
        this.increasing = true;
    }

    update() {
        if (!this._ref.status) return;
        if (this.increasing && this._sprite.scale.x === this.maxRadius) {
            this.increasing = false;
            this._sprite.radius.set(this.minRadius, this.tick, 2);
        } else if (!this.increasing && this._sprite.scale.x === this.minRadius) {
            this.increasing = true;
            this._sprite.radius.set(this.maxRadius, this.tick, 2);
        }
    }

    
    
}

class AngleAnimation extends Shora.Animation {
    constructor(light, ref) {
        super(light, ref);
        this.a0 = this.a1 = 0; 
        this.delta = this.tick = 0; this.time = -1;

        this._character = light.character;
        this.direction = this._character ? this._character.direction() : null;
    }

    destroy() {
        super.destroy();
        this._character = null;
    }

    angle() {
        // update .rotation for pixiv4 compatibility
        let dest = [3.125, 4.6875, 1.5625, 0]; 
        let x = dest[this.direction / 2 - 1];
        if (Math.abs(this._sprite.rotation - 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation -= 6.25;
        else if (Math.abs(this._sprite.rotation + 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation += 6.25;
        return x;
    }

    update() {
        this._changed = false;

        if (this._ref.direction && this.direction != this._character.direction()) {
            this.direction = this._character.direction();
            this.set(this.angle(), 20, 2);
         }

        if (this.tick <= this.time) {
            this._ref.angle 
            = this._sprite.rotation 
            = this.a0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
            this._changed = true;
        } 
    }

    set(angle, time, type) {
        this.a0 = this._sprite.rotation; this.a1 = angle;
        this.delta = this.a1 - this.a0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class TintAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);
        this._sprite.tint = ref.tint || Math.round(Math.random() * 0xfffff);

        this.ocolor = Shora.ColorManager.hexToRGB(ref.tint);
        this.dcolor = this.ocolor;
        this.tick = 0; this.len = -1;
    }
    set(color, time) {
        this.tick = 0; this.len = time;
        this.ocolor = this.dcolor;
        this.dcolor = Shora.ColorManager.hexToRGB(color);
    }
    update() {
        if (this.tick <= this.len) {
            let p = this.tick / this.len;
            this._ref.tint = this._sprite.tint = Shora.ColorManager.transition(p, this.ocolor, this.dcolor);
            this.tick++;
        }
    }
}

class OffsetAnimation {
    constructor(offset) {
        // ref
        this.offset = offset;
        this.ox = offset.x;
        this.oy = offset.y;
        this.tick_x = 2; this.time_x = this.delta_x = 1;
        this.tick_y = 2; this.time_y = this.delta_y = 1;
        this.type_x = this.type_y = 0;
    }

    setX(x, time, type) {
        this.ox = this.offset.x;
        this.delta_x = x - this.ox;
        this.time_x = time; this.tick_x = 1;
        if (type) this.type_x = type - 1;
    }

    setY(y, time, type) {
        this.oy = this.offset.y;
        this.delta_y = y - this.oy;
        this.time_y = time; this.tick_y = 1;
        if (type) this.type_y = type - 1;
    }

    update() {
        this._changed = false;

        if (this.tick_x <= this.time_x) {
            this.offset.x = this.ox + Shora.Animation.transition[this.type_x](this.tick_x / this.time_x) * this.delta_x;
            this.tick_x++;
            this._changed = true;
        }
        if (this.tick_y <= this.time_y) {
            this.offset.y = this.oy + Shora.Animation.transition[this.type_y](this.tick_y / this.time_y) * this.delta_y;
            this.tick_y++;
            this._changed = true;
        }
    }

    destroy() {
        this.offset = null;
    }

    get x() {
        return this.offset.x;
    }
    get y() {
        return this.offset.y;
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



/* Game classes for script interfacing. */

function GameLighting() {
    this.initialize(...arguments);
}

GameLighting.prototype.constructor = GameLighting;

GameLighting.prototype.initialize = function() {
    this.loadParameters();
}

GameLighting.prototype.loadParameters = function() {
    this._disabled = false;

    let PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Map']);
    this.ambient = PARAMETERS.ambient.toHexValue();
    this.shadowAmbient = PARAMETERS.shadowAmbient.toHexValue();
    this.topBlockAmbient = PARAMETERS.topBlockAmbient.toHexValue();

    PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['filter']);
    this.softShadow = PARAMETERS.softShadow !== 'false';
    this.softShadowStr = Number(PARAMETERS.softShadowStr) || 1;
    this.softShadowQlt = Number(PARAMETERS.softShadowQlt) || 1;
}

/**
 * Add a lighting instance to scene.
 * 
 * @param {Game_Character} character 
 * @param {Object} options 
 */
GameLighting.prototype.add = function(options) {
    if (!$shoraLayer.LIGHTING[options.name]) {
        Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
        options.name = 'default';
    }
    //const params = JSON.parse(JSON.stringify({...$shoraLayer.LIGHTING[options.name], ...options}));
    const params = {...$shoraLayer.LIGHTING[options.name], ...options};
    if (options.offsetx) params.offset.x = options.offsetx;
    if (options.offsety) params.offset.y = options.offsety;

    this.remove(params.id);
    $gameMap._lighting[params.id] = params;
    $shoraLayer.lighting.addLight(params);
}

/**
 * Remove a lighting instance from scene.
 * @param {Number} id 
 */
 GameLighting.prototype.remove = function(id) {
    if ($gameMap._lighting[id]) {
        $shoraLayer.lighting.removeLight(id);
        $gameMap._lighting[id] = null;
    }
}

GameLighting.prototype.inDisplay = function(minX, minY, maxX, maxY) {
    return maxX >= this.minX && minX <= this.maxX && maxY >= this.minY && minY <= this.maxY;
} 

// update
GameLighting.prototype.updateDisplay = function() {
    this.minX = 0; // todo
    this.minY = 0;
    this.maxX = Graphics._width;
    this.maxY = Graphics._height;
}

// command
GameLighting.prototype.setMapAmbient = function(color, time) {
    $shoraLayer.lighting.setMapAmbient(color.toHexValue(), Number(time) || 1);
}

GameLighting.prototype.setShadowAmbient = function(color) {
    this.shadowAmbient = color.toHexValue();
}

GameLighting.prototype.setTopBlockAmbient = function(color) {
    this.topBlockAmbient = color.toHexValue();
}

GameLighting.prototype.width = function() {
    return Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
}

GameLighting.prototype.height = function() {
    return Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);
}

GameLighting.prototype.setStatus = function(id, status) {
    if (!$shoraLayer.lighting.lights[id] || status === '') return;
    $gameMap._lighting[id].status = 
    $shoraLayer.lighting.lights[id].status = status === 'true' || status === 'on';
    $shoraLayer.lighting.lights[id].renderable = true;
}

GameLighting.prototype.setRadius = function(id, radius, time, type) {
    if (!$shoraLayer.lighting.lights[id] || radius === '') return;
    $shoraLayer.lighting.lights[id].setRadius(Number(radius) / 100, Number(time), Number(type));
}

GameLighting.prototype.setAngle = function(id, angle, time, type) {
    if (!$shoraLayer.lighting.lights[id] || angle === '') return;
    $shoraLayer.lighting.lights[id].setAngle(Number(angle) / 57.6, Number(time), Number(type));
}

GameLighting.prototype.setShadow = function(id, status) {
    if (!$shoraLayer.lighting.lights[id] || status === '') return;
    $shoraLayer.lighting.lights[id].setShadow(status === 'true' || status === 'on');
}

GameLighting.prototype.setOffset = function(id, x, y, time, type) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setOffset(Number(x), Number(y), Number(time), Number(type));
}

GameLighting.prototype.setOffsetX = function(id, x, time, type) {
    if (!$shoraLayer.lighting.lights[id] || x === '') return;
    $shoraLayer.lighting.lights[id].setOffsetX(Number(x), Number(time), Number(type));
}

GameLighting.prototype.setOffsetY = function(id, y, time, type) {
    if (!$shoraLayer.lighting.lights[id] || y === '') return;
    $shoraLayer.lighting.lights[id].setOffsetY(Number(y), Number(time), Number(type));
}

GameLighting.prototype.setTint = function(id, color, time, type) {
    if (!$shoraLayer.lighting.lights[id] || color === '') return;
    $shoraLayer.lighting.lights[id].setTint(color.toHexValue(), Number(time), Number(type));
}

GameLighting.prototype.addStaticLight = function(x, y, name) {
    return; // TODO
    let options = {
        name: name || 'default',
        fileName: 'lights', 
        x: x, 
        y: y, 
        id: 'static'
    };
    if (!$shoraLayer.LIGHTING[options.name]) {
        Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
        options.name = 'default';
    }
    const params = {...$shoraLayer.LIGHTING[options.name], ...options};
    $gameMap._staticLighting.push(params);
    $shoraLayer.lighting.addStaticLight(params);
}

GameLighting.prototype.setColorFilter = function(status) {
    $shoraLayer._colorFilter.status = status ? 'true' : 'false';
    $shoraLayer.updateColorFilter();
}

GameLighting.prototype.setBrightness = function(brightness) {
    $shoraLayer._colorFilter.brightness = brightness;
    $shoraLayer.updateColorFilter();
}

GameLighting.prototype.setPluginState = function(status) {
    if (status && this._disabled) 
        this.enable();
    if (!status && !this._disabled) 
        this.disable();
}

GameLighting.prototype.temporarySetPluginState = function(status) {
    if (status) {
        if (SceneManager._scene._spriteset)
            $shoraLayer.loadScene(SceneManager._scene._spriteset);
    } else {
        if (SceneManager._scene._spriteset)
            $shoraLayer.removeScene(SceneManager._scene._spriteset);
    }
}

GameLighting.prototype.enable = function() {
    if (!this._disabled) return;
    this._disabled = false;
    if (SceneManager._scene._spriteset)
        $shoraLayer.loadScene(SceneManager._scene._spriteset);
}

GameLighting.prototype.disable = function() {
    if (this._disabled) return;
    this._disabled = true;
    if (SceneManager._scene._spriteset)
        $shoraLayer.removeScene(SceneManager._scene._spriteset);
}

class ShadowCaster {
    constructor(p, height) {
        this.height = height;
        this.segments = [];
        for (let i = 0; i < p.length - 1; ++i)
            this.segments.push([p[i], p[i + 1]]);
        this.segments.push([p[p.length - 1], p[0]]);
    }
}

class GameShadow {
    constructor() {
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
        this.segments = [];
        this.lowerWalls = [];

        this._upperGraphics.clear();
        this._upperTexture.resize($gameLighting.width(), $gameLighting.height());

        this._ignoreGraphics.clear();
        this._ignoreTexture.resize($gameLighting.width(), $gameLighting.height());
    }


    scanMapCaster() {
        const width = $gameMap.width(),
              height = $gameMap.height(),
              tw = $gameMap.tileWidth(),
              th = $gameMap.tileHeight(),
              regionStart = $shoraLayer._regionStart,
              regionEnd = $shoraLayer._regionEnd,
              topRegionId = $shoraLayer._topRegionId,
              ignoreShadowsId = $shoraLayer._ignoreShadowsId,
              wallID = $shoraLayer._wallID || 1,
              topID = $shoraLayer._topID || 2;


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
        }
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
        }
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
        }
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

        this.segments = ShadowSystem.getSegments(
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
}

$gameShadow = new GameShadow();