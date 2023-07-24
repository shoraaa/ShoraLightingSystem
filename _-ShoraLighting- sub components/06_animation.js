
/* All the animation classes, for use with lighting and ambient color changing. */

Shora.Animation = class {
    constructor(sprite, ref) {
        this._sprite = sprite;
        this._ref = ref;
        this._changed = false;
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
        if (!ref.status) return;

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

class ScaleAnimation extends Shora.Animation {
    constructor(light, ref) {
        super(light, ref);
<<<<<<< HEAD:_-ShoraLighting- sub components/06_animation.js
        this.s0 = this.s1 = this.maxRadius = 1;
        this.delta = this.tick = 0; 
        this.time = -1; 
=======
        this.s0 = this.s1 = ref.radius; 
        this.delta = this.tick = 0; this.time = -1;
        this.originalScale = ref.radius;
        this._sprite.scale.set(Math.round(ref.radius));

    }

    updating() {
        return this.tick <= this.time;
>>>>>>> 19329612b556c9ef53d70496d90e386be2feed6d:_ShoraLighting sub components/09_Animation.js
    }

    update() {
        this._changed = false;

        if (this.tick <= this.time) {
            let oldRadius = this._ref.radius;
            this._ref.radius = this.s0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this._sprite.scale.set(this._ref.radius);
            this.tick++;
            this._changed = oldRadius !== this._ref.radius;
        } 

        if (!this._changed && this._sprite._shadow && this._ref.radius > this.maxRadius) {
            this._sprite.forceRecalculateShadow = true;
            this.maxRadius = this._ref.radius;
        }
    }

    set(scale, time, type) {
        if (scale === this.s1) return;
        this.s0 = this._sprite.scale.x; this.s1 = scale;
        this.delta = this.s1 - this.s0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class PulseAnimation extends Shora.Animation {
    constructor(light, ref, radius) {
        super(light, ref);
        if (!ref.status) return;

        const dif = radius * ref.pulsefactor / 100;
        this.maxRadius = radius + dif;
        this.minRadius = radius - dif;

        this.tick = Math.floor(ref.pulsespeed * 30);
        light.radius.set(this.maxRadius, this.tick, 2);
        this.increasing = true;
    }

    update() {
        if (!this._ref.status) return;
        if (this.increasing && this._sprite.scale.x === this.maxRadius) {
            this.increasing = false;
            this._sprite.radius.set(this.minRadius, this.tick, 2);
        } else if (!this.increasing && this._sprite.scale.x === this.minRadius) {
            this.increasing = true;
            this._sprite.radius.set(this.maxRadius, this.tick, 2);
        }
    }

    
    
}

class AngleAnimation extends Shora.Animation {
    constructor(light, ref) {
        super(light, ref);
<<<<<<< HEAD:_-ShoraLighting- sub components/06_animation.js
        this.a0 = this.a1 = 0; 
=======
        this.a0 = this.a1 = ref.angle; 
>>>>>>> 19329612b556c9ef53d70496d90e386be2feed6d:_ShoraLighting sub components/09_Animation.js
        this.delta = this.tick = 0; this.time = -1;

        this._character = light.character;
        this.direction = this._character ? this._character.direction() : null;
    }

    destroy() {
        super.destroy();
        this._character = null;
    }

    angle() {
        // update .rotation for pixiv4 compatibility
        let dest = [3.125, 4.6875, 1.5625, 0]; 
        let x = dest[this.direction / 2 - 1];
        if (Math.abs(this._sprite.rotation - 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation -= 6.25;
        else if (Math.abs(this._sprite.rotation + 6.25 - x) < Math.abs(this._sprite.rotation - x)) 
            this._sprite.rotation += 6.25;
        return x;
    }

    update() {
        this._changed = false;

        if (this._ref.direction && this.direction != this._character.direction()) {
            this.direction = this._character.direction();
            this.set(this.angle(), 20, 2);
         }

        if (this.tick <= this.time) {
            this._ref.angle 
            = this._sprite.rotation 
            = this.a0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
            this._changed = true;
        } 
    }

    set(angle, time, type) {
        this.a0 = this._sprite.rotation; this.a1 = angle;
        this.delta = this.a1 - this.a0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
    }
    
}

class TintAnimation extends Shora.Animation {
    constructor(sprite, ref) {
        super(sprite, ref);
        this._sprite.tint = ref.tint || Math.round(Math.random() * 0xfffff);

        this.ocolor = Shora.ColorManager.hexToRGB(ref.tint);
        this.dcolor = this.ocolor;
        this.tick = 0; this.len = -1;
    }
    set(color, time) {
        this.tick = 0; this.len = time;
        this.ocolor = this.dcolor;
        this.dcolor = Shora.ColorManager.hexToRGB(color);
    }
    update() {
        if (this.tick <= this.len) {
            let p = this.tick / this.len;
            this._ref.tint = this._sprite.tint = Shora.ColorManager.transition(p, this.ocolor, this.dcolor);
            this.tick++;
        }
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
        this._changed = false;

        if (this.tick_x <= this.time_x) {
            this.offset.x = this.ox + Shora.Animation.transition[this.type_x](this.tick_x / this.time_x) * this.delta_x;
            this.tick_x++;
            this._changed = true;
        }
        if (this.tick_y <= this.time_y) {
            this.offset.y = this.oy + Shora.Animation.transition[this.type_y](this.tick_y / this.time_y) * this.delta_y;
            this.tick_y++;
            this._changed = true;
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
Shora.ColorManager = {
    hexToRGB: function(c) {
        return [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, (c & 0x0000ff)];
    },
    RGBToHex: function([r, g, b]) {
        return (r << 16) + (g << 8) + (b);
    },
    transition: function(f, [r1, g1, b1], [r2, g2, b2]) {
        return ((r2 - r1) * f + r1) << 16 | ((g2 - g1) * f + g1) << 8 | ((b2 - b1) * f + b1);
    }
}

