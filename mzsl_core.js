/*:
 * @plugindesc v0.9 
 * <Shora Lighting System>
 * @author Shora
 * @desc Shora Lighting System for MZ. 
 * @target MZ
 * @url https://forums.rpgmakerweb.com/index.php?members/shora.158648/
 * @help
 *
 * @param Game
 * @text [Game: Settings]
 * @type struct<GameSettings>
 * @desc Settings for game.
 * @default {"region_start":"1"}
 * 
 * @param sep0
 * @text ==================================
 * @default ==================================
 * 
 * @param Map
 * @type struct<MapSettings>
 * @text [Map: Default]
 * @desc Default Settings for all map.
 * @default {"ambient":"#333333"}
 * 
 * @param sep1
 * @text ==================================
 * @default ==================================
 * 
 * @param default
 * @text [Lights: Default]
 * @type struct<LightSettings>
 * @desc The default settings for all light. You can use [light] or [light default] in actor/item note or event comment to use this setting. * 
 * @default {"name":"default","filename":"lights","range":"1","direction":"true","sep0":"==================================","tint":"#ffffff","colorfilter":"{\"hue\":\"0\",\"colortone\":\"rgba(0,0,0,0)\",\"blendcolor\":\"rgba(0,0,0,0)\",\"brightness\":\"255\"}","sep1":"==================================","animation":"{\">Static Effects<\":\"=====================\",\"flicker\":\"{\\\"status\\\":\\\"false\\\",\\\"flickintensity\\\":\\\"1\\\",\\\"flickspeed\\\":\\\"1\\\"}\",\">Dynamic Effects<\":\"=====================\",\"pulse\":\"{\\\"status\\\":\\\"true\\\",\\\"pulsefactor\\\":\\\"1\\\",\\\"pulsespeed\\\":\\\"1\\\"}\",\"rotation\":\"{\\\"rotatespeed\\\":\\\"1\\\"}\"}","sep2":"==================================","offset":"{\"x\":\"0\",\"y\":\"0\"}","rotation":"","sep4":"==================================","shadow":"true","static":"auto","bwall":"false"}
 * 
 * @param LightList
 * @text [Lights: Custom]
 * @type struct<LightSettings>[]
 * @default []
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
 * @default 0
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
 * @command Set Map Color
 * @desc Change the map shadow color in tick(s) time.
 * @arg color
 * @text Color
 * @desc Destination Color of map shadow.
 * @default #000000
 * @arg time
 * @text Time
 * @desc Time (in tick) between transtition.
 * @default 0
 *
 */

/*~struct~GameSettings:
 * @param regionStart
 * @text Region Id Start Index
 * @desc Starting index of the shadow region id.
 * @default 1
 */
/*~struct~MapSettings:
 * @param ambient
 * @text Map Shadow Color
 * @desc Color of map' shadow. Hexadecimal.
 * @default #333333
 */
/*~struct~LightSettings:
 * @param name
 * @text Ref
 * @desc The registered name for this light. Use [light <name>] to use it. Ex: [light flashlight]; [light] is equivalent as [light default]
 * 
 * @param filename
 * @text Image
 * @type file
 * @dir img/lights/
 * @desc The filename of the default light (string).
 * @default lights
 * 
 * @param range
 * @text Scale
 * @desc The range (scale) of the default light (float).
 * @default 1
 * 
 * @param direction
 * @text Direction
 * @desc Sync with direction setting. Will be overrided if set advanced rotation.
 * @default false
 * 
 * @param sep0
 * @text ==================================
 * @default ==================================
 * 
 * @param tint
 * @text [Color: Tint]
 * @desc The tint of the default light (Hexadecimal). #ffffff is unchanged.  Leave this blank to generate random color.
 * @default #ffffff
 * 
 * @param colorfilter
 * @text [Color: Filters]
 * @type struct<ColorFilterSettings>
 * @desc The color setting for default light.
 * @default {"hue":"0","colortone":"[\"0\",\"0\",\"0\",\"0\"]","blendcolor":"[\"0\",\"0\",\"0\",\"0\"]","brightness":"255"}
 * 
 * @param sep1
 * @text ==================================
 * @default ==================================
 * 
 * @param animation
 * @text [Animation: Settings]
 * @type struct<AnimationSettings>
 * @desc The animation setting for default light.
 * 
 * @param sep2
 * @text ==================================
 * @default ================================== 
 *
 * 
 * @param offset
 * @text [Advanced: Offset]
 * @type struct<OffsetSettings>
 * @desc The offset coordinate.
 * @default {"x":"0","y":"0"}
 * 
 * @param rotation
 * @text [Advanced: Rotation]
 * @type Number
 * @desc Rotation in angle. Setting this will override default direction syncing and disable it. 
 * @default 
 * 
 * @param sep4
 * @text ==================================
 * @default ================================== 
 * 
 * @param shadow
 * @text [Shadow]
 * @type boolean
 * @desc Set the shadow status.
 * @default true
 * 
 * @param static
 * @text [Shadow: State]
 * @desc The static/dynamic state for light. (static/auto)
 * @default auto
 * 
 * @param bwall
 * @text [Shadow: z-Index]
 * @type boolean
 * @desc Is this light behind the wall or not?
 * @default false
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
 * @param >Static Effects<
 * @default =====================
 * @param flicker
 * @text Flicker Effect
 * @parent >Static Effects<
 * @type struct<FlickerAnimation>
 * @param >Dynamic Effects<
 * @default =====================
 * @param pulse
 * @text Pulse Effect
 * @parent >Dynamic Effects<
 * @type struct<PulseAnimation>
 * @param rotation
 * @text Rotation Effect
 * @parent >Dynamic Effects<
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
 * @param range
 * @text Range
 * @type number
 * @desc The range of the light (float).
 * 
 * @param offset
 * @text Offset
 * @type struct<OffsetSettings>
 * @desc The offset coordinate.
 * 
 * @param rotation
 * @text Rotation
 * @type combo
 * @desc Rotation in angle. ("auto" to make the light automatically sync with character direction);
 * @option auto
 * @option animate
 * @default 100
 * 
 * @param tint
 * @text Tint
 * @desc The tint of the light (Hexadecimal). #ffffff is unchanged.  Leave this blank to generate random color.
 * 
 * @param ====================================================
 * @default ====================================================
 * 
 * @param animation
 * @text Animation Settings
 * @type struct<AnimationSettings>
 * @desc The animation setting for light.
 * 
 * @param shadow
 * @text Cast Shadow
 * @type boolean
 * @desc Set the shadow status.
 * 
 * @param static
 * @text Static/Dynamic.
 * @type boolean
 * @desc The static/dynamic state for light.
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

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = 'mzsl_core';
Shora.Lighting.VERSION = 0.9;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempMatrix = new PIXI.Matrix();
Shora.maskTexture = PIXI.RenderTexture.create({ width: 0, height: 0 });

Shora.CallCommand = function(params, line) {
    if (!line) return;
    let tag, command;
    if (command = line.shoraCommand()) {
        command[1] = command[1].toLowerCase();
        switch (command[1]) {
            case 'light':
                params.name = command[2];
                break;
            case 'rotation':
                params.rotation = Number(command[2]);
                break;
            case 'pulsefactor':
            case 'pulsespeed':
            case 'flickintensity':
            case 'flickspeed':
                params.animation[command[1]] = Number(command[2]);
                break;
            default: 
                params[command[1]] =  Number(command[2]);
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

// Regex
Shora.REGEX = {
    TAG: /\[([\w_\d]+)\]/,
    COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\]/,
    DOUBLE_COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/
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
ImageManager.loadLight = function(filename) {
	const url = 'img/lights/' + Utils.encodeURI(filename);
	return Bitmap.load(url);
};

// Plugin Command
{
    const { pluginName } = Shora.Lighting;

    // Add new statical light into map
    PluginManager.registerCommand(pluginName, 'Add Point Light', args => {
        //
    });

    // Change map shadow color
    PluginManager.registerCommand(pluginName, 'Set Map Color', args => {
        $gameLighting.setMapColor(Number(args.color), Number(args.time) || 0);
    });

    // Set light color
    PluginManager.registerCommand(pluginName, 'Set Light Parameters', function(args) {
        let id = args.id == "" ? this._eventId : Number(args.id);
        let character = id == 0 ? $gamePlayer : $gameMap._events[id];
        if (!character) {
            Shora.warn(id + ' is not a valid event id.'); return;
        }
        if (character.lighting) {
            let time = Number(args.time);
            let type = Number(args.type);
            const lighting = character.lighting;
            let parameters = JSON.parse(args.parameters);
            if (parameters.range !== "") lighting.setRange(Number(args.range), time);
            if (parameters.offset !== "") {
                parameters.offset = JSON.parse(parameters.offset);
                if (parameters.offset.x !== "") lighting.setOffsetX(Number(parameters.offset.x), time, type);
                if (parameters.offset.y !== "") lighting.setOffsetY(Number(parameters.offset.y), time, type);
            }
            if (parameters.rotation !== "") {
                if (parameters.rotation === 'auto') lighting.setAutoDirection(true);
                else lighting.setRotation(Number(parameters.rotation), time, type);
            }
            if (parameters.tint !== "") lighting.setColor(Number(parameters.tint), time);
            if (parameters.animation !== "") {
                parameters.animation = JSON.parse(parameters.animation);
                let {pulsefactor, pulsespeed, flickintensity, flickspeed} = parameters.animation;
                if (pulsefactor !== "") lighting.pulse.pulsefactor = Number(pulsefactor);
                if (pulsespeed !== "") lighting.pulse.pulsespeed = Number(pulsespeed); 
                if (flickintensity !== "") lighting.flicker.flickintensity = Number(flickintensity); 
                if (flickspeed !== "") lighting.flicker.flickspeed = Number(flickspeed); 
            }
            if (parameters.shadow !== "")  lighting.setShadow(parameters.shadow === "true");
            if (parameters.static !== "")  lighting.setStatic(parameters.static === "true");
        } else {
            Shora.warn('Event ' + id + " doesn't have a light to change parameter.");
        }
    })
}

// Scene Manager
((_) => {
    const initialize = _.initialize;
    _.initialize = function() {
        initialize.call(this);
        _.shoraCoreInitialize();
    }
    // File Path
    _.shoraCoreInitialize = function() {
        const path = require('path');
        Shora.DIR_PATH = path.join(path.dirname(process.mainModule.filename));
    }
})(SceneManager);

// DataManager
((_) => {
    const createGameObjects = _.createGameObjects;
    _.createGameObjects = function() {
        createGameObjects.call(this);
        $shoraLayer = new Layer();
        $gameLighting = new GameLighting();
        $gameShadow = new GameShadow();
    }
})(DataManager);

// Spriteset_Map
((_) => {
    _.type = () => 'map';

    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) this.removeChild($shoraLayer.lighting.lightSprite);
        destroy.call(this, options);
    }

    const createLowerLayer = _.createLowerLayer;
    _.createLowerLayer = function() {
        createLowerLayer.call(this);
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
        if ($dataMap) {
            this.scanNoteTags($dataMap.note.split('\n'));
            this.scanTileNoteTag(this.tileset().note.split('\n'));
        }
    }

    const refresh = _.refresh;
    _.refresh = function() {
        refresh.call(this);
        this.refreshItemLighting();
    }

    _.refreshItemLighting = function() {
        if ($gameParty) {
            let lightingParams = { id: 0, auto: true };
            for (const item of $gameParty.items()) {
                const note = item.note.split('\n');
                for (let line of note) {
                    Shora.CallCommand(lightingParams, line);
                }
            }
            if (lightingParams.name) {
                $gamePlayer.setLighting(lightingParams);
            }
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
        this.updateLighing();
    }

    _.updateLighing = function() {
        if (this.hasLight && !this.lighting) {
            this.lighting = $gameLighting.add(this, this.lightingParams);
        }
        if (!this.hasLight && this.lighting) {
            $gameLighting.remove(this._eventId || 0);
            this.lighting = null;
            this.lightingParams = {};
        }
    }

})(Game_Character.prototype);

// Game_Player
((_) => {
    const refresh = _.refresh;
    _.refresh = function() {
        refresh.call(this);
        this.scanLighting();
    }
    _.scanLighting = function() {
        const note = $gameParty.leader().actor().note.split('\n');
        let lightingParams = { id: 0, auto: true };
        for (let line of note) {
            Shora.CallCommand(lightingParams, line);
        }
        if (lightingParams.name) {
            this.setLighting(lightingParams);
        } else {
            this.hasLight = false;
        }
    }
    _.setLighting = function(params) {
        params.static = false;
        if (this.hasLight) {
            this.hasLight = false;
            this.updateLighing();
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

Shora.MessageY = 0;
Shora.warn = function(err) {
    const message = new PIXI.Text('Shora Lighting Plugin: ' + err, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'left'});
    message.y += Shora.MessageY; Shora.MessageY += message.height;
    if (Graphics.app.stage) Graphics.app.stage.addChild(message);
}