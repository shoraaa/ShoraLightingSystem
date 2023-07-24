
/* Override MV/MZ functions. */

// Sprite
((_) => {
    _.addFilter = function(filter) {
        if (!this.filters) this.filters = [filter];
        else this.filters.push(filter);
    }
})(Sprite.prototype); 


// DataManger
((_) => {
    const createGameObjects = _.createGameObjects;
    _.createGameObjects = function() {
        $gameLighting = new GameLighting();
        $shoraLayer = new Layer();
        createGameObjects();
        $shoraLayer.reset();
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
        if (!contents.lighting) 
            $gameLighting = new GameLighting();
    }

})(DataManager); 


// Spriteset_Map
((_) => {
    _.type = () => 'map';
    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) 
            $shoraLayer.removeScene(this);
        destroy.call(this, options);
    }
    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        if (!$gameLighting._disabled)
            $shoraLayer.loadScene(this);
        createUpperLayer.call(this);
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        if (!$gameLighting._disabled)
            $shoraLayer.update();
    }
})(Spriteset_Map.prototype);


// Spriteset_Battle
((_) => {
    _.type = () => 'battle';
    const destroy = _.destroy;
    _.destroy = function(options) {
        if ($shoraLayer.lighting) 
            $shoraLayer.removeScene(this);
        destroy.call(this, options);
    }
    const createUpperLayer = _.createUpperLayer;
    _.createUpperLayer = function() {
        if (!$gameLighting._disabled && !$gameLighting._battleLightingDisabled)
            $shoraLayer.loadScene(this);
        createUpperLayer.call(this);
    }

    const update = _.update;
    _.update = function() {
        update.call(this);
        if (!$gameLighting._disabled && !$gameLighting._battleLightingDisabled)
            $shoraLayer.update();
    }
})(Spriteset_Battle.prototype);


// Game_Map
((_) => {
    const setup = _.setup;
    _.setup = function(mapId) {
        setup.call(this, mapId);
        this._lighting = [];
        this._staticLighting = [];
        if ($dataMap) {
            this.scanNoteTags($dataMap.note.split('\n'));
            this.scanTileNoteTag(this.tileset().note.split('\n'));
        }
    }

    _.scanNoteTags = function(lines) {

        this.lightingState = !$gameLighting._disabled, 
        this.lightingAmbient = $gameLighting.ambient;

        for (command of lines) {
            command = command.match(Shora.REGEX.COMMAND);
            if (!command) continue;
            switch (command[1].toLowerCase()) {
                case 'lighting':
                    this.lightingState = command[2] === 'on';
                    break;
                case 'ambient': 
                    this.lightingAmbient = command[2].toHexValue();;
                    break;
            }
        }

    }

    _.scanTileNoteTag = function() {
        //
    }

})(Game_Map.prototype);

// Game_Character
((_) => {
    // NEED REWORK
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
        let lightingParams = {id: 0};
        if ($gameParty.leader())
            note = $gameParty.leader().actor().note.split('\n');
        for (let line of note)
            Shora.CallCommand(lightingParams, line);
        if (lightingParams.name) {
            this.setLighting(lightingParams);
        } else {
        	lightingParams = {id: 0};
            for (const item of $gameParty.items()) {
                const note = item.note.split('\n');
                for (let line of note)
                    Shora.CallCommand(lightingParams, line);
                if (lightingParams.name) 
                    return this.setLighting(lightingParams);
            }
        	this.hasLight = false;
        }
    }
    _.setLighting = function(params) {
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
        this.lightingParams = {};
        this.page().list.forEach((comment) => {
            if (comment.code === 108 || comment.code === 408) 
                Shora.CallCommand(this.lightingParams, comment.parameters.join(''));
        });
        this.lightingParams.id = this._eventId;
        this.hasLight = !!this.lightingParams.name;
    }

})(Game_Event.prototype);
