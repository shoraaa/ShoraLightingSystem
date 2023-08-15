
import { PluginManager, PIXI } from 'rmmz';

import { pluginName } from './header';
import { toHex } from '../color';

import ShadowParameters from './ShadowParameters';
import LightParameters from './LightParameters';

function stringToHex(color: string): number {
    if (color.length == 6) {
        return parseInt(this, 16);
    }
    return parseInt(color.substr(1), 16);
}

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

export const lightParameters: LightParameters = {
    ambient: stringToHex(mapParameter.ambient),
    intensity: {
        status: true,
        strength: 1,
    },

};

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