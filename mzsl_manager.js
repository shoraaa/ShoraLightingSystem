

var ShadowManager = (function() {

    const epsilon = () => 0.0000001;

    const equal = (a, b) => {
        if (Math.abs(a[0] - b[0]) < epsilon() && Math.abs(a[1] - b[1]) < epsilon()) return true;
        return false;
    };

    const parentOfThis = (index) => {
        return Math.floor((index-1)/2);
    };

    const child = (index) => {
        return 2*index+1;
    };

    const angle = (a, b) => {
        return Math.atan2(b[1]-a[1], b[0]-a[0]) * 180 / Math.PI;
    };

    const angle2 = (a, b, c) => {
        let a1 = angle(a,b);
        let a2 = angle(b,c);
        let a3 = a1 - a2;
        if (a3 < 0) a3 += 360;
        if (a3 > 360) a3 -= 360;
        return a3;
    };

    const sortPoints = (position, segments) => {
        let points = new Array(segments.length * 2);
        for (let i = 0; i < segments.length; ++i) {
            for (let j = 0; j < 2; ++j) {
                let a = angle(segments[i][j], position);
                points[2*i+j] = [i, j, a];
            }
        }
        points.sort(function(a,b) {return a[2]-b[2];});
        return points;
    };

    const intersectLines = (a1, a2, b1, b2) => {
        let dbx = b2[0] - b1[0];
        let dby = b2[1] - b1[1];
        let dax = a2[0] - a1[0];
        let day = a2[1] - a1[1];
        
        let u_b  = dby * dax - dbx * day;
        if (u_b != 0) {
            let ua = (dbx * (a1[1] - b1[1]) - dby * (a1[0] - b1[0])) / u_b;
            return [a1[0] - ua * -dax, a1[1] - ua * -day];
        }
        return [];
    };

    const distance = (a, b) => {
        let dx = a[0]-b[0];
        let dy = a[1]-b[1];
        return dx*dx + dy*dy;
    };

    const isOnSegment = (xi, yi, xj, yj, xk, yk) => {
      return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) &&
             (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
    };

    const computeDirection = (xi, yi, xj, yj, xk, yk) => {
      a = (xk - xi) * (yj - yi);
      b = (xj - xi) * (yk - yi);
      return a < b ? -1 : a > b ? 1 : 0;
    };

    const doLineSegmentsIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
      d1 = computeDirection(x3, y3, x4, y4, x1, y1);
      d2 = computeDirection(x3, y3, x4, y4, x2, y2);
      d3 = computeDirection(x1, y1, x2, y2, x3, y3);
      d4 = computeDirection(x1, y1, x2, y2, x4, y4);
      return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
              ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
             (d1 == 0 && isOnSegment(x3, y3, x4, y4, x1, y1)) ||
             (d2 == 0 && isOnSegment(x3, y3, x4, y4, x2, y2)) ||
             (d3 == 0 && isOnSegment(x1, y1, x2, y2, x3, y3)) ||
             (d4 == 0 && isOnSegment(x1, y1, x2, y2, x4, y4));
    };

    const lessThan = (index1, index2, position, segments, destination) => {
        let inter1 = intersectLines(segments[index1][0], segments[index1][1], position, destination);
        let inter2 = intersectLines(segments[index2][0], segments[index2][1], position, destination);
        if (!equal(inter1, inter2)) {
            let d1 = distance(inter1, position);
            let d2 = distance(inter2, position);
            return d1 < d2;
        }
        let end1 = 0;
        if (equal(inter1, segments[index1][0])) end1 = 1;
        let end2 = 0;
        if (equal(inter2, segments[index2][0])) end2 = 1;
        let a1 = angle2(segments[index1][end1], inter1, position);
        let a2 = angle2(segments[index2][end2], inter2, position);
        if (a1 < 180) {
            if (a2 > 180) return true;
            return a2 < a1;
        }
        return a1 < a2;
    };

    const remove = (index, heap, position, segments, destination, map) => {
        map[heap[index]] = -1;
        if (index == heap.length - 1) {
            heap.pop();
            return;
        }
        heap[index] = heap.pop();
        map[heap[index]] = index;
        let cur = index;
        let parent = parentOfThis(cur);
        if (cur != 0 && lessThan(heap[cur], heap[parent], position, segments, destination)) {
            while (cur > 0) {
                let parent = parentOfThis(cur);
                if (!lessThan(heap[cur], heap[parent], position, segments, destination)) {
                    break;
                }
                map[heap[parent]] = cur;
                map[heap[cur]] = parent;
                let temp = heap[cur];
                heap[cur] = heap[parent];
                heap[parent] = temp;
                cur = parent;
            }
        } else {
            while (true) {
                let left = child(cur);
                let right = left + 1;
                if (left < heap.length && lessThan(heap[left], heap[cur], position, segments, destination) &&
                        (right == heap.length || lessThan(heap[left], heap[right], position, segments, destination))) {
                    map[heap[left]] = cur;
                    map[heap[cur]] = left;
                    let temp = heap[left];
                    heap[left] = heap[cur];
                    heap[cur] = temp;
                    cur = left;
                } else if (right < heap.length && lessThan(heap[right], heap[cur], position, segments, destination)) {
                    map[heap[right]] = cur;
                    map[heap[cur]] = right;
                    let temp = heap[right];
                    heap[right] = heap[cur];
                    heap[cur] = temp;
                    cur = right;
                } else break;
            }
        }
    };

    const insert = (index, heap, position, segments, destination, map) => {
        let intersect = intersectLines(segments[index][0], segments[index][1], position, destination);
        if (intersect.length == 0) return;
        let cur = heap.length;
        heap.push(index);
        map[index] = cur;
        while (cur > 0) {
            let parent = parentOfThis(cur);
            if (!lessThan(heap[cur], heap[parent], position, segments, destination)) {
                break;
            }
            map[heap[parent]] = cur;
            map[heap[cur]] = parent;
            let temp = heap[cur];
            heap[cur] = heap[parent];
            heap[parent] = temp;
            cur = parent;
        }
    };

    const compute = (position, segments) => {
        let bounded = [];
        let minX = position[0];
        let minY = position[1];
        let maxX = position[0];
        let maxY = position[1];
        for (let i = 0; i < segments.length; ++i) {
            for (let j = 0; j < 2; ++j) {
                minX = Math.min(minX, segments[i][j][0]);
                minY = Math.min(minY, segments[i][j][1]);
                maxX = Math.max(maxX, segments[i][j][0]);
                maxY = Math.max(maxY, segments[i][j][1]);
            }
            bounded.push([[segments[i][0][0], segments[i][0][1]], [segments[i][1][0], segments[i][1][1]]]);
        }
        --minX;
        --minY;
        ++maxX;
        ++maxY;
        bounded.push([[minX, minY],[maxX, minY]]);
        bounded.push([[maxX, minY],[maxX, maxY]]);
        bounded.push([[maxX, maxY],[minX, maxY]]);
        bounded.push([[minX, maxY],[minX, minY]]);
        let polygon = [];
        let sorted = sortPoints(position, bounded);
        let map = new Array(bounded.length);
        for (let i = 0; i < map.length; ++i) map[i] = -1;
        let heap = [];
        let start = [position[0] + 1, position[1]];
        for (let i = 0; i < bounded.length; ++i) {
            let a1 = angle(bounded[i][0], position);
            let a2 = angle(bounded[i][1], position);
            let active = false;
            if (a1 > -180 && a1 <= 0 && a2 <= 180 && a2 >= 0 && a2 - a1 > 180) active = true;
            if (a2 > -180 && a2 <= 0 && a1 <= 180 && a1 >= 0 && a1 - a2 > 180) active = true;
            if (active) {
                insert(i, heap, position, bounded, start, map);
            }
        }
        for (let i = 0; i < sorted.length;) {
            let extend = false;
            let shorten = false;
            let orig = i;
            let vertex = bounded[sorted[i][0]][sorted[i][1]];
            let old_segment = heap[0];
            do {
                if (map[sorted[i][0]] != -1) {
                    if (sorted[i][0] == old_segment) {
                        extend = true;
                        vertex = bounded[sorted[i][0]][sorted[i][1]];
                    }
                    remove(map[sorted[i][0]], heap, position, bounded, vertex, map);
                } else {
                    insert(sorted[i][0], heap, position, bounded, vertex, map);
                    if (heap[0] != old_segment) {
                        shorten = true;
                    }
                }
                ++i;
                if (i == sorted.length) break;
            } while (sorted[i][2] < sorted[orig][2] + epsilon());

            if (extend) {
                polygon.push(vertex);
                let cur = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                if (!equal(cur, vertex)) polygon.push(cur);
            } else if (shorten) {
                polygon.push(intersectLines(bounded[old_segment][0], bounded[old_segment][1], position, vertex));
                polygon.push(intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex));
            } 
        }
        return polygon;
    };

    const computeViewport = (position, segments, viewportMinCorner, viewportMaxCorner) => {
        let brokenSegments = [];
        let viewport = [[viewportMinCorner[0],viewportMinCorner[1]],[viewportMaxCorner[0],viewportMinCorner[1]],[viewportMaxCorner[0],viewportMaxCorner[1]],[viewportMinCorner[0],viewportMaxCorner[1]]];
        for (let i = 0; i < segments.length; ++i) {
            if (segments[i][0][0] < viewportMinCorner[0] && segments[i][1][0] < viewportMinCorner[0]) continue;
            if (segments[i][0][1] < viewportMinCorner[1] && segments[i][1][1] < viewportMinCorner[1]) continue;
            if (segments[i][0][0] > viewportMaxCorner[0] && segments[i][1][0] > viewportMaxCorner[0]) continue;
            if (segments[i][0][1] > viewportMaxCorner[1] && segments[i][1][1] > viewportMaxCorner[1]) continue;
            let intersections = [];
            for (let j = 0; j < viewport.length; ++j) {
                let k = j + 1;
                if (k == viewport.length) k = 0;
                if (doLineSegmentsIntersect(segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1], viewport[j][0], viewport[j][1], viewport[k][0], viewport[k][1])) {
                    let intersect = intersectLines(segments[i][0], segments[i][1], viewport[j], viewport[k]);
                    if (intersect.length != 2) continue;
                    if (equal(intersect, segments[i][0]) || equal(intersect, segments[i][1])) continue;
                    intersections.push(intersect);
                }
            }
            let start = [segments[i][0][0], segments[i][0][1]];
            while (intersections.length > 0) {
                let endIndex = 0;
                let endDis = distance(start, intersections[0]);
                for (let j = 1; j < intersections.length; ++j) {
                    let dis = distance(start, intersections[j]);
                    if (dis < endDis) {
                        endDis = dis;
                        endIndex = j;
                    }
                }
                brokenSegments.push([[start[0], start[1]], [intersections[endIndex][0], intersections[endIndex][1]]]);
                start[0] = intersections[endIndex][0];
                start[1] = intersections[endIndex][1];
                intersections.splice(endIndex, 1);
            }
            brokenSegments.push([start, [segments[i][1][0], segments[i][1][1]]]);
        }

        let viewportSegments = [];
        for (let i = 0; i < brokenSegments.length; ++i) {
            if (inViewport(brokenSegments[i][0], viewportMinCorner, viewportMaxCorner) && inViewport(brokenSegments[i][1], viewportMinCorner, viewportMaxCorner)) {
                viewportSegments.push([[brokenSegments[i][0][0], brokenSegments[i][0][1]], [brokenSegments[i][1][0], brokenSegments[i][1][1]]]);
            }
        }
        let eps = epsilon() * 10;
        viewportSegments.push([[viewportMinCorner[0]-eps,viewportMinCorner[1]-eps],[viewportMaxCorner[0]+eps,viewportMinCorner[1]-eps]]);
        viewportSegments.push([[viewportMaxCorner[0]+eps,viewportMinCorner[1]-eps],[viewportMaxCorner[0]+eps,viewportMaxCorner[1]+eps]]);
        viewportSegments.push([[viewportMaxCorner[0]+eps,viewportMaxCorner[1]+eps],[viewportMinCorner[0]-eps,viewportMaxCorner[1]+eps]]);
        viewportSegments.push([[viewportMinCorner[0]-eps,viewportMaxCorner[1]+eps],[viewportMinCorner[0]-eps,viewportMinCorner[1]-eps]]);
        return compute(position, viewportSegments);
    };

    const inViewport = (position, viewportMinCorner, viewportMaxCorner) => {
        if (position[0] < viewportMinCorner[0] - epsilon()) return false;
        if (position[1] < viewportMinCorner[1] - epsilon()) return false;
        if (position[0] > viewportMaxCorner[0] + epsilon()) return false;
        if (position[1] > viewportMaxCorner[1] + epsilon()) return false;
        return true;
    };

    const breakIntersections = (segments) => {
        let output = [];
        for (let i = 0; i < segments.length; ++i) {
            let intersections = [];
            for (let j = 0; j < segments.length; ++j) {
                if (i == j) continue;
                if (doLineSegmentsIntersect(segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1], segments[j][0][0], segments[j][0][1], segments[j][1][0], segments[j][1][1])) {
                    let intersect = intersectLines(segments[i][0], segments[i][1], segments[j][0], segments[j][1]);
                    if (intersect.length != 2) continue;
                    if (equal(intersect, segments[i][0]) || equal(intersect, segments[i][1])) continue;
                    intersections.push(intersect);
                }
            }
            let start = [segments[i][0][0], segments[i][0][1]];
            while (intersections.length > 0) {
                let endIndex = 0;
                let endDis = distance(start, intersections[0]);
                for (let j = 1; j < intersections.length; ++j) {
                    let dis = distance(start, intersections[j]);
                    if (dis < endDis) {
                        endDis = dis;
                        endIndex = j;
                    }
                }
                output.push([[start[0], start[1]], [intersections[endIndex][0], intersections[endIndex][1]]]);
                start[0] = intersections[endIndex][0];
                start[1] = intersections[endIndex][1];
                intersections.splice(endIndex, 1);
            }
            output.push([start, [segments[i][1][0], segments[i][1][1]]]);
        }
        return output;
    };

    const getSegments = (segments) => {
        let newSegments = [];
        for (let i = 0; i < segments.length; ++i) {
            let [p1x, p1y, p2x, p2y] = segments[i];
            newSegments.push([[p1x, p1y], [p2x, p2y]]);
        }
        newSegments = breakIntersections(newSegments);
        return newSegments;
    };

    let exports = {};

    exports.computeViewport = computeViewport;
    exports.compute = compute;
    exports.getSegments = getSegments;

    return exports;

})();

Shora.ColorManager = class {
    static hexToRGB(c) {
        return [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, (c & 0x0000ff)];
    }
    static RGBToHex([r, g, b]) {
        return (r << 16) + (g << 8) + (b);
    }
    static transition(f, [r1, g1, b1], [r2, g2, b2]) {
        return ((r2 - r1) * f + r1) << 16 | ((g2 - g1) * f + g1) << 8 | ((b2 - b1) * f + b1);
    }
}

class TextureManager {
    /**
     * Return a filtered texture.
     * @param {PIXI.BaseTexture} baseTexture 
     * @param {Object} colorFilter 
     */
    static filter(baseTexture, colorFilter, name) {
        //return new PIXI.Texture(baseTexture);
        if (!colorFilter) return baseTexture;
        if ($shoraLayer.textureCache(name)) return $shoraLayer.textureCache(name);
        let sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
        let filter = new ColorFilter();
		filter.setBrightness(colorFilter.brightness || 255);
		filter.setHue(colorFilter.hue || 0);
		filter.setColorTone(colorFilter.colorTone || [0, 0, 0, 0]); // 8, 243, 242, 194
		filter.setBlendColor(colorFilter.blendColor || [0, 0, 0, 0]); // 96, 151, 221, 229
		sprite.filters = [filter];
        let renderedTexture = Graphics.app.renderer.generateTexture(sprite, 1, 1, sprite.getBounds());
        sprite.filters = null;
		sprite.destroy({texture: true});
		return $shoraLayer.lightingCache[name] = renderedTexture;
    }

    static snapshot(sprite) {
        // todo: rotation angle correcting, no need filter when rotate
        let region = sprite.shadow.bounds;
        let [x, y, rotation, scale] = [sprite.x, sprite.y, sprite.rotation, sprite.scale.x];
		sprite.x = 0;
		sprite.y = 0;
		sprite.anchor.set(0);
        sprite.mask = null;
        sprite.rotation = 0;
        sprite.renderable = true;
        sprite.filters = null;
		// prettier-ingonre
        sprite.shadow.mask.renderable = true;
        Shora.maskTexture.resize(sprite.width, sprite.height, true);
        Shora.tempMatrix.tx = -region.x + sprite.shadowOffsetX;
        Shora.tempMatrix.ty = -region.y + sprite.shadowOffsetY;
        Graphics.app.renderer.render(sprite.shadow.mask, Shora.maskTexture, false, Shora.tempMatrix, true);

        let maskSprite = new PIXI.Sprite(Shora.maskTexture);
        Shora.MASK = maskSprite;
        sprite.mask = maskSprite;

		//sprite.renderTexture.resize(sprite.width, sprite.height);
        Graphics.app.renderer.render(sprite, sprite.renderTexture);
        sprite.x = x; sprite.y = y; sprite.anchor.set(0.5);
        sprite.rotation = rotation; sprite.pulse.set(1, 1);
        sprite.texture = sprite.renderTexture;
    } 
}

class GameLighting {
    constructor() {
        this._lighting = [];
        this.LIGHTING = {};
        this.loadParameters();
        this.loadLighting();
    }

    loadParameters() {
        this.PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Map']);
        this.PARAMETERS.ambient = this.PARAMETERS.ambient.toHexValue();
        this.GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
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
        parameters.range = Number(parameters.range);

        parameters.rotation = Number(parameters.rotation);
        parameters.direction = parameters.direction === 'true';

        parameters.tint = parameters.tint.toHexValue();

        parameters.wall = parameters.bwall === 'false';

        parameters.shadow = parameters.shadow === 'true';
        parameters.static = parameters.static === 'true';
        
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
    lighting() {
        return this._lighting;
    }

    /**
     * Add a lighting instance to scene.
     * 
     * @param {Game_Character} character 
     * @param {Object} options 
     */
    add(character, options) {
        if (!this.LIGHTING[options.name]) {
            Shora.warn('Cannot find light named [' + options.name + '].\nPlease register lighting before use.\nDefault Lighting used instead');
            options.name = 'default';
        }
        const params = {...this.LIGHTING[options.name], ...options};
        params.character = character;
        this.remove(params.id);
        this._lighting.push(params);
        return $shoraLayer.lighting.addLight(params);
    }

    /**
     * Remove a lighting instance from scene.
     * @param {Number} id 
     */
    remove(id) {
        let i;
        if ((i = this._lighting.findIndex(light => light.id === id)) !== -1) {
            this._lighting.splice(i, 1);
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
    setMapColor(color, time) {
        $shoraLayer.lighting.setMapColor(color, time);
    }

    // params
    shadowColor() {
        return this.PARAMETERS.ambient;
    }

    regionStart() {
        return Number(this.GAME_PARAMETERS.regionStart);
    }

    width() {
        return $gameMap.width() * $gameMap.tileWidth();
    }

    height() {
        return $gameMap.height() * $gameMap.tileHeight();
    }
}

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
        this.scanMapCaster();
		this.createSegments();
    }

    scanMapCaster() {
        this.map = new Array($gameMap.height())
            .fill(0)
            .map(() => new Array($gameMap.width()).fill(0));

        let [tw, th] = [$gameMap.tileWidth(), $gameMap.tileHeight()];
        let regionStart = $gameLighting.regionStart() - 1;
        this.upperWalls = new PIXI.Graphics();
        this.upperWalls.beginFill(0x333333);
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
    };
    
    createSegments = function() {
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

		this.segments = ShadowManager.getSegments(this._segments);
        this.originalSegments = this.segments.map(s => s.map(p => p.map(x => x / 48)));

		// Lower walls
        this.optimizeSegments(this.lowerWalls);
        this.lowerWalls.sort((a, b) => b[0] - a[0]);
        this.originalLowerWalls = this.lowerWalls.map(s => s.map(p => p >= $gameMap.tileWidth() ? p / $gameMap.tileWidth() : p));

        this.globalSegments = JSON.parse(JSON.stringify(this.segments));
        this.globalLowerWalls = JSON.parse(JSON.stringify(this.lowerWalls));
    };
    
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
                return (y1 - y) + eps;
            }
        }
        return 0;
    }
}