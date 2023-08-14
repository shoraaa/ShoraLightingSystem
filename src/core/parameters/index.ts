
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

import { PluginManager, PIXI } from 'rmmz';

import ShadowParameters from './ShadowParameters';
import LightParameters from './LightParameters';
import { stringToHex } from '../color';

export const pluginName: string = 'ShoraLighting';

const engineParameters: any = PluginManager.parameters(pluginName);

const mapParameter: any = JSON.parse(engineParameters['Map']);
const gameParameters: any = JSON.parse(engineParameters['Game']);
const helperParameters: any = JSON.parse(engineParameters['helper']);
const filterParameters: any = JSON.parse(engineParameters['filter']);

export const engineName: string = PIXI.VERSION[0] < 5 ? 'MV' : 'MZ';

export const defaultColors: Object = {};

const colors = JSON.parse(helperParameters.colors);

for (const colorJSON of colors) {
    const color = JSON.parse(colorJSON);
    defaultColors[color.name] = stringToHex(color.color);
}

import { toHex } from '../color';

export const lightParameters: LightParameters = {
    ambient: stringToHex(mapParameter.ambient),
    intensity: {
        status: true,
        strength: 1,
    },

};

console.log(filterParameters);

export const shadowParameters: ShadowParameters = {
    engineShadow: helperParameters.disableEngineShadow !== 'true',
    regionId: {
        start: Number(gameParameters.regionStart),
        end: Number(gameParameters.regionEnd),
        top: Number(gameParameters.topRegionId),
        ignore: Number(gameParameters.ignoreShadowsId),
    },
    terrainTags: {
        wall: Number(gameParameters.wallID),
        topWall: Number(gameParameters.topID),
    },
    ambient: toHex(mapParameter.shadowAmbient),
    topAmbient: toHex(mapParameter.topBlockAmbient),
    soft: {
        status: filterParameters.softShadow === 'true',
        strength: Number(filterParameters.softShadowStr),
        quality: Number(filterParameters.softShadowQlt),
    }

};