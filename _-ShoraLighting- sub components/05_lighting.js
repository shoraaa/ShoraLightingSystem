
/* The lighting itself, with its shadow and shadow's compute algorithm. */

class LightingSprite extends PIXI.Sprite {

    get character() {
        return this.id ? $gameMap._events[this.id] : $gamePlayer;
    }

    constructor(options) {
        super();

        let baseSprite = TextureManager.filter(options);
        this._baseSprite = baseSprite;
        this._baseSprite.anchor.set(0.5);

        this.renderable = true;
        this.id = options.id;
        this.fileName = options.filename;
        this.colorFilter = options.colorfilter;
        this.status = options.status;
        this.anchor.set(0.5);

        this.radius = new ScaleAnimation(this, options); // default radius = 100%
        this.setRadius(options.radius);
        this.pulse = new PulseAnimation(this, options.animation.pulse, options.radius);
        
        this.rotate = new AngleAnimation(this, options);
        this.setAngle(options.direction ? this.rotate.angle() : options.angle);

        this.offset = new OffsetAnimation(options.offset);
        this.setPostion(options);

        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new TintAnimation(this, options);

        this.texture = PIXI.RenderTexture.create(this._baseSprite.width, this._baseSprite.height);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this._baseSprite.position.set(this._baseSprite.width / 2, this._baseSprite.height / 2);
        Graphics.app.renderer.render(this._baseSprite, this.texture);

        this._shadow = options.shadow;
        this.bwall = options.bwall;
        this.shadowOffsetX = options.shadowoffsetx || 0;
        this.shadowOffsetY = options.shadowoffsety || 0; 
        if (!this.bwall) // 54.00001; tw * h + 6 + eps
            this.shadowOffsetY += $gameShadow.getWallHeight(this.sourceX(), this.sourceY());
        this.shadow = new Shadow(this, options.shadowambient);
        if (this._shadow) 
            this.shadow.render(this);
        this.forceRecalculateShadow = false;

        this._justMoving = 2;

    }


    destroy() {
        this._baseSprite.destroy(); // don't destroy texture
        this._baseSprite = null;

        this.radius.destroy();
        this.flicker.destroy();
        this.offset.destroy();
        this.color.destroy();
        this.rotate.destroy();
        this.shadow.destroy();
        this.pulse.destroy();
        this.radius = null;
        this.flicker = null;
        this.color = null;
        this.offset = null;
        this.rotate = null;
        this.shadow = null;
        this.pulse = null;

        super.destroy(true);
    }

    update() {
        if (!this.status) 
            return this.renderable = false;
        this.updateAnimation();
        this.updatePostion();
        this.updateTexture();
    }

    needRecalculateShadow() {
        if (this.forceRecalculateShadow) {
            return true;
        }
        if (this.offset._changed) 
            return true;
        if (this.character.isStopping()) {
            if (this._justMoving < 2) 
                return ++this._justMoving;
            return false;
        }
        return this._justMoving = 0, true;
    }

    needRerender() {
        return this.needRecalculateShadow() || this.radius._changed || this.rotate._changed;
    }

    updateTexture() {
        if (!this.renderable || !this.needRerender()) return;
        Graphics.app.renderer.render(this._baseSprite, this.texture);
        if (this._shadow) {
            if (this.needRecalculateShadow()) {
                this.forceRecalculateShadow = false;
                this.shadow.calculate(this);
            }
            this.shadow.render(this);
        }
    }

    updatePostion() {
        this.x = Math.round(this.character.screenX() + this.offset.x);
        this.y = Math.round(this.character.screenY() + this.offset.y);
    }

    updateAnimation() {
        this.offset.update();
        if (!this.renderable) return;
        this.flicker.update();
        this.color.update();
        this.pulse.update();
        this.radius.update();
        this.rotate.update();
    }

    updateDisplay() {
        let bounds = this.getBounds();
        this.renderable = $gameLighting.inDisplay(bounds.left, bounds.top, bounds.right, bounds.bottom);
    }

    sourceX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
    }

    sourceY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
    }

    sourceBound() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
        return bounds;
    }

    setPostion(options) {
        this.x = options.x != undefined ? $gameShadow.worldToScreenX(options.x)
         : this.character.screenX() + this.offset.x;
        this.y = options.y != undefined ? $gameShadow.worldToScreenY(options.y)
         : this.character.screenY() + this.offset.y;
    }

    setRadius(radius, time, type) {
        this.radius.set(radius, time || 1, type || 1);
    }

    setAngle(angle, time, type) {
        // update .rotation instead of .angle for pixiv4 support
        this.rotate.set(angle, time || 1, type || 1);
    }

    setColor(color, time) {
        this.color.set(color, time || 1);
    }

    setOffsetX(x, time, type) {
        this.offset.setX(x, time || 1, type || 1);
    }

    setOffsetY(y, time, type) {
        this.offset.setY(y, time || 1, type || 1);
    }

    setOffset(x, y, time, type) {
        this.offset.setX(x, time || 1, type || 1);
        this.offset.setY(y, time || 1, type || 1);
    }
    setShadow(shadow) {
        $gameMap._lighting[this.id].shadow = this._shadow = shadow;
        this.updateTexture();
    }

    setTint(color, time, type) {	
        this.color.set(color, time || 1, type || 1);	
    }	
}

class BattleLightingSprite extends PIXI.Sprite {

    get character() {
        
    }

    constructor(options) {
        super();


    }

}


/// TODO: Directly draw darken geometry into light texture
// using vertex shader to calculate those geometry.
// Currently it draw those into temporary sprite then into light texture
class Shadow {
    constructor(lighting, shadowAmbient) {
        this.graphics = new PIXI.Graphics();
        // todo: remove those
        let bounds = lighting.sourceBound();
        this.texture = PIXI.RenderTexture.create(bounds.width, bounds.height);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        this.ox = this.oy = 0;
        this.shadowAmbient = shadowAmbient;
        this.calculate(lighting);
        this.render(lighting);
    }

    destroy() {
        this.polygon = this.bounds = 
        this._parallelSegments = this.shadowAmbient = null;

        this.graphics.destroy(true);
        this.graphics = null;

        this.sprite.destroy(true);
        this.sprite = null;
    }

    calculate(lighting) {
        this.ox = lighting.sourceX(), this.oy = lighting.sourceY(), this.bounds = lighting.sourceBound();
        this.polygon = ShadowSystem.computeViewport(
                        [this.ox, this.oy], 
                        $gameShadow.segments, 
                        [this.bounds.left, this.bounds.top], 
                        [this.bounds.right, this.bounds.bottom]);
        this.draw(); 
    }

    render(lighting) {
        let ox = lighting.sourceX() - lighting.shadowOffsetX, 
            oy = lighting.sourceY() - lighting.shadowOffsetY, 
            rotation = lighting.rotation;

        // render the shadow mask
        this.graphics.pivot.set(ox, oy);
        this.graphics.position.set(this.texture.width / 2, this.texture.height / 2);
        this.graphics.scale.set(1 / lighting.scale.x);
        this.graphics.rotation = 2 * Math.PI - rotation;
        Graphics.app.renderer.render(this.graphics, this.texture);

        //  render the upper shadow mask
        $gameShadow.upper.pivot.set(ox, oy);
        $gameShadow.upper.position.set(this.texture.width / 2, this.texture.height / 2);
        $gameShadow.upper.scale.set(1 / lighting.scale.x);
        $gameShadow.upper.rotation = 2 * Math.PI - rotation;
        Graphics.app.renderer.render($gameShadow.upper, this.texture, false);

        // render the ignore shadow mask (not do if not nessecary)
        if ($gameShadow.haveIgnoreShadow) {
            $gameShadow.ignore.pivot.set(ox, oy);
            $gameShadow.ignore.position.set(this.texture.width / 2, this.texture.height / 2);
            $gameShadow.ignore.scale.set(1 / lighting.scale.x);
            $gameShadow.ignore.rotation = 2 * Math.PI - rotation;
            Graphics.app.renderer.render($gameShadow.ignore, this.texture, false);
        }

        // render everything to the light texture
        Graphics.app.renderer.render(this.sprite, lighting.texture, false);
    }

    drawWall(index) {
		let [x, y] = this.polygon[index], last = (index == 0 ? this.polygon.length - 1 : index - 1);
		let [nx, ny] = this.polygon[last]; 

        if (y != ny || y > this.oy) return;

		let tw = $gameMap.tileWidth();

        // 2 possiblities: nx to x is 1 height, or multiple height
        let h = $gameShadow.check(y, nx, x);
        if (h === 0) return;
        if (h !== -1) {
            this.graphics.lineTo(nx, ny - tw * h)
		 				 .lineTo(x, y - tw * h);
        } else {
            // TODO: walking through mutiple height

        }
        
	}; 

    draw() {
        this.graphics.clear();

        // BOTTLE NECK
        this.graphics.beginFill(this.shadowAmbient);
		this.graphics.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this.graphics.endFill();

		this.graphics.beginFill(0xffffff);
		this.graphics.moveTo(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i);
            this.graphics.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this.graphics.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0);
		this.graphics.endFill(); 

		//drawing lower-walls
        this.graphics.beginFill(this.shadowAmbient); 
        let tw = $gameMap.tileWidth(), leftBound = this.bounds.left, rightBound = this.bounds.right, downBound = this.bounds.bottom, topBound = this.bounds.top;
		for (let i = 0; i < $gameShadow.lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = $gameShadow.lowerWalls[i];
            if (y1 >= this.oy && y1-tw*height <= downBound && x1 <= rightBound && x2 >= leftBound) {
                this.graphics.moveTo(x1, y1);
                this.graphics.lineTo(x1, y1-tw*height);
                this.graphics.lineTo(x2, y2-tw*height);
                this.graphics.lineTo(x2, y2);
            }
		}
        this.graphics.endFill();   

    }
}

var ShadowSystem = (function() {

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
        let a3 = angle(a,b) - angle(b,c);
        if (a3 < 0) a3 += 360;
        if (a3 > 360) a3 -= 360;
        return a3;
    };

    const sortPoints = (position, segments) => {
        let points = new Array(segments.length * 2);
        for (let i = 0; i < segments.length; ++i) {
            points[2*i] = [i, 0, angle(segments[i][0], position)];
            points[2*i+1] = [i, 1, angle(segments[i][1], position)];
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

    const push = (poly, x, y) => {
        if (x >= 48 && y >= 48 && x % 48 === 0 && y % 48 === 0
            && y / 48 - 1 < $gameShadow.lower.length && x / 48 - 2 < $gameShadow.lower[y / 48 - 1].length
            && poly.length >= 2 && poly[poly.length - 1] === y) {
            let h = $gameShadow.lower[y / 48 - 1][x / 48 - 2], 
                lx = poly[poly.length - 2], 
                uy = y - h * $gameMap.tileHeight();
            if (h) poly.push(lx, uy, x, uy);
        }
        poly.push(x, y);
    }

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
                push(polygon, vertex[0], vertex[1]);
                let cur = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                if (!equal(cur, vertex)) push(polygon, cur[0], cur[1]);
            } else if (shorten) {
                let u = intersectLines(bounded[old_segment][0], bounded[old_segment][1], position, vertex),
                    v = intersectLines(bounded[heap[0]][0], bounded[heap[0]][1], position, vertex);
                push(polygon, u[0], u[1]);
                push(polygon, v[0], v[1]);
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
            for (let j = 0; j < viewport.length; ++j) { // ?
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

