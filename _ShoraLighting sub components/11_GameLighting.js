class GameLighting {
    constructor() {
        this.LIGHTING = {};
        this.loadParameters();
        this.loadLighting();
    }

    loadParameters() {
        this.PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Map']);
        this.PARAMETERS.ambient = this.PARAMETERS.ambient.toHexValue();
        this.PARAMETERS.shadowAmbient = this.PARAMETERS.shadowAmbient.toHexValue();
        this.PARAMETERS.topBlockAmbient = this.PARAMETERS.topBlockAmbient.toHexValue();
        
        this.GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
        this.GAME_PARAMETERS.regionStart = Number(this.GAME_PARAMETERS.regionStart);
    }

    loadLighting() {
        // add default light
        this.addLighting(Shora.Lighting.PARAMETERS['default']);
        // add custom light
        this.addCustomLighting(Shora.Lighting.PARAMETERS['LightList']);
    }

    addCustomLighting(list) {
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
    addLighting(settings) {
        const parameters = JSON.parse(settings);
        let name = parameters.name;
        if (name == "") {
            console.warn('Lighting name field cannot be left empty. Cancelling register process.'); 
            return;
        }
        console.log('Lighting ' + name + ' has been registered');
        parameters.direction = parameters.direction === 'true';
        parameters.tint = parameters.tint.toHexValue();
        parameters.bwall = parameters.bwall === 'true';
        parameters.shadow = parameters.shadow === 'true';
        parameters.static = parameters.static === 'true';
        
        parameters.shadowambient = 
        	parameters.shadowambient == "" ?  
        	this.PARAMETERS.shadowAmbient :
        	parameters.shadowambient.toHexValue();

        parameters.offset = JSON.parse(parameters.offset);
        for (const p in parameters.offset) {
            parameters.offset[p] = Number(parameters.offset[p]);
        }

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
     * A list of lights of map.
     */
    get lighting() {
        return $gameMap._lighting;
    }

    /**
     * Add a lighting instance to scene.
     * 
     * @param {Game_Character} character 
     * @param {Object} options 
     */
    add(options) {
        if (!this.LIGHTING[options.name]) {
            Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
            options.name = 'default';
        }
        const params = {...this.LIGHTING[options.name], ...options};
        this.remove(params.id);
        this.lighting.push(params);
        return $shoraLayer.lighting.addLight(params);
    }

    /**
     * Remove a lighting instance from scene.
     * @param {Number} id 
     */
    remove(id) {
        let i;
        if ((i = this.lighting.findIndex(light => light.id === id)) !== -1) {
            this.lighting.splice(i, 1);
            $shoraLayer.lighting.removeLight(id);
        }
    }

    inDisplay(minX, minY, maxX, maxY) {
        return maxX >= this.minX && minX <= this.maxX && maxY >= this.minY && minY <= this.maxY;
    } 

    // update
    updateDisplay() {
        this.minX = 0; // todo
        this.minY = 0;
        this.maxX = Graphics._width;
        this.maxY = Graphics._height;
    }

    // command
    setMapAmbient(color, time) {
        $shoraLayer.lighting.setMapAmbient(color.toHexValue(), Number(time) || 1);
    }

    setShadowAmbient(color, time) {
    	this.PARAMETERS.shadowAmbient = color.toHexValue();
    }

    setTopBlockAmbient(color, time) {
    	this.PARAMETERS.topBlockAmbient = color.toHexValue();
    }


    // params
    shadowColor() {
        return this.PARAMETERS.ambient;
    }

    regionStart() {
        return this.GAME_PARAMETERS.regionStart;
    }

    width() {
        return Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
    }

    height() {
        return Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);
    }

    setOffsetX(id, value, time, type) {
        $shoraLayer.lighting.lights[id].setOffsetX(value, time, type);
    }

    setOffsetY(id, value, time, type) {
        $shoraLayer.lighting.lights[id].setOffsetY(value, time, type);
    }

    setColor(id, value, time) {
        $shoraLayer.lighting.lights[id].setColor(value, time);
    }
}

$gameLighting = new GameLighting();

