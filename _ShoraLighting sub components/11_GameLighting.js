// ES5 class for save/load.

function GameLighting() {
    this.initialize(...arguments);
}

GameLighting.prototype.constructor = GameLighting;

GameLighting.prototype.initialize = function() {
    /* MV ONLY */
    if (Shora.Lighting.PARAMETERS.version.toUpperCase() == 'MV')
        Shora.MVOverload();
    

    this.LIGHTING = {};
    this.loadParameters();
    this.loadLighting();
}

GameLighting.prototype.loadParameters = function() {
    let PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Map']);
    this.ambient = PARAMETERS.ambient.toHexValue();
    this.shadowAmbient = PARAMETERS.shadowAmbient.toHexValue();
    this.topBlockAmbient = PARAMETERS.topBlockAmbient.toHexValue();
    
    let GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
    this.regionStart = Number(GAME_PARAMETERS.regionStart);
    this.regionEnd = Number(GAME_PARAMETERS.regionEnd);
    this.topRegionId = Number(GAME_PARAMETERS.topRegionId);
    this.ignoreShadowsId = Number(GAME_PARAMETERS.ignoreShadowsId);
}

GameLighting.prototype.loadLighting = function() {
    // add default light
    this.addLighting(Shora.Lighting.PARAMETERS['default']);
    // add custom light
    this.addCustomLighting(Shora.Lighting.PARAMETERS['LightList']);
}

GameLighting.prototype.addCustomLighting = function(list) {
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
GameLighting.prototype.addLighting = function(settings) {
    const parameters = JSON.parse(settings);
    let name = parameters.name;
    if (name == "") {
        console.warn('Lighting name field cannot be left empty. Cancelling register process.'); 
        return;
    }
    console.log('Lighting ' + name + ' is having registered');

    parameters.status = parameters.status !== 'false';

    parameters.direction = parameters.direction === 'true';
    parameters.tint = parameters.tint.toHexValue();
    parameters.bwall = parameters.bwall === 'true';
    parameters.shadow = parameters.shadow === 'true';
    parameters.static = parameters.static === 'true';
    
    parameters.shadowambient = 
        parameters.shadowambient == "" ?  
        this.shadowAmbient :
        parameters.shadowambient.toHexValue();

    parameters.offset = JSON.parse(parameters.offset);
    for (const p in parameters.offset) {
        parameters.offset[p] = Number(parameters.offset[p]);
    }

    parameters.shadowoffsetx = Number(parameters.shadowoffsetx);
    parameters.shadowoffsety = Number(parameters.shadowoffsety);
    
    parameters.colorfilter = JSON.parse(parameters.colorfilter);
    parameters.colorfilter.hue = Number(parameters.colorfilter.hue);
    parameters.colorfilter.brightness = Number(parameters.colorfilter.brightness);
    parameters.colorfilter.colortone = parameters.colorfilter.colortone.toRGBA();
    parameters.colorfilter.blendcolor = parameters.colorfilter.blendcolor.toRGBA();

    parameters.animation = JSON.parse(parameters.animation);
    for (const p in parameters.animation) {
        if (p[0] === '.') continue;
        parameters.animation[p] = JSON.parse(parameters.animation[p]);
        for (let a in parameters.animation[p]) {
            parameters.animation[p][a] = JSON.parse(parameters.animation[p][a]);
        }
    }

    parameters.name = name;
    this.LIGHTING[name] = parameters;
}

/**
 * Add a lighting instance to scene.
 * 
 * @param {Game_Character} character 
 * @param {Object} options 
 */
GameLighting.prototype.add = function(options) {
    if (!this.LIGHTING[options.name]) {
        Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
        options.name = 'default';
    }
    const params = {...this.LIGHTING[options.name], ...options};
    this.remove(params.id);
    $gameMap._lighting[params.id] = params;
    return $shoraLayer.lighting.addLight(params);
}

/**
 * Remove a lighting instance from scene.
 * @param {Number} id 
 */
 GameLighting.prototype.remove = function(id) {
    if ($gameMap._lighting[id])
        $shoraLayer.lighting.removeLight(id),
        $gameMap._lighting[id] = null;
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

GameLighting.prototype.setShadowAmbient = function(color, time) {
    this.shadowAmbient = color.toHexValue();
}

GameLighting.prototype.setTopBlockAmbient = function(color, time) {
    this.topBlockAmbient = color.toHexValue();
}

GameLighting.prototype.width = function() {
    return Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
}

GameLighting.prototype.height = function() {
    return Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);
}

GameLighting.prototype.setStatus = function(id, status) {
    $gameMap._lighting[id].status = 
    $shoraLayer.lighting.lights[id].status = status;
    $shoraLayer.lighting.lights[id].renderable = true;
}

GameLighting.prototype.setOffset = function(id, x, y, time, type) {
    $shoraLayer.lighting.lights[id].setOffset(x, y, time, type);
}

GameLighting.prototype.setOffsetX = function(id, x, time, type) {
    $shoraLayer.lighting.lights[id].setOffsetX(x, time, type);
}

GameLighting.prototype.setOffsetY = function(id, y, time, type) {
    $shoraLayer.lighting.lights[id].setOffsetY(y, time, type);
}

GameLighting.prototype.setColor = function(id, color, time) {
    $shoraLayer.lighting.lights[id].setColor(color, time);
}

