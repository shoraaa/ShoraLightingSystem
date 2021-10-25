class GameShadow {
    constructor() {
        this._segments = [];
        this.segments = [];
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];

        this.topWalls = []; // todo
    }

    refresh() {
        this._segments = [];
        this.segments = [];
        this.originalSegments = [];
        this.horizontalSegments = [];
        this.verticalSegments = [];
        this.lowerWalls = [];
        this.originalLowerWalls = [];
        this.upperWalls = new PIXI.Graphics();
        this.scanMapCaster();
		this.createSegments();
    }

    scanMapCaster() {
        this.map = new Array($gameMap.height())
            .fill(0)
            .map(() => new Array($gameMap.width()).fill(0));

        let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
        let regionStart = $gameLighting.regionStart() - 1;
        this.upperWalls.beginFill($gameLighting.PARAMETERS.topBlockAmbient);
        let flag = false, begin = 0, width = 0;
        for (var i = 0; i < $gameMap.height(); ++i) {
            this.topWalls.push([]);
            for (var j = 0; j < $gameMap.width(); ++j) {
                if ($gameMap.regionId(j, i) >= regionStart) {
                    this.map[i][j] = $gameMap.regionId(j, i) - regionStart;
                }
                if (this.map[i][j]) {
                    this.upperWalls.drawRect(j * tw, i * th, tw, th);
                    if (!flag) {
                        flag = true;
                        begin = j * 48;
                    }
                    width += 48;
                } else if (flag) {
                    flag = false;
                    this.topWalls[i].push([begin, begin+width]);
                    width = 0;
                }
            }
        }
        this.upperWalls.endFill();
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
    
    // TODO: binary search
    optimizeSegments(s) {
		for (var i = 0; i < s.length; ++i) {
			let [x1, y1] = [s[i][2], s[i][3]];
			for (var j = 0; j < s.length; ++j) {
				let [x2, y2] = [s[j][0], s[j][1]];
				if (x1 === x2 && y1 === y2) {
					s[i][2] = s[j][2];
					s[i][3] = s[j][3];
					s.splice(j, 1);
					i -= 1;
					break;
				}
			}
		}
    }
    
    createSegments() {
		for (var y = 0; y < this.map.length; y++) {
			for (var x = 0; x < this.map[y].length; x++) {
				if (this.map[y][x]) {
					this.addCaster(x, y, this.map[y][x]);
				}
			}
		}
		// Shadow Casters
		this.optimizeSegments(this.verticalSegments);
		this.optimizeSegments(this.horizontalSegments);
		this._segments = this.horizontalSegments.concat(this.verticalSegments);

		this.segments = ShadowSystem.getSegments(this._segments);
        this.originalSegments = this.segments.map(s => s.map(p => p.map(x => x / 48)));

		// Lower walls
        this.optimizeSegments(this.lowerWalls);
        this.lowerWalls.sort((a, b) => b[0] - a[0]);
        this.originalLowerWalls = this.lowerWalls.map(s => s.map(p => p >= $gameMap.tileWidth() ? p / $gameMap.tileWidth() : p));

        this.globalSegments = JSON.parse(JSON.stringify(this.segments));
        this.globalLowerWalls = JSON.parse(JSON.stringify(this.lowerWalls));
    }
    
    screenX(x) {
        let tw = $gameMap.tileWidth();
        return Math.round($gameMap.adjustX(x) * tw);
    }

    screenY(y) {
        let th = $gameMap.tileHeight();
        return Math.round($gameMap.adjustY(y) * th);
    }

    update() {
        // Update segments
        for (let i = 0; i < this.segments.length; ++i) {
            this.segments[i][0][0] = this.screenX(this.originalSegments[i][0][0]);
            this.segments[i][0][1] = this.screenY(this.originalSegments[i][0][1]);
            this.segments[i][1][0] = this.screenX(this.originalSegments[i][1][0]);
            this.segments[i][1][1] = this.screenY(this.originalSegments[i][1][1]);
        }
        // Update lower walls
        for (let i = 0; i < this.lowerWalls.length; ++i) {
            this.lowerWalls[i][0] = this.screenX(this.originalLowerWalls[i][0]);
            this.lowerWalls[i][1] = this.screenY(this.originalLowerWalls[i][1]);
            this.lowerWalls[i][2] = this.screenX(this.originalLowerWalls[i][2]);
            this.lowerWalls[i][3] = this.screenY(this.originalLowerWalls[i][3]);
        }
        // upper walls // todo
        this.upperWalls.x = -$gameMap.displayX() * $gameMap.tileWidth();
        this.upperWalls.y = -$gameMap.displayY() * $gameMap.tileHeight();
    }

    getWallHeight(x, y) {
        let tw = $gameMap.tileWidth(), eps = 0.0001; // tw * h + 6 + eps
        for (const [x2, y2, x1, y1, h] of this.globalLowerWalls) {
            if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                return (y1 - y) / 2 + eps;
            }
        }
        return 0;
    }
}

$gameShadow = new GameShadow();