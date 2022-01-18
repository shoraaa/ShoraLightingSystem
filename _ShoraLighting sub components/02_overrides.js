// RPGM Override

// DataManger

((_) => {
    const createGameObjects = _.createGameObjects;
    _.createGameObjects = function() {
        createGameObjects();
        $shoraLayer.mapId = 0;
        $gameLighting = new GameLighting();
    }
    const makeSaveContents = _.makeSaveContents;
    _.makeSaveContents = function() {
        const contents = makeSaveContents();
        contents.lighting = $gameLighting;
        return contents;
    }

    const extractSaveContents = _.extractSaveContents;
    _.extractSaveContents = function(contents) {
        extractSaveContents(contents);
        $gameLighting = contents.lighting;
    }

})(DataManager); 


// Spriteset_Map
((_) => {
    _.type = () => 'map';

    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) 
            this.removeChild($shoraLayer.lighting.lightSprite);
        destroy.call(this, options);
    }

    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        createUpperLayer.call(this);
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
        this._lighting = [];
        if ($dataMap) {
            this.scanNoteTags($dataMap.note.split('\n'));
            this.scanTileNoteTag(this.tileset().note.split('\n'));
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
        this.updateLighting();
    }

    _.updateLighting = function() {
        if (this.hasLight && !this.lighting) {
            $gameLighting.add(this.lightingParams)
            this.lighting = 1;
        }
        if (!this.hasLight && this.lighting) {
            $gameLighting.remove(this._eventId || 0);
            this.lighting = null;
            this.lightingParams = {};
        }
    }

})(Game_Character.prototype);

// Game_Party
((_) => {
    const gainItem = _.gainItem;
    _.gainItem = function(item, amount, includeEquip) {
        gainItem.call(this, item, amount, includeEquip);
        $gamePlayer.scanLighting();
    }

})(Game_Party.prototype);

// Game_Player
((_) => {
    const refresh = _.refresh;
    _.refresh = function() {
        refresh.call(this);
        this.scanLighting();
    }
    _.scanLighting = function() {
        let note = '';
        if ($gameParty.leader()){
            note = $gameParty.leader().actor().note.split('\n');
        }
        let lightingParams = { id: 0, auto: true };
        for (let line of note) {
            Shora.CallCommand(lightingParams, line);
        }
        if (lightingParams.name) {
            this.setLighting(lightingParams);
        } else {
        	let lightingParams = { id: 0, auto: true };
            for (const item of $gameParty.items()) {
                const note = item.note.split('\n');
                for (let line of note) {
                    Shora.CallCommand(lightingParams, line);
                }
            }
            if (lightingParams.name) {
                this.setLighting(lightingParams);
        	} else this.hasLight = false;
        }
    }
    _.setLighting = function(params) {
        params.static = false;
        if (this.hasLight) {
            this.hasLight = false;
            this.updateLighting();
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

