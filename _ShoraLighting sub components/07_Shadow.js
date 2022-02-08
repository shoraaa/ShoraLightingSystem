// TODO: Directly draw darken geometry into light texture
// using vertex shader to calculate those geometry.
// Currently it draw those into temporary sprite then into light texture
class Shadow {
    constructor(ox, oy, bounds, shadowAmbient, offsetx, offsety) {
        this.graphics = new PIXI.Graphics();
        // todo: remove those
        this.texture = PIXI.RenderTexture.create(bounds.width, bounds.height);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        this.shadowAmbient = shadowAmbient;
        this.update(ox, oy, bounds, offsetx, offsety);
    }

    destroy() {
        this.polygon = this.bounds = 
        this._parallelSegments = this.shadowAmbient = null;

        this.graphics.destroy(true);
        this.graphics = null;

        this.sprite.destroy(true);
        this.sprite = null;
    }

    update(ox, oy, bounds, offsetx, offsety) {
        this.bounds = bounds;
        this.polygon = ShadowSystem.computeViewport([ox, oy], $gameShadow.segments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        this._parallelSegments = {};
        this.graphics.clear();

        if (bounds.width != this.texture.width || bounds.height != this.texture.height)
            this.texture.resize(bounds.width, bounds.height);

        this.draw(oy, $gameShadow.lowerWalls);

        // todo
        this.graphics.x = $gameShadow.upperWalls.x = -this.bounds.x + offsetx;
        this.graphics.y = $gameShadow.upperWalls.y = -this.bounds.y + offsety;
        Graphics.app.renderer.render(this.graphics, this.texture);
        Graphics.app.renderer.render($gameShadow.upperWalls, this.texture, false);
    }

    render(texture) {
        // to do
        Graphics.app.renderer.render(this.sprite, texture, false);
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
				this.graphics.lineTo(nx, ny - tw * height)
							    .lineTo(x, y - tw * height);
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
        this.graphics.beginFill(this.shadowAmbient);
		this.graphics.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this.graphics.endFill();

		this.graphics.beginFill(0xffffff);
		this.graphics.moveTo(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i, oy, lowerWalls);
            this.graphics.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this.graphics.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0, oy, lowerWalls);
		if (this.polygon[0][1] == this.polygon[this.polygon.length - 1][1]) {
			if (!this._parallelSegments[this.polygon[0][1]]) this._parallelSegments[this.polygon[0][1]] = [];
			this._parallelSegments[this.polygon[0][1]].push([this.polygon[0][0], this.polygon[this.polygon.length - 1][0]]);
		}
		this.graphics.endFill(); 

		for (let y in this._parallelSegments) {
			for (let i in this._parallelSegments[y]) {
				if (this._parallelSegments[y][i][0] > this._parallelSegments[y][i][1])
				[this._parallelSegments[y][i][0], this._parallelSegments[y][i][1]] = [this._parallelSegments[y][i][1], this._parallelSegments[y][i][0]];
			}
			this._parallelSegments[y].sort((a, b) => a[0] - b[0]);
		}

		//drawing lower-walls
        this.graphics.beginFill(this.shadowAmbient); 
        let tw = $gameMap.tileWidth();
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
            if (y1 >= oy || !this.containParallelSegment(y1, x1, x2)) {
                this.graphics.moveTo(x1, y1);
                this.graphics.lineTo(x1, y1-tw*height);
                this.graphics.lineTo(x2, y2-tw*height);
                this.graphics.lineTo(x2, y2);
            }
		}
        this.graphics.endFill();
        
        // ignore shadows 
        this.graphics.beginFill(0xffffff); 
        for (let i = 0; i < $gameShadow.ignoreShadows.length; ++i) {
            let [x, y] = $gameShadow.ignoreShadows[i];
            this.graphics.moveTo(x, y);
            this.graphics.lineTo(x, y+tw);
            this.graphics.lineTo(x+tw, y+tw);
            this.graphics.lineTo(x+tw, y);
        }
        this.graphics.endFill();
        
        /* drawing top-walls
        this.graphics.beginFill(0x333333);
        for (let i = Math.max(0, Math.floor(this.bounds.top / 48));
            i <= Math.min($gameShadow.topWalls.length - 1, Math.ceil(this.bounds.bottom / 48)); ++i) {
            let j = $gameShadow.topWalls[i].pair_floor_search(this.bounds.left, 1) + 1;
            for (; j < $gameShadow.topWalls[i].length && $gameShadow.topWalls[i][j][0] < this.bounds.right; ++j) {
                let [begin, end] = $gameShadow.topWalls[i][j];
                this.graphics.drawRect(begin, i*48, end-begin, 48);
            }
        }
        this.graphics.endFill();
        */
    }
}