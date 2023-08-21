import { shadowConfig } from "../parameters/config";
import { ShadowSystem } from "./ShadowSystem";

class ShadowManager {
    constructor() {
        this.system = ShadowSystem;

        this.transform = new PIXI.Transform();
        this.graphics = new PIXI.Graphics();
        this.renderTexture = PIXI.RenderTexture.create();
        this.sprite = new PIXI.Sprite(this.renderTexture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

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
        const width = Math.max($gameMap.width() * $gameMap.tileWidth(), Graphics.width);
        const height = Math.max($gameMap.height() * $gameMap.tileHeight(), Graphics.height);

        this.segments = [];
        this.lowerWalls = [];

        this._upperGraphics.clear();
        this._upperTexture.resize(width, height);

        this._ignoreGraphics.clear();
        this._ignoreTexture.resize(width, height);
    }


    scanMapCaster() {
        const width = $gameMap.width(),
              height = $gameMap.height(),
              tw = $gameMap.tileWidth(),
              th = $gameMap.tileHeight(),
              regionStart = shadowConfig.regionId.start,
              regionEnd = shadowConfig.regionId.end,
              topRegionId = shadowConfig.regionId.top,
              ignoreShadowsId = shadowConfig.regionId.ignore,
              wallID = shadowConfig.terrainTags.wall || 1,
              topID = shadowConfig.terrainTags.topWall || 2;


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

        this.segments = this.system.getSegments(
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

    drawWall(index, polygon, oy) {
		let [x, y] = polygon[index], last = (index == 0 ? polygon.length - 1 : index - 1);
		let [nx, ny] = polygon[last]; 

        if (y != ny || y > oy) return;

		let tw = $gameMap.tileWidth();

        // 2 possiblities: nx to x is 1 height, or multiple height
        let h = this.check(y, nx, x);
        if (h === 0) return;
        if (h !== -1) {
            this.graphics.lineTo(nx, ny - tw * h)
		 		    .lineTo(x, y - tw * h);
        } else {
            // TODO: walking through mutiple height

        }
        
	}; 

    getShadowGraphics(lighting) {
        const ox = lighting.x + lighting.config.shadowoffsetx + $gameMap.displayX() * $gameMap.tileWidth();
        let oy = lighting.y + lighting.config.shadowoffsety + $gameMap.displayY() * $gameMap.tileHeight();
        
        if (!lighting.config.bwall) {
            oy += this.getWallHeight(ox, oy);
        }

        const bounds = lighting.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + lighting.config.shadowoffsetx;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + lighting.config.shadowoffsety;

        const polygon = this.system.computeViewport(
                        [ox, oy], this.segments,
                        [bounds.left, bounds.top],
                        [bounds.right, bounds.bottom]);
        const tw = $gameMap.tileWidth();

        this.graphics.clear();

        this.graphics.beginFill(shadowConfig.ambient);
		this.graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
		this.graphics.endFill();

		this.graphics.beginFill(0xffffff);
		this.graphics.moveTo(polygon[0][0], polygon[0][1]);
		for (let i = 1; i < polygon.length; ++i) {
            this.drawWall(i, polygon, oy);
            this.graphics.lineTo(polygon[i][0], polygon[i][1]);
        }
        this.graphics.lineTo(polygon[0][0], polygon[0][1]);
        this.drawWall(0, polygon, oy);
		this.graphics.endFill(); 

		//drawing lower-walls
        this.graphics.beginFill(shadowConfig.ambient); 
        let leftBound = bounds.left, rightBound = bounds.right, downBound = bounds.bottom;
		for (let i = 0, l = this.lowerWalls.length; i < l; ++i) {
			let [x2, y2, x1, y1, height] = this.lowerWalls[i];
            if (y1 >= oy && y1-tw*height <= downBound && x1 <= rightBound && x2 >= leftBound) {
                this.graphics.moveTo(x1, y1);
                this.graphics.lineTo(x1, y1-tw*height);
                this.graphics.lineTo(x2, y2-tw*height);
                this.graphics.lineTo(x2, y2);
            }
		}
        this.graphics.endFill();   

        this.transform.pivot.set(ox, oy);
        this.transform.position.set(lighting.width / 2, lighting.height / 2);
        this.transform.updateLocalTransform();
        const transform = this.transform.localTransform;

        this.renderTexture.resize(lighting.width, lighting.height);
        Graphics.app.renderer.render(this.graphics, this.renderTexture, true, transform);
        Graphics.app.renderer.render(this.upper, this.renderTexture, false, transform);


        return this.sprite;
    }


}

export const shadowManager = new ShadowManager();