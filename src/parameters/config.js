import { pluginName } from "./header";
import { ColorManager } from "../core/utils";

const engineParameters = PluginManager.parameters(pluginName);

const mapConfig = JSON.parse(engineParameters['Map']);
const gameConfig = JSON.parse(engineParameters['Game']);
const helperConfig = JSON.parse(engineParameters['helper']);
const filterConfig = JSON.parse(engineParameters['filter']);

export const engineName = Number(PIXI.VERSION[0]) < 5 ? 'MV' : 'MZ';

const colors = JSON.parse(helperConfig.colors);

for (const colorJSON of colors) {
    const color = JSON.parse(colorJSON);
    ColorManager.register(color.name, color.color);
}

export const lightConfig = {
    ambient: ColorManager.stringToHex(mapConfig.ambient),
    intensity: {
        status: true,
        strength: 1,
    },

};

export const shadowConfig = {
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