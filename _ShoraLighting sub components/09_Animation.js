Shora.Animation = class {
    constructor(sprite, ref) {
        this._sprite = sprite;
        this._ref = ref;
    }
    static get transition() {
        return [
            function(time) { // linear
                return time;
            },
            function(time) { // easeInOut
                let sqt = time * time;
                return sqt / (2.0 * (sqt - time) + 1.0);
            }
        ]
    }
    destroy() {
        this._sprite = this._ref = null;
    }
}

class FlickerAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);

        this.oalpha = 1;
	    this.flickIntensity = ref.flickintensity || 1;
        this.flickSpeed = ref.flickspeed || 1;
        
	    this._flickSpeed = 20 * this.flickSpeed;
	    this._flickIntensity = 1 / (1.1 * this.flickIntensity);
	    this._flickMax = 1000;
	    this._flickCounter = this.flickMax;
    }

    update() {
        if (!this._ref.status) return;
        if (this._flickCounter > 0 && Math.randomInt(this._flickCounter / 5) !== 0) {
            this._flickCounter -= this._flickSpeed;
            this._sprite.alpha = this.oalpha;
        } else {
            this._flickCounter = this._flickMax;
            this._sprite.alpha = this._flickIntensity;
        }
    }
}

class PulseAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);
        this.pulsating = true;
        this.range = 1;
        this.pulseFactor = ref.pulsefactor / 100;
        this.pulseMax = this.range + this.pulseFactor;
		this.pulseMin = this.range - this.pulseFactor;
        this.pulseSpeed = ref.pulsespeed / 1000;
        
        this.tick = this.space = 0;
    }

    set(range, time) {
        this.tick = time;
        this.space = (range - this.range) / time;
    }

    updating() {
        return this.pulseFactor !== 0;
    }

    update() {
    	if (!this._ref.status) return;
        let spd = Math.random() / 500 + this.pulseSpeed;
        if (this.pulsating) {
	        if (this._sprite.scale.x < this.pulseMax) {
	            this._sprite.scale.x += spd;
	            this._sprite.scale.y += spd;
	        } else {
	            this.pulsating = false;
	        }
	    } else {
	        if (this._sprite.scale.x > this.pulseMin) {
	            this._sprite.scale.x -= spd;
	            this._sprite.scale.y -= spd;
	        } else {
	            this.pulsating = true;
	        }
	    }
    }
}

class RotationAnimation extends Shora.Animation {
    constructor(sprite, angle) {
        super(sprite, 0);
        this.r0 = this.r1 = angle; 
        this.delta = this.tick = this.time = 0;
        this._sprite.rotation = angle;
    }

    updating() {
        return this._sprite.rotation || this.tick < this.time;
    }

    update() {
        if (this.tick < this.time) {
            this._sprite.rotation = this.r0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
        }
    }

    set(angle, time, type) {
        this.r0 = this._sprite.rotation; this.r1 = angle;
        this.delta = this.r1 - this.r0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class DirectionManager {
    constructor(sprite) {
        this._sprite = sprite; 
        this.direction = this._sprite.character.direction();
        this.rotate = new RotationAnimation(sprite, this.angle());
    }

    destroy() {
        this.rotate.destroy();
        this.rotate = null;
        this._sprite = null;
    }

    angle() {
        let dest = [3.125, 4.6875, 1.5625, 0]; //[ [3.125, 4.6875, 1.5625, 0], [-3.125, -1.5625, -4.6825, 6.25] ];
        let x = dest[this.direction / 2 - 1];
        if (Math.abs(this._sprite.rotation - 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation -= 6.25;
        else if (Math.abs(this._sprite.rotation + 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation += 6.25;
        return x;
    }

    update() {
        if (this.direction != this._sprite.character.direction()) {
            this.direction = this._sprite.character.direction();
            this.rotate.set(this.angle(), 20, 2);
         }
        this.rotate.update();
    }

}

class OffsetAnimation {
    constructor(offset) {
        // ref
        this.offset = offset;
        this.ox = offset.x;
        this.oy = offset.y;
        this.tick_x = 2; this.time_x = this.delta_x = 1;
        this.tick_y = 2; this.time_y = this.delta_y = 1;
        this.type_x = this.type_y = 0;
    }

    updating() {
        return this.tick_x <= this.time_x || this.tick_y <= this.time_y;
    }

    setX(x, time, type) {
        this.ox = this.offset.x;
        this.delta_x = x - this.ox;
        this.time_x = time; this.tick_x = 1;
        if (type) this.type_x = type - 1;
    }

    setY(y, time, type) {
        this.oy = this.offset.y;
        this.delta_y = y - this.oy;
        this.time_y = time; this.tick_y = 1;
        if (type) this.type_y = type - 1;
    }

    update() {
        if (this.tick_x <= this.time_x) {
            this.offset.x = this.ox + Shora.Animation.transition[this.type_x](this.tick_x / this.time_x) * this.delta_x;
            this.tick_x++;
        }
        if (this.tick_y <= this.time_y) {
            this.offset.y = this.oy + Shora.Animation.transition[this.type_y](this.tick_y / this.time_y) * this.delta_y;
            this.tick_y++;
        }
    }

    destroy() {
        this.offset = null;
    }

    get x() {
        return this.offset.x;
    }
    get y() {
        return this.offset.y;
    }
}

class ColorAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);
        this._sprite.tint = ref.tint || Math.round(Math.random() * 0xfffff);

        this.ocolor = Shora.ColorManager.hexToRGB(ref.tint);
        this.dcolor = this.ocolor;
        this.tick = this.len = 0;
    }
    set(color, time) {
        this.tick = 0; this.len = time;
        this.ocolor = this.dcolor;
        this.dcolor = Shora.ColorManager.hexToRGB(color);
    }
    update() {
        if (this.tick < this.len) {
            let p = this.tick / this.len;
            this._ref.tint = this._sprite.tint = Shora.ColorManager.transition(p, this.ocolor, this.dcolor);
            this.tick++;
        }
    }
}

