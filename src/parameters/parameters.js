import { pluginName } from "./header";
import { ColorManager } from "../core/utils";
import { shadowConfig } from "./config";

import { TextureManager } from "../core/utils";

const engineParameters = PluginManager.parameters(pluginName);

const defaultLight = engineParameters['default'];
const customLights = JSON.parse(engineParameters['LightList']);

export const baseLightingConfig = {};

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