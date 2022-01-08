class Shadow {
    get mask() {
        return this.shadowMask;
    }
    constructor(ox, oy, bounds, shadowAmbient) {
        // TODO: Calculate Transform.
        this._shadowMask = new PIXI.Graphics();
        this._shadowTexture = PIXI.RenderTexture.create($gameLighting.width(), $gameLighting.height());
        this.shadowMask = new PIXI.Sprite(this._shadowTexture);
        this.shadowAmbient = shadowAmbient;
        this.updateGlobal(ox, oy, bounds);
    }

    destroy() {
        this.polygon = null; this.bounds = null; this._parallelSegments = null;
        this._shadowMask.destroy(true); this._shadowMask = null;
        this._shadowTexture = null; this.shadowMask = null;
        /* this will get destroyed by layer call
        this._shadowTexture.destroy(true); 
        this.shadowMask.destroy(true); 
        */
        this.bounds = null;
    }

    update(x, y, bounds) {
        //console.log("update x =" + x + " y = " + y);
        this.bounds = bounds;
        this.polygon = ShadowSystem.computeViewport([x, y], $gameShadow.segments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        //this.bounds = bounds;
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(y, $gameShadow.lowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
    }

    updateGlobal(ox, oy, bounds) {
        //console.log("update global x =" + ox + " y = " + oy);
        this.bounds = bounds;
        this.polygon = ShadowSystem.computeViewport([ox, oy], $gameShadow.globalSegments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(oy, $gameShadow.globalLowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        let {x, y} = $gameShadow.upperWalls;
        $gameShadow.upperWalls.x = $gameShadow.upperWalls.y = 0;
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
        $gameShadow.upperWalls.x = x; $gameShadow.upperWalls.y = y;
    }

    drawWall(index, oy, lowerWalls) {
		let [x, y] = this.polygon[index], last = (index == 0 ? this.polygon.length - 1 : index - 1);
		let [nx, ny] = this.polygon[last];

		let tw = $gameMap.tileWidth();
		if (y == ny) {
			if (!this._parallelSegments[y]) this._parallelSegments[y] = [];
			this._parallelSegments[y].push([nx, x]);
		}
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
			if (y == ny && y == y1 && x >= x1 && x <= x2 && nx >= x1 && nx <= x2 && oy >= y1) {
				this._shadowMask.lineTo(nx, ny - tw * height)
							   .lineTo(x, y - tw * height)
			}
		}
	};

    containParallelSegment(y, u, v) {
		if (!this._parallelSegments[y]) return false;
		let lo = 0, hi = this._parallelSegments[y].length - 1, result = -1;
		while (lo <= hi) {
			let mid = (lo + hi) >> 1;
			if (this._parallelSegments[y][mid][0] >= u) {
				result = mid;
				hi = mid - 1;
			} else lo = mid + 1;
		}
		if (result == -1) return false;
		let [x1, x2] = this._parallelSegments[y][result];
		if (v >= x1) return true;
		if (result === 0) return false; 
        [x1, x2] = this._parallelSegments[y][result - 1];
		//if (v >= x1) return true;
        return false;
	}

    draw(oy, lowerWalls) {
        this._shadowMask.beginFill(this.shadowAmbient);
		this._shadowMask.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this._shadowMask.endFill();

		this._shadowMask.beginFill(0xffffff);
		this._shadowMask.(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i, oy, lowerWalls);
            this._shadowMask.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this._shadowMask.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0, oy, lowerWalls);
		if (this.polygon[0][1] == this.polygon[this.polygon.length - 1][1]) {
			if (!this._parallelSegments[this.polygon[0][1]]) this._parallelSegments[this.polygon[0][1]] = [];
			this._parallelSegments[this.polygon[0][1]].push([this.polygon[0][0], this.polygon[this.polygon.length - 1][0]]);
		}
		this._shadowMask.endFill(); 

		for (let y in this._parallelSegments) {
			for (let i in this._parallelSegments[y]) {
				if (this._parallelSegments[y][i][0] > this._parallelSegments[y][i][1])
				[this._parallelSegments[y][i][0], this._parallelSegments[y][i][1]] = [this._parallelSegments[y][i][1], this._parallelSegments[y][i][0]];
			}
			this._parallelSegments[y].sort((a, b) => a[0] - b[0]);
		}

		//drawing lower-walls
        this._shadowMask.beginFill(this.shadowAmbient); 
        let tw = $gameMap.tileWidth();
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
            if (this.containParallelSegment(y1, x1, x2)) continue;
			this._shadowMask.moveTo(x1, y1);
			this._shadowMask.lineTo(x1, y1-tw*height);
			this._shadowMask.lineTo(x2, y2-tw*height);
			this._shadowMask.lineTo(x2, y2);
		}
        this._shadowMask.endFill();
        
        /* drawing top-walls
        this._shadowMask.beginFill(0x333333);
        for (let i = Math.max(0, Math.floor(this.bounds.top / 48));
            i <= Math.min($gameShadow.topWalls.length - 1, Math.ceil(this.bounds.bottom / 48)); ++i) {
            let j = $gameShadow.topWalls[i].pair_floor_search(this.bounds.left, 1) + 1;
            for (; j < $gameShadow.topWalls[i].length && $gameShadow.topWalls[i][j][0] < this.bounds.right; ++j) {
                let [begin, end] = $gameShadow.topWalls[i][j];
                this._shadowMask.drawRect(begin, i*48, end-begin, 48);
            }
        }
        this._shadowMask.endFill();
        */
    }
}

