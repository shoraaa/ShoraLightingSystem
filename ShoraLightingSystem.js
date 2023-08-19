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

    console.log(pluginName + ' v' + pluginVersion);

    var ColorManager = ColorManager || {};

    ColorManager.registered = {};

    ColorManager.stringToHex = function(color) {
        if (ColorManager.registered[color]) {
            return ColorManager.registered[color];
        }
        if (color.length == 6) {
            return parseInt(color, 16);
        }
        return parseInt(color.substr(1), 16);
    };

    ColorManager.register = function(name, color) {
        ColorManager.registered[name] = ColorManager.stringToHex(color);
    };

    ColorManager.toRGBA = function(color) {
        let s = color.substr(5, color.length - 6);
        let a = s.split(",");
        return a.map(x => Number(x.trim()));
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

    const engineParameters$1 = PluginManager.parameters(pluginName);

    const mapConfig = JSON.parse(engineParameters$1['Map']);
    const gameConfig = JSON.parse(engineParameters$1['Game']);
    const helperConfig = JSON.parse(engineParameters$1['helper']);
    const filterConfig = JSON.parse(engineParameters$1['filter']);

    const engineName = Number(PIXI.VERSION[0]) < 5 ? 'MV' : 'MZ';

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

        console.log('Shora Lighting: ' + name + ' registered');
    }

    registerLight(defaultLight);
    for (config of customLights) {
        registerLight(config);
    }

    const makeSaveContents = DataManager.makeSaveContents;
    const extractSaveContents = DataManager.extractSaveContents;

    DataManager.makeSaveContents = function() {
        const contents = makeSaveContents();
        contents.lighting = $gameLighting.data;
        return contents;
    };

    DataManager.extractSaveContents = function(contents) {
        extractSaveContents(contents);
        $gameLighting.data = contents.lighting;
    };

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
            $gameLighting.add(this._lightConfig);
        }
        if (!this._lightConfig.status && this.lighting) {
            this.lighting = false;
            $gameLighting.remove(this._lightConfig);
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

    const destroy = Spriteset_Map.prototype.destroy;
    const createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    const update = Spriteset_Map.prototype.update;

    Spriteset_Map.prototype.destroy = function(options) {
        destroy.call(this, options);
        $gameLighting.removeScene(this);
    };

    Spriteset_Map.prototype.createUpperLayer = function() {
        createUpperLayer.call(this);
        $gameLighting.loadScene(this);
    };

    Spriteset_Map.prototype.update = function() {
        update.call(this);
        $gameLighting.update();
    };

    class Light extends Sprite {
        constructor(config, position) {
            super();
            this.config = config;
            this.pos = position;

            this.filename = config.filename;
            this.bitmap = ImageManager.loadLight(this.filename);
            this.id = config.id;

            this.anchor.set(0.5);
            this.blendMode = PIXI.BLEND_MODES.ADD;
        }

        update() {
            this.x = this.pos.screenX();
            this.y = this.pos.screenY();
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

    class Game_Lighting {
        constructor() {
            console.log(pluginName + " API had been construted. Use the method provided by $gameLighting to get started.");
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

            this.lights = [];
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
            this.addCharacterMapLighting();
            spriteset._baseSprite.addChild(this.sprite);
        }

        removeScene(spriteset) {
            spriteset._baseSprite.removeChild(this.sprite);
            this.layer.removeChildren(1);
        }

        addLight(config) {
            const character = config.id ? $gameMap._events[config.id] : $gamePlayer;
            const light = new Light(config, character);
            this.lights.push(light);
            this.layer.addChild(light);
        }

        addCharacterMapLighting() {
            for (const config of $gameMap._lighting) {
                if (!config) {
                    continue;
                }
                this.addLight(config);
            }
        }

        update() {
            this.ambient.update();
            for (const light of this.lights) {
                light.update();
            }
            Graphics.app.renderer.render(this.layer, this.texture, false);
        }

        /*! Indirect API Functions */
        add(config) {
            if (!this.baseLightingConfig[config.name]) {
                config.name = 'default';
            }

            const _config = {...this.baseLightingConfig[config.name], ...config};

            $gameMap._lighting[config.id] = _config;
            this.addLight(_config);

        }

        /*! Direct API Functions (called by script command) */
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
