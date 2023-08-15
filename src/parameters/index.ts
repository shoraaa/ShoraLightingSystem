
import { PluginManager } from 'rmmz';
import { VERSION } from 'pixi.js';

import { pluginName } from './header';
import { Color } from '../core/color';

import ShadowParameters from './ShadowParameters';
import LightParameters from './LightParameters';

const engineParameters: any = PluginManager.parameters(pluginName);

const mapParameter: any = JSON.parse(engineParameters['Map']);
const gameParameters: any = JSON.parse(engineParameters['Game']);
const helperParameters: any = JSON.parse(engineParameters['helper']);
const filterParameters: any = JSON.parse(engineParameters['filter']);

export const engineName: string = Number(VERSION[0]) < 5 ? 'MV' : 'MZ';

const colors = JSON.parse(helperParameters.colors);

for (const colorJSON of colors) {
    const color = JSON.parse(colorJSON);
    Color.register(color.name, color.color);
}

export const lightParameters: LightParameters = {
    ambient: Color.toHex(mapParameter.ambient),
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
    ambient: Color.toHex(mapParameter.shadowAmbient),
    topAmbient: Color.toHex(mapParameter.topBlockAmbient),
    soft: {
        status: filterParameters.softShadow === 'true',
        strength: Number(filterParameters.softShadowStr),
        quality: Number(filterParameters.softShadowQlt),
    }

};