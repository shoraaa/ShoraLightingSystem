
// Contains initialize stuff & MV/MZ overload (plugin command iterface)

var Shora = Shora || {};
Shora.Lighting = {};
Shora.Lighting.pluginName = '-ShoraLighting-';
Shora.Lighting.VERSION = 1.81;
Shora.Lighting.PARAMETERS = PluginManager.parameters(Shora.Lighting.pluginName);

Shora.tempGraphics = new PIXI.Graphics();

Shora.tempMatrix = new PIXI.Matrix();
Shora.curRenderTexture = PIXI.RenderTexture.create();
// Shora.maskTexture = PIXI.RenderTexture.create(1280, 720);
// Shora.DEBUG_GRAPHICS = new PIXI.Graphics();

// Regex
Shora.REGEX = {
    TAG: /\[([\w_\d]+)\]/,
    COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\]/,
    DOUBLE_COMMAND: /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/
};

// Color Helper
Shora.Color = {};

Shora.MessageY = 0;
Shora.warn = function(err) {
    const message = new PIXI.Text('Shora Lighting Plugin: ' + err, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'left'});
    message.y += Shora.MessageY; Shora.MessageY += message.height;
    if (Graphics.app.stage) Graphics.app.stage.addChild(message);
}

Shora.CallCommand = function(settings, command) {
    if (!command || command.length <= 2) return;
    // [<name>, <param1>, <value1>, ..]
    command = command.substring(1, command.length - 1).split(' ');
    // fallback
    if (command.length === 2) 
        return console.warn('Please use the new syntax for lights comment: \n[<name> -<param1> <value1> -<param2> <value2> ...]'), settings.name = command[1];
    if (command[0] === 'light') command[0] = 'default';
    if (!$shoraLayer.LIGHTING[command[0]]) return;
    settings.name = command[0];
    for (let i = 1; i < command.length; i += 2) {
        value = command[i + 1];
        switch (command[i].toLowerCase()) {
            case '-radius':
            case '-r':
                settings.radius = Number(value) / 100;
                break;
            case '-angle':
            case '-a':
                settings.angle = Number(value) / 57.6;
                break;
            case '-offsetx':
            case '-x':
                settings.offsetx = Number(value);
                break;
            case '-offsety':
            case '-y':
                settings.offsety = Number(value);
                break;
            case '-shadowoffsetx':
            case '-sx':
                settings.shadowoffsetx = Number(value);
                break;
            case '-shadowoffsety':
            case '-sy':
                settings.shadowoffsety = Number(value);
                break;
            case '-direction':
            case '-d':
                settings.direction = value === 'on';
                break;
            case '-tint':
            case '-t':
                settings.tint = value.toHexValue();
                break;
            case '-shadow':
            case '-sh':
                settings.shadow = value === 'on';
                break;
            case 'behindwall':
            case 'bw':
                settings.bwall = value === 'on';
                break;
        }
    }
    
};

String.prototype.toHexValue = function() {
    if (Shora.Color[this]) return Shora.Color[this];
    if (this.length == 6) return parseInt(this, 16);
    return parseInt(this.substr(1), 16);
};
String.prototype.toRGBA = function() {
    let s = this.substr(5, this.length - 6);
    let a = s.split(",");
    return a.map(x => Number(x.trim()));
};
String.prototype.shoraTag = function() {
    return this.match(Shora.REGEX.TAG);
};
String.prototype.shoraCommand = function() {
    return this.match(Shora.REGEX.COMMAND);
};
String.prototype.shoraDoubleCommands = function() {
    return this.match(Shora.REGEX.DOUBLE_COMMAND);
};

class KawaseBlurFilter extends PIXI.Filter {
    constructor(blur, quality) {
        const fragment = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;

        uniform vec2 uOffset;

        void main(void)
        {
            vec4 color = vec4(0.0);

            color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + uOffset.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y));
            color += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - uOffset.y));

            // Average
            color *= 0.25;

            gl_FragColor = color;
        }
        `;
        super(null, fragment);
        this._kernels = [];
        this.uniforms.uOffset = new Float32Array(2);
        this._pixelSize = new Point(1);
        // if `blur` is array , as kernels
        if (Array.isArray(blur)) {
            this.kernels = blur;
        }
        else {
            this._blur = blur;
            this.quality = quality;
        }
    }
    /**
     * Overrides apply
     * @private
     */
    apply(filterManager, input, output, clear) {
        const uvX = this._pixelSize.x / input.sourceFrame.width;
        const uvY = this._pixelSize.y / input.sourceFrame.height;
        let offset;
        if (this._quality === 1 || this._blur === 0) {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            const renderTarget = filterManager.getRenderTarget(true);
            let source = input;
            let target = renderTarget;
            let tmp;
            const last = this._quality - 1;
            for (let i = 0; i < last; i++) {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, 1);
                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);
            filterManager.returnRenderTarget(renderTarget);
        }
    }
    _updatePadding() {
        this.padding = Math.ceil(this._kernels.reduce((acc, v) => acc + v + 0.5, 0));
    }
    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    _generateKernels() {
        const blur = this._blur;
        const quality = this._quality;
        const kernels = [blur];
        if (blur > 0) {
            let k = blur;
            const step = blur / quality;
            for (let i = 1; i < quality; i++) {
                k -= step;
                kernels.push(k);
            }
        }
        this._kernels = kernels;
        this._updatePadding();
    }
    /**
     * The kernel size of the blur filter, for advanced usage.
     * @default [0]
     */
    get kernels() {
        return this._kernels;
    }
    set kernels(value) {
        if (Array.isArray(value) && value.length > 0) {
            this._kernels = value;
            this._quality = value.length;
            this._blur = Math.max(...value);
        }
        else {
            // if value is invalid , set default value
            this._kernels = [0];
            this._quality = 1;
        }
    }
    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @default false
     */
    get clamp() {
        return this._clamp;
    }
    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    set pixelSize(value) {
        if (typeof value === 'number') {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value)) {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof Point) {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
        else {
            // if value is invalid , set default value
            this._pixelSize.x = 1;
            this._pixelSize.y = 1;
        }
    }
    get pixelSize() {
        return this._pixelSize;
    }
    /**
     * The quality of the filter, integer greater than `1`.
     * @default 3
     */
    get quality() {
        return this._quality;
    }
    set quality(value) {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    }
    /**
     * The amount of blur, value greater than `0`.
     * @default 4
     */
    get blur() {
        return this._blur;
    }
    set blur(value) {
        this._blur = value;
        this._generateKernels();
    }
};

Shora.IsMV = PIXI.VERSION[0] < 5;
