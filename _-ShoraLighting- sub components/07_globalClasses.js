

/* Game classes for script interfacing. */

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

    PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['filter']);
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
    //const params = JSON.parse(JSON.stringify({...$shoraLayer.LIGHTING[options.name], ...options}));
    const params = {...$shoraLayer.LIGHTING[options.name], ...options};
    if (options.offsetx) params.offset.x = options.offsetx;
    if (options.offsety) params.offset.y = options.offsety;

    this.remove(params.id);
    $gameMap._lighting[params.id] = params;
    $shoraLayer.lighting.addLight(params);
}

/**
 * Remove a lighting instance from scene.
 * @param {Number} id 
 */
 GameLighting.prototype.remove = function(id) {
    if ($gameMap._lighting[id]) {
        $shoraLayer.lighting.removeLight(id);
        $gameMap._lighting[id] = null;
    }
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

GameLighting.prototype.setShadowAmbient = function(color) {
    this.shadowAmbient = color.toHexValue();
}

GameLighting.prototype.setTopBlockAmbient = function(color) {
    this.topBlockAmbient = color.toHexValue();
}

GameLighting.prototype.width = function() {
    return Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
}

GameLighting.prototype.height = function() {
    return Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);
}

GameLighting.prototype.setStatus = function(id, status) {
    if (!$shoraLayer.lighting.lights[id] || status === '') return;
    $gameMap._lighting[id].status = 
    $shoraLayer.lighting.lights[id].status = status === 'true' || status === 'on';
    $shoraLayer.lighting.lights[id].renderable = true;
}

GameLighting.prototype.setRadius = function(id, radius, time, type) {
    if (!$shoraLayer.lighting.lights[id] || radius === '') return;
    $shoraLayer.lighting.lights[id].setRadius(Number(radius) / 100, Number(time), Number(type));
}

GameLighting.prototype.setAngle = function(id, angle, time, type) {
    if (!$shoraLayer.lighting.lights[id] || angle === '') return;
    $shoraLayer.lighting.lights[id].setAngle(Number(angle) / 57.6, Number(time), Number(type));
}

GameLighting.prototype.setShadow = function(id, status) {
    if (!$shoraLayer.lighting.lights[id] || status === '') return;
    $shoraLayer.lighting.lights[id].setShadow(status === 'true' || status === 'on');
}

GameLighting.prototype.setOffset = function(id, x, y, time, type) {
    if (!$shoraLayer.lighting.lights[id]) return;
    $shoraLayer.lighting.lights[id].setOffset(Number(x), Number(y), Number(time), Number(type));
}

GameLighting.prototype.setOffsetX = function(id, x, time, type) {
    if (!$shoraLayer.lighting.lights[id] || x === '') return;
    $shoraLayer.lighting.lights[id].setOffsetX(Number(x), Number(time), Number(type));
}

GameLighting.prototype.setOffsetY = function(id, y, time, type) {
    if (!$shoraLayer.lighting.lights[id] || y === '') return;
    $shoraLayer.lighting.lights[id].setOffsetY(Number(y), Number(time), Number(type));
}

GameLighting.prototype.setTint = function(id, color, time, type) {
    if (!$shoraLayer.lighting.lights[id] || color === '') return;
    $shoraLayer.lighting.lights[id].setTint(color.toHexValue(), Number(time), Number(type));
}

GameLighting.prototype.addStaticLight = function(x, y, name) {
    return; // TODO
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

GameLighting.prototype.temporarySetPluginState = function(status) {
    if (status) {
        if (SceneManager._scene._spriteset)
            $shoraLayer.loadScene(SceneManager._scene._spriteset);
    } else {
        if (SceneManager._scene._spriteset)
            $shoraLayer.removeScene(SceneManager._scene._spriteset);
    }
}

GameLighting.prototype.enable = function() {
    if (!this._disabled) return;
    this._disabled = false;
    if (SceneManager._scene._spriteset)
        $shoraLayer.loadScene(SceneManager._scene._spriteset);
}

GameLighting.prototype.disable = function() {
    if (this._disabled) return;
    this._disabled = true;
    if (SceneManager._scene._spriteset)
        $shoraLayer.removeScene(SceneManager._scene._spriteset);
}

class ShadowCaster {
    constructor(p, height) {
        this.height = height;
        this.segments = [];
        for (let i = 0; i < p.length - 1; ++i)
            this.segments.push([p[i], p[i + 1]]);
        this.segments.push([p[p.length - 1], p[0]]);
    }
}

class GameShadow {
    constructor() {
        this.segments = [];
        this.lowerWalls = [];

        // this.customCasters = []; TODO

        this._upperGraphics = new PIXI.Graphics();
        this._upperTexture = PIXI.RenderTexture.create();
        this.upper = new PIXI.Sprite(this._upperTexture);

        this.haveIgnoreShadow = false;
        this._ignoreGraphics = new PIXI.Graphics();
        this._ignoreTexture = PIXI.RenderTexture.create();
        this.ignore = new PIXI.Sprite(this._ignoreTexture);

        // this._upperGraphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    }

    refresh() {
        this.clear();
        this.scanMapCaster();
		this.createSegments();
    }

    clear() {
        this.segments = [];
        this.lowerWalls = [];

        this._upperGraphics.clear();
        this._upperTexture.resize($gameLighting.width(), $gameLighting.height());

        this._ignoreGraphics.clear();
        this._ignoreTexture.resize($gameLighting.width(), $gameLighting.height());
    }


    scanMapCaster() {
        const width = $gameMap.width(),
              height = $gameMap.height(),
              tw = $gameMap.tileWidth(),
              th = $gameMap.tileHeight(),
              regionStart = $shoraLayer._regionStart,
              regionEnd = $shoraLayer._regionEnd,
              topRegionId = $shoraLayer._topRegionId,
              ignoreShadowsId = $shoraLayer._ignoreShadowsId,
              wallID = $shoraLayer._wallID || 1,
              topID = $shoraLayer._topID || 2;


        this.map = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));
        this.lower = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));

        let id, h;

        for (let x = 0; x < width; ++x) {
            h = 0;
            for (let y = height - 1; y >= 0; --y) {
                id = $gameMap.terrainTag(x, y);
                if (id == wallID) {
                    if (y !== height - 1 && $gameMap.terrainTag(x, y + 1) !== wallID) h = 0;
                    h += 1;
                } else if (id == topID) {
                    this.map[y][x] = h + 1;
                } else {
                    h = 0;
                }
            }
        }

        // drawing 
        this._upperGraphics.beginFill($gameLighting.topBlockAmbient);
        this._ignoreGraphics.beginFill(0xffffff);

        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                id = $gameMap.regionId(j, i);
                if (regionStart <= id && id <= regionEnd) {
                    if (!this.map[i][j]) {
                        this.map[i][j] = id - regionStart + 1; 
                    }
                }
                if (id === topRegionId) {
                    this._upperGraphics.drawRect(j * tw, i * th, tw, th);
                }
                if (id === ignoreShadowsId) {
                    this.haveIgnoreShadow = true;
                    this._ignoreGraphics.drawRect(j * tw, i * th, tw, th);
                }
            }
        }

        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                h = this.map[i][j];
                if (!h) continue;
                this._upperGraphics.drawRect(j * tw, i * th, tw, th);
                if (i + h - 1 < height) this.lower[i + h - 1][j] = h - 1; 
            }
        }

        this._upperGraphics.endFill();
        this._ignoreGraphics.endFill();
        Graphics.app.renderer.render(this._upperGraphics, this._upperTexture);
        Graphics.app.renderer.render(this._ignoreGraphics, this._ignoreTexture);

    }

    check(y, x1, x2) {
        if (y === 0) return 0;
        if (x1 > x2) [x1, x2] = [x2, x1];

        let tw = $gameMap.tileWidth(),
            th = $gameMap.tileHeight();
        // todo: check for custom shadow cast
        if (y % th !== 0) {
            // custom
            return 0;
        }

        // todo: check for differ continous height
        // wait how did it not bug this part
        
        // how?
        y = y / th - 1;
        return Math.min(this.lower[y][Math.floor(x1 / tw)], this.lower[y][Math.ceil(x2 / tw) - 1]);
    }


    outOfBound(x, y) {
		return x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length;
    }
    
    addUpperSegment(x, y, h, vert, horz) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		horz.push([x * tw, (y + h) * th, (x + 1) * tw, (y + h) * th]);
    }
    
    addLowerSegment(x, y, h, vert, horz) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		horz.push([(x + 1) * tw, (y + h + 1) * th, x * tw, (y + h + 1) * th]);
        // lower walls
		this.lowerWalls.push([(x + 1) * tw, (y + h + 1) * th, x * tw, (y + h + 1) * th, h]);
    }
    
    addRightSegment(x, y, h, vert, horz) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		vert.push([(x + 1) * tw, (y + h) * th, (x + 1) * tw, (y + h + 1) * th]);
    }
    
    addLeftSegment(x, y, h, vert, horz) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		vert.push([x * tw, (y + h) * th, x * tw, (y + h + 1) * th]);
    }
    
    addCaster(x, y, h, vert, horz) {
		// Check left of this postion.
		if (!this.outOfBound(x, y - 1) && this.map[y - 1][x]) {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				if (this.map[y][x - 1] !== h + 1) {
					this.addLeftSegment(x, y, h, vert, horz);
				} 
			}
		} else {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				this.addUpperSegment(x, y, h, vert, horz);
				// Check left of this postion.
				if (this.map[y][x - 1] !== h + 1) {
					this.addLeftSegment(x, y, h, vert, horz);
				} 
			} 
		} 

		// Check right of this postion.
		if (!this.outOfBound(x + 1, y)) {
			if (this.map[y][x + 1] !== h + 1) {
				this.addRightSegment(x, y, h, vert, horz);
			}
		}

		// Check lower of this postion.
		if (!this.outOfBound(x, y + 1)) {
			if (this.map[y + 1][x] !== h + 1) {
				this.addLowerSegment(x, y, h, vert, horz);
			}
		}
    }
    
    mergeHorizontalSegments(a) {
        // y = s[1] = s[3], quan ly doan [s[0], s[2]]
        for (let i = 0; i < a.length; ++i)
            if (a[i][0] > a[i][2]) [a[i][0], a[i][2]] = [a[i][2], a[i][0]];
        let cmp = function(u, v) {
            if (u[1] == v[1])
                return u[0] < v[0] ? -1 : 1;
            return u[1] < v[1] ? -1 : 1;
        }
        a.sort(cmp);
        let res = [];
        for (let i = 0; i < a.length;) {
            let j = i + 1, cur = a[i][2];
            while (j < a.length && a[j][1] == a[i][1] && a[j][0] <= cur) 
                cur = Math.max(cur, a[j][2]), j++;
            j--;
            res.push([a[i][0], a[i][1], cur, a[i][3]]);
            i = j + 1;
        }
        return res;
    }

    mergeVerticalSegments(a) {
        // x = s[0] = s[2], quan ly doan [s[1], s[3]]
        for (let i = 0; i < a.length; ++i)
            if (a[i][1] > a[i][3]) [a[i][1], a[i][3]] = [a[i][3], a[i][1]];
        let cmp = function(u, v) {
            if (u[0] == v[0])
                return u[1] < v[1] ? -1 : 1;
            return u[0] < v[0] ? -1 : 1;
        }
        a.sort(cmp);
        let res = [];
        for (let i = 0; i < a.length;) {
            let j = i + 1, cur = a[i][3];
            while (j < a.length && a[j][0] == a[i][0] && a[j][1] <= cur) 
                cur = Math.max(cur, a[j][3]), j++;
            j--;
            res.push([a[i][0], a[i][1], a[i][2], cur]);
            i = j + 1;
        }
        return res;
    }

    mergeLowerWalls(a) {
        // y = s[1] = s[3], quan ly doan [s[2], s[0]]
        let cmp = function(u, v) {
            if (u[1] == v[1])
                return u[0] > v[0] ? -1 : 1;
            return u[1] < v[1] ? -1 : 1;
        }
        a.sort(cmp);
        let res = [];
        for (let i = 0; i < a.length;) {
            let j = i + 1, cur = a[i][2];
            while (j < a.length && a[j][1] == a[i][1] && a[j][4] == a[i][4] && a[j][0] >= cur) 
                cur = Math.min(cur, a[j][2]), j++;
            j--;
            res.push([a[i][0], a[i][1], cur, a[i][3], a[i][4]]);
            i = j + 1;
        }
        return res;
    }
    
    createSegments() {

        let vert = [], horz = [];

		for (var y = 0; y < this.map.length; y++) {
			for (var x = 0; x < this.map[y].length; x++) {
				if (this.map[y][x]) {
					this.addCaster(x, y, this.map[y][x] - 1, vert, horz);
				}
			}
		}

        this.segments = ShadowSystem.getSegments(
                            this.mergeVerticalSegments(vert).concat(
                            this.mergeHorizontalSegments(horz)
                            ));

		// Lower walls
        this.lowerWalls = this.mergeLowerWalls(this.lowerWalls);
        this.lowerWalls.sort((a, b) => b[0] - a[0]);
    }
    
    worldToScreenX(x) {
        return Math.round($gameMap.adjustX(x));
    }

    worldToScreenY(y) {
        return Math.round($gameMap.adjustY(y));
    }

    getWallHeight(x, y) {
        let tw = $gameMap.tileWidth(), eps = 0.1; // tw * h + 6 + eps
        for (const [x2, y2, x1, y1, h] of this.lowerWalls) {
            if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                return y1 - y + eps;
            }
        }
        return 0;
    }
}

$gameShadow = new GameShadow();