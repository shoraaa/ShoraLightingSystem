
class GameShadow {
    constructor() {
        this.segments = [];

        this.map = null;
        this.lower = null;
        this.ignore = null;
        this.upper = null;
    }

    refresh() {
        this.segments = [];
        this.scanMapCaster();
		this.createSegments();
    }
    
    scanMapCaster() {
        const width = $gameMap.width(),
              height = $gameMap.height(),
              regionStart = $shoraLayer._regionStart,
              regionEnd = $shoraLayer._regionEnd,
              topRegionId = $shoraLayer._topRegionId,
              ignoreShadowsId = $shoraLayer._ignoreShadowsId;


        this.map = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));
        this.lower = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));
        this.upper = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));
        this.ignore = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(0));

        let id, h;
        
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                id = $gameMap.regionId(j + 1, i + 1);
                if (regionStart <= id && id <= regionEnd) {
                    h = id - regionStart + 1;
                    this.map[i][j] = h; 
                    if (i + h < height) this.lower[i + h][j] = 1;
                    if (i - h + 1 >= 0) this.upper[i - h + 1][j] = 1;
                }
                if (id === topRegionId) 
                    this.upper[i][j] = 1;
                if (id === ignoreShadowsId) 
                    this.ignore[i][j] = 1;
            }
        }
    }

    outOfBound(x, y) {
		return x < 0 || y < 0 || y >= this.map.length || x >= this.map[y].length;
    }
    
    addCaster(x, y, h, vert, horz) {
        const tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
		if (!this.outOfBound(x, y - 1) && this.map[y - 1][x]) {
			if (!this.outOfBound(x - 1, y) && !this.map[y][x - 1]) 
				vert.push([(x + 1) * tw, (y + h) * th, (x + 1) * tw, (y + h + 1) * th]);
		} else if (!this.outOfBound(x - 1, y)) {
            horz.push([(x + 1) * tw, (y + h) * th, (x + 2) * tw, (y + h) * th]);
            if (!this.map[y][x - 1]) 
                vert.push([(x + 1) * tw, (y + h) * th, (x + 1) * tw, (y + h + 1) * th]);
		} 
		if (!this.outOfBound(x + 1, y) && !this.map[y][x + 1]) 
				vert.push([(x + 2) * tw, (y + h) * th, (x + 2) * tw, (y + h + 1) * th]);
		if (!this.outOfBound(x, y + 1) && !this.map[y + 1][x]) 
				horz.push([(x + 2) * tw, (y + h + 1) * th, (x + 1) * tw, (y + h + 1) * th]);
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
		for (var y = 0; y < this.map.length; y++) 
			for (var x = 0; x < this.map[y].length; x++) if (this.map[y][x]) 
					this.addCaster(x, y, this.map[y][x], vert, horz);

		this.segments = ShadowSystem.getSegments(
            this.mergeVerticalSegments(vert).concat(
            this.mergeHorizontalSegments(horz)));
    }
    
    worldToScreenX(x) {
        return Math.round($gameMap.adjustX(x));
    }

    worldToScreenY(y) {
        return Math.round($gameMap.adjustY(y));
    }

    getWallHeight(x, y) {
        return;
        let tw = $gameMap.tileWidth(), eps = 0.0001; // tw * h + 6 + eps
        for (const [x2, y2, x1, y1, h] of this.lowerWalls) {
            if (x >= x1 && x <= x2 && y <= y1 && y >= y2-tw*h) {
                return y1 - y + eps;
            }
        }
        return 0;
    }
}

// $shoraLayer = new Layer();
$gameShadow = new GameShadow();
