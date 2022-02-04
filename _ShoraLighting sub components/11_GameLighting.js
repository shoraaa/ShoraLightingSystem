// ES5 class for save/load.

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
    const params = {...$shoraLayer.LIGHTING[options.name], ...options};
    this.remove(params.id);
    $gameMap._lighting[params.id] = params;
    $shoraLayer.lighting.addLight(params);
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
    if (!$shoraLayer.lighting.lights[id]) return;
    $gameMap._lighting[id].status = 
    $shoraLayer.lighting.lights[id].status = status;
    $shoraLayer.lighting.lights[id].renderable = true;
}

GameLighting.prototype.setOffset = function(id, x, y, time, type) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setOffset(x, y, time, type);
}

GameLighting.prototype.setOffsetX = function(id, x, time, type) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setOffsetX(x, time, type);
}

GameLighting.prototype.setOffsetY = function(id, y, time, type) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setOffsetY(y, time, type);
}

GameLighting.prototype.setColor = function(id, color, time) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setColor(color, time);
}

GameLighting.prototype.addStaticLight = function(x, y, name) {
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

GameLighting.prototype.enable = function() {
    this._disabled = false;
    $shoraLayer.loadScene();
}

GameLighting.prototype.disable = function() {
    this._disabled = true;
    $shoraLayer.removeScene();
}

