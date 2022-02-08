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
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];
        this.ignoreShadows = [];
        this.topWalls = []; // for fallback to draw each top wall
        this.customCasters = [];

        this._upperWalls = new PIXI.Graphics();
        this._upperWallsTexture = PIXI.RenderTexture.create();
        this.upperWalls = new PIXI.Sprite(this._upperWallsTexture);
        // this._upperWalls.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    }

    refresh() {
        this.segments = [];
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];
        this._upperWalls.clear();
        this._upperWallsTexture.resize($gameLighting.width(), $gameLighting.height());
        this.scanMapCaster();
		this.createSegments();
    }
    
    scanMapCaster() {
        this.map = new Array($gameMap.height())
            .fill(0)
            .map(() => new Array($gameMap.width()).fill(0));

        let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
        let regionStart = $shoraLayer._regionStart;
        let regionEnd = $shoraLayer._regionEnd;
        let topRegionId = $shoraLayer._topRegionId;
        let ignoreShadowsId = $shoraLayer._ignoreShadowsId;
        
        this._upperWalls.beginFill($gameLighting.topBlockAmbient);
        let flag = false, begin = 0, width = 0;
        for (var i = 0; i < $gameMap.height(); ++i) {
            this.topWalls.push([]);
            for (var j = 0; j < $gameMap.width(); ++j) {
                if (regionStart <= $gameMap.regionId(j, i) && $gameMap.regionId(j, i) <= regionEnd) {
                    this.map[i][j] = $gameMap.regionId(j, i) - regionStart + 1; 
                }
                if ((regionStart <= $gameMap.regionId(j, i) && $gameMap.regionId(j, i) <= regionEnd) || $gameMap.regionId(j, i) == topRegionId) {
                    this._upperWalls.drawRect(j * tw, i * th, tw, th);
                    /*
                    if (!flag) {
                        flag = true;
                        begin = j * 48;
                    }
                    width += 48;
                } else if (flag) {
                    flag = false;
                    this.topWalls[i].push([begin, begin+width]);
                    width = 0;
                    */
                }
                if ($gameMap.regionId(j, i) == ignoreShadowsId) 
                    this.ignoreShadows.push([j * tw, i * tw]);
            }
        }
        this._upperWalls.endFill();
        Graphics.app.renderer.render(this._upperWalls, this._upperWallsTexture);
    }

    outOfBound(x, y) {
		return x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length;
    }
    
    addUpperSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.horizontalSegments.push([x * tw, (y + height) * th, (x + 1) * tw, (y + height) * th]);
    }
    
    addLowerSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.horizontalSegments.push([(x + 1) * tw, (y + height + 1) * th, x * tw, (y + height + 1) * th]);
		this.lowerWalls.push([(x + 1) * tw, (y + height + 1) * th, x * tw, (y + height + 1) * th, height]);
    }
    
    addRightSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.verticalSegments.push([(x + 1) * tw, (y + height) * th, (x + 1) * tw, (y + height + 1) * th]);
    }
    
    addLeftSegment(x, y, height) {
		let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
		this.verticalSegments.push([x * tw, (y + height) * th, x * tw, (y + height + 1) * th]);
    }
    
    addCaster(x, y, height) {
		// Check left of this postion.
		if (!this.outOfBound(x, y - 1) && this.map[y - 1][x]) {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				if (!this.map[y][x - 1]) {
					this.addLeftSegment(x, y, height);
				} 
			}
		} else {
			// Check upper of this postion.
			if (!this.outOfBound(x - 1, y)) {
				this.addUpperSegment(x, y, height);
				// Check left of this postion.
				if (!this.map[y][x - 1]) {
					this.addLeftSegment(x, y, height);
				} 
			} 
		} 

		// Check right of this postion.
		if (!this.outOfBound(x + 1, y)) {
			if (!this.map[y][x + 1]) {
				this.addRightSegment(x, y, height);
			}
		}

		// Check lower of this postion.
		if (!this.outOfBound(x, y + 1)) {
			if (!this.map[y + 1][x]) {
				this.addLowerSegment(x, y, height);
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
		for (var y = 0; y < this.map.length; y++) {
			for (var x = 0; x < this.map[y].length; x++) {
				if (this.map[y][x]) {
					this.addCaster(x, y, this.map[y][x] - 1);
				}
			}
		}

		// Shadow Casters
        this.verticalSegments = this.mergeVerticalSegments(this.verticalSegments);
        this.horizontalSegments = this.mergeHorizontalSegments(this.horizontalSegments);

        // this.segments = this.horizontalSegments.concat(this.verticalSegments);
        // for (const caster of this.customCasters)
        //     this.segments = this.segments.concat(caster.segments);

		this.segments = ShadowSystem.getSegments(this.horizontalSegments.concat(this.verticalSegments));

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
        let tw = $gameMap.tileWidth(), eps = 0.0001; // tw * h + 6 + eps
        for (const [x2, y2, x1, y1, h] of this.lowerWalls) {
            if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                return y1 - y + eps;
            }
        }
        return 0;
    }
}

$shoraLayer = new Layer();
$gameShadow = new GameShadow();
