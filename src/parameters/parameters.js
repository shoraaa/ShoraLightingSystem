import { pluginName } from "./header";
import { ColorManager } from "../core/utils";
import { shadowConfig } from "./config";

const engineParameters = PluginManager.parameters(pluginName);

const defaultLight = engineParameters['default'];
const customLights = JSON.parse(engineParameters['LightList']);

export const baseLightingConfig = {};

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