if (!Shora.IsMV) {

ImageManager.loadLight = function(filename) {
    const url = 'img/lights/' + Utils.encodeURI(filename);
    return Bitmap.load(url);
};

const { pluginName } = Shora.Lighting;

// Add new statical light into map
PluginManager.registerCommand(pluginName, 'Add Static Light', args => {
    $gameLighting.addStaticLight(Number(args.x), Number(args.y), args.ref);
});

// Change map ambient color
PluginManager.registerCommand(pluginName, 'Set Map Ambient', args => {
    $gameLighting.setMapAmbient(args.color, Number(args.time) || 0);
});

// Change shadow ambient color
PluginManager.registerCommand(pluginName, 'Set Shadow Ambient', args => {
    $gameLighting.setShadowAmbient(args.color);
});

// Change Top Block ambient color
PluginManager.registerCommand(pluginName, 'Set Top Block Ambient', args => {
    $gameLighting.setTopBlockAmbient(args.color);
});

// Set light color
PluginManager.registerCommand(pluginName, 'Set Light Parameters', function(args) {
    let id = args.id == "" ? this._eventId : Number(args.id);
    if ($gameMap._lighting[id]) {
        let time = Number(args.time);
        let type = Number(args.type);
        let params = JSON.parse(args.parameters);
        if (params.offset !== "") {
            params.offset = JSON.parse(params.offset);
            $gameLighting.setOffsetX(id, params.offset.x, time, type);
            $gameLighting.setOffsetY(id, params.offset.y, time, type);
        }
        $gameLighting.setStatus(id, params.status);
        $gameLighting.setShadow(id, params.shadow);
        $gameLighting.setRadius(id, params.radius, time, type);
        $gameLighting.setAngle(id, params.angle, time, type);
        $gameLighting.setTint(id, params.tint, time, type);
    }
});

LightingShaderGenerator = new PIXI.BatchShaderGenerator(`
    precision highp float;
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec4 aColor;
    attribute float aTextureId;
    
    uniform mat3 projectionMatrix;
    uniform mat3 translationMatrix;
    uniform vec4 tint;
    
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    varying float vTextureId;
    
    void main(void){
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    
        vTextureCoord = aTextureCoord;
        vTextureId = aTextureId;
        vColor = aColor * tint;
    }
`, `
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    varying float vTextureId;
    uniform sampler2D uSamplers[%count%];

    void main(void){
        vec4 color;
        %forloop%
        gl_FragColor = color * vColor;
    }
`);

LightingShaderGenerator.generateSampleSrc = function(maxTextures)
{
    var src = '';

    src += '\n';
    src += '\n';

    maxTextures /= 2;

    for (var i = 0; i < maxTextures; i++)
    {
        if (i > 0)
        {
            src += '\nelse ';
        }

        if (i < maxTextures - 1)
        {
            src += "if(vTextureId < " + i + ".5)";
        }

        src += '\n{';
        src += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);";
        src += "\n\tcolor = color * texture2D(uSamplers[" + (maxTextures * 2 - i - 1) + "], vTextureCoord);";
        src += '\n}';
    }

    src += '\n';
    src += '\n';

    return src;
};

// ((_) => {
//     const contextChange = _.contextChange;
//     _.contextChange = function() {
//         contextChange.call(this);
//         this._lightingShader = LightingShaderGenerator.generateShader(this.MAX_TEXTURES);
//         // this._lightingShader = this._shader;
//         console.log(this._lightingShader.program.fragmentSrc);
//     };

//     _.render = function(element)
//     {
//         if (!element._texture.valid)
//         {
//             return;
//         }

//         if (this._vertexCount + (element.vertexData.length / 2) > this.size)
//         {
//             this.flush();
//         }

//         this._vertexCount += element.vertexData.length / 2;
//         this._indexCount += element.indices.length;
//         this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
//         this._bufferedElements[this._bufferSize++] = element;
//     };

//     _.bindAndClearLightingTexArray = function(texArray) {
//         var textureSystem = this.renderer.texture;
//         var _j;
//         for (var j = 0; j < texArray.count; j++)
//         {
//             textureSystem.bind(texArray.elements[j], texArray.ids[j]);
//             textureSystem.bind(texArray.elements[j].shadow, this.MAX_TEXTURES - texArray.ids[j] - 1);
//             texArray.elements[j] = null;
//         }
//         texArray.shadowTex = null;
//         texArray.count = 0;
//     };
//     _.buildLightingDrawCalls = function(texArray, start, finish)
//     {
//         var ref = this;
//         var elements = ref._bufferedElements;
//         var _attributeBuffer = ref._attributeBuffer;
//         var _indexBuffer = ref._indexBuffer;
//         var vertexSize = ref.vertexSize;
//         var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

//         var dcIndex = this._dcIndex;
//         var aIndex = this._aIndex;
//         var iIndex = this._iIndex;

//         var drawCall = drawCalls[dcIndex];

//         drawCall.start = this._iIndex;
//         drawCall.texArray = texArray;

//         for (var i = start; i < finish; ++i)
//         {
//             var sprite = elements[i];
//             var tex = sprite._texture.baseTexture;
//             var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
//                 tex.alphaMode ? 1 : 0][sprite.blendMode];
//             elements[i] = null;
//             this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
//             aIndex += sprite.vertexData.length / 2 * vertexSize;
//             iIndex += sprite.indices.length;
//             drawCall.blend = spriteBlendMode;
//         }
//         drawCall.size = iIndex - drawCall.start;
//         ++dcIndex;
//         this._dcIndex = dcIndex;
//         this._aIndex = aIndex;
//         this._iIndex = iIndex;
//     };
//     _.buildLightingTexturesAndDrawCalls = function() {
//         var ref = this;
//         var textures = ref._bufferedTextures;
//         var elements = ref._bufferedElements;
//         var MAX_TEXTURES = ref.MAX_TEXTURES / 2;
//         var textureArrays = PIXI.AbstractBatchRenderer._textureArrayPool;
//         var batch = this.renderer.batch;
//         var boundTextures = this._tempBoundTextures;
//         var touch = this.renderer.textureGC.count;

//         var TICK = ++PIXI.BaseTexture._globalBatch;
//         var countTexArrays = 0;
//         var texArray = textureArrays[0];
//         var start = 0;

//         batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

//         for (var i = 0; i < this._bufferSize; ++i)
//         {
//             var tex = textures[i];

//             textures[i] = null;
//             if (tex._batchEnabled === TICK)
//             {
//                 continue;
//             }

//             if (texArray.count >= MAX_TEXTURES)
//             {
//                 batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//                 this.buildLightingDrawCalls(texArray, start, i);
//                 start = i;
//                 texArray = textureArrays[++countTexArrays];
//                 ++TICK;
//             }

//             tex._batchEnabled = TICK;
//             tex.touched = touch;
//             texArray.elements[texArray.count] = tex;
//             texArray.count++;
//         }

//         if (texArray.count > 0)
//         {
//             batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//             this.buildLightingDrawCalls(texArray, start, this._bufferSize);
//             ++countTexArrays;
//             ++TICK;
//         }

//         // Clean-up

//         for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
//         {
//             boundTextures[i$1] = null;
//         }
//         PIXI.BaseTexture._globalBatch = TICK;
//     };
//     _.drawLightingBatches = function () {
//         var dcCount = this._dcIndex;
//         var ref = this.renderer;
//         var gl = ref.gl;
//         var stateSystem = ref.state;
//         var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

//         var curTexArray = null;

//         // Upload textures and do the draw calls
//         for (var i = 0; i < dcCount; i++)
//         {
//             var ref$1 = drawCalls[i];
//             var texArray = ref$1.texArray;
//             var type = ref$1.type;
//             var size = ref$1.size;
//             var start = ref$1.start;
//             var blend = ref$1.blend;

//             if (curTexArray !== texArray)
//             {
//                 curTexArray = texArray;
//                 this.bindAndClearLightingTexArray(texArray);
//             }

//             this.state.blendMode = blend;
//             stateSystem.set(this.state);
//             gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
//         }
//     };
//     _.flush = function() {
//         if (this._vertexCount === 0)
//         {
//             return;
//         }

//         this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
//         this._indexBuffer = this.getIndexBuffer(this._indexCount);
//         this._aIndex = 0;
//         this._iIndex = 0;
//         this._dcIndex = 0;

//         if (this.renderer.renderingLighting) {
//             this.buildLightingTexturesAndDrawCalls();
//             this.updateGeometry();
//             this.drawLightingBatches();
//         } else {
//             this.buildTexturesAndDrawCalls();
//             this.updateGeometry();
//             this.drawBatches();
//         }

//         // reset elements buffer for the next flush
//         this._bufferSize = 0;
//         this._vertexCount = 0;
//         this._indexCount = 0;
//     };
// })(PIXI.AbstractBatchRenderer.prototype); 

// function LightingRenderer(renderer) {
//     PIXI.ObjectRenderer.call(this, renderer);
//     this.shaderGenerator = LightingShaderGenerator;
//     this.geometryClass = PIXI.BatchGeometry;
//     this.vertexSize = 6;
//     this.state = PIXI.State.for2d();
//     this.size = PIXI.settings.SPRITE_BATCH_SIZE * 4;
//     this._vertexCount = 0;
//     this._indexCount = 0;
//     this._bufferedElements = [];
//     this._bufferedTextures = [];
//     this._bufferSize = 0;
//     this._shader = null;
//     this._packedGeometries = [];
//     this._packedGeometryPoolSize = 2;
//     this._flushId = 0;
//     this._aBuffers = {};
//     this._iBuffers = {};
//     this.MAX_TEXTURES = 1;

//     this.renderer.on('prerender', this.onPrerender, this);
//     renderer.runners.contextChange.add(this);

//     this._dcIndex = 0;
//     this._aIndex = 0;
//     this._iIndex = 0;
//     this._attributeBuffer = null;
//     this._indexBuffer = null;
//     this._tempBoundTextures = [];
// }

// if ( PIXI.ObjectRenderer ) { LightingRenderer.__proto__ = PIXI.ObjectRenderer; }
// LightingRenderer.prototype = Object.create( PIXI.ObjectRenderer && PIXI.ObjectRenderer.prototype );
// LightingRenderer.prototype.constructor = LightingRenderer;

// LightingRenderer._drawCallPool = [];
// LightingRenderer._textureArrayPool = [];

// /**
//  * Handles the `contextChange` signal.
//  *
//  * It calculates `this.MAX_TEXTURES` and allocating the
//  * packed-geometry object pool.
//  */
// LightingRenderer.prototype.contextChange = function contextChange ()
// {
//     var gl = this.renderer.gl;

//     // step 1: first check max textures the GPU can handle.
//     this.MAX_TEXTURES = Math.min(
//         gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
//         PIXI.settings.SPRITE_MAX_TEXTURES);
    
//     this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);

//     // we use the second shader as the first one depending on your browser
//     // may omit aTextureId as it is not used by the shader so is optimized out.
//     for (var i = 0; i < this._packedGeometryPoolSize; i++)
//     {
//         /* eslint-disable max-len */
//         this._packedGeometries[i] = new (this.geometryClass)();
//     }

//     this.initFlushBuffers();
// };

// /**
//  * Makes sure that static and dynamic flush pooled objects have correct dimensions
//  */
// LightingRenderer.prototype.initFlushBuffers = function initFlushBuffers ()
// {
//     var _drawCallPool = LightingRenderer._drawCallPool;
//     var _textureArrayPool = LightingRenderer._textureArrayPool;
//     // max draw calls
//     var MAX_SPRITES = this.size / 4;
//     // max texture arrays
//     var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;

//     while (_drawCallPool.length < MAX_SPRITES)
//     {
//         _drawCallPool.push(new PIXI.BatchDrawCall());
//     }
//     while (_textureArrayPool.length < MAX_TA)
//     {
//         _textureArrayPool.push(new PIXI.BatchTextureArray());
//     }
//     for (var i = 0; i < this.MAX_TEXTURES; i++)
//     {
//         this._tempBoundTextures[i] = null;
//     }
// };

// /**
//  * Handles the `prerender` signal.
//  *
//  * It ensures that flushes start from the first geometry
//  * object again.
//  */
// LightingRenderer.prototype.onPrerender = function onPrerender ()
// {
//     this._flushId = 0;
// };

// /**
//  * Buffers the "batchable" object. It need not be rendered
//  * immediately.
//  *
//  * @param {PIXI.DisplayObject} element - the element to render when
//  *    using this renderer
//  */
// LightingRenderer.prototype.render = function render (element)
// {
//     if (!element._texture.valid)
//     {
//         return;
//     }

//     if (this._vertexCount + (element.vertexData.length / 2) > this.size)
//     {
//         this.flush();
//     }

//     this._vertexCount += element.vertexData.length / 2;
//     this._indexCount += element.indices.length;
//     this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
//     this._bufferedElements[this._bufferSize++] = element;
// };

// LightingRenderer.prototype.buildTexturesAndDrawCalls = function buildTexturesAndDrawCalls ()
// {
//     var ref = this;
//     var textures = ref._bufferedTextures;
//     var MAX_TEXTURES = ref.MAX_TEXTURES;
//     var textureArrays = LightingRenderer._textureArrayPool;
//     var batch = this.renderer.batch;
//     var boundTextures = this._tempBoundTextures;
//     var touch = this.renderer.textureGC.count;

//     var TICK = ++PIXI.BaseTexture._globalBatch;
//     var countTexArrays = 0;
//     var texArray = textureArrays[0];
//     var start = 0;

//     batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

//     for (var i = 0; i < this._bufferSize; ++i)
//     {
//         var tex = textures[i];

//         textures[i] = null;
//         if (tex._batchEnabled === TICK)
//         {
//             continue;
//         }

//         if (texArray.count >= MAX_TEXTURES)
//         {
//             batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//             this.buildDrawCalls(texArray, start, i);
//             start = i;
//             texArray = textureArrays[++countTexArrays];
//             ++TICK;
//         }

//         tex._batchEnabled = TICK;
//         tex.touched = touch;
//         texArray.elements[texArray.count++] = tex;
//     }

//     if (texArray.count > 0)
//     {
//         batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
//         this.buildDrawCalls(texArray, start, this._bufferSize);
//         ++countTexArrays;
//         ++TICK;
//     }

//     // Clean-up

//     for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
//     {
//         boundTextures[i$1] = null;
//     }
//     PIXI.BaseTexture._globalBatch = TICK;
// };

// /**
//  * Populating drawcalls for rendering
//  *
//  * @param {PIXI.BatchTextureArray} texArray
//  * @param {number} start
//  * @param {number} finish
//  */
// LightingRenderer.prototype.buildDrawCalls = function buildDrawCalls (texArray, start, finish)
// {
//     var ref = this;
//     var elements = ref._bufferedElements;
//     var _attributeBuffer = ref._attributeBuffer;
//     var _indexBuffer = ref._indexBuffer;
//     var vertexSize = ref.vertexSize;
//     var drawCalls = LightingRenderer._drawCallPool;

//     var dcIndex = this._dcIndex;
//     var aIndex = this._aIndex;
//     var iIndex = this._iIndex;

//     var drawCall = drawCalls[dcIndex];

//     drawCall.start = this._iIndex;
//     drawCall.texArray = texArray;

//     for (var i = start; i < finish; ++i)
//     {
//         var sprite = elements[i];
//         var tex = sprite._texture.baseTexture;
//         var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
//             tex.alphaMode ? 1 : 0][sprite.blendMode];

//         elements[i] = null;

//         if (start < i && drawCall.blend !== spriteBlendMode)
//         {
//             drawCall.size = iIndex - drawCall.start;
//             start = i;
//             drawCall = drawCalls[++dcIndex];
//             drawCall.texArray = texArray;
//             drawCall.start = iIndex;
//         }

//         this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
//         aIndex += sprite.vertexData.length / 2 * vertexSize;
//         iIndex += sprite.indices.length;

//         drawCall.blend = spriteBlendMode;
//     }

//     if (start < finish)
//     {
//         drawCall.size = iIndex - drawCall.start;
//         ++dcIndex;
//     }

//     this._dcIndex = dcIndex;
//     this._aIndex = aIndex;
//     this._iIndex = iIndex;
// };

// /**
//  * Bind textures for current rendering
//  *
//  * @param {PIXI.BatchTextureArray} texArray
//  */
//  LightingRenderer.prototype.bindAndClearTexArray = function bindAndClearTexArray (texArray)
// {
//     var textureSystem = this.renderer.texture;

//     for (var j = 0; j < texArray.count; j++)
//     {
//         textureSystem.bind(texArray.elements[j], texArray.ids[j]);
//         texArray.elements[j] = null;
//     }
//     texArray.count = 0;
// };

// LightingRenderer.prototype.updateGeometry = function updateGeometry ()
// {
//     var ref = this;
//     var packedGeometries = ref._packedGeometries;
//     var attributeBuffer = ref._attributeBuffer;
//     var indexBuffer = ref._indexBuffer;

//     if (!PIXI.settings.CAN_UPLOAD_SAME_BUFFER)
//     { /* Usually on iOS devices, where the browser doesn't
//         like uploads to the same buffer in a single frame. */
//         if (this._packedGeometryPoolSize <= this._flushId)
//         {
//             this._packedGeometryPoolSize++;
//             packedGeometries[this._flushId] = new (this.geometryClass)();
//         }

//         packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
//         packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

//         this.renderer.geometry.bind(packedGeometries[this._flushId]);
//         this.renderer.geometry.updateBuffers();
//         this._flushId++;
//     }
//     else
//     {
//         // lets use the faster option, always use buffer number 0
//         packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
//         packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

//         this.renderer.geometry.updateBuffers();
//     }
// };

// LightingRenderer.prototype.drawBatches = function drawBatches ()
// {
//     var dcCount = this._dcIndex;
//     var ref = this.renderer;
//     var gl = ref.gl;
//     var stateSystem = ref.state;
//     var drawCalls = LightingRenderer._drawCallPool;

//     var curTexArray = null;

//     // Upload textures and do the draw calls
//     for (var i = 0; i < dcCount; i++)
//     {
//         var ref$1 = drawCalls[i];
//         var texArray = ref$1.texArray;
//         var type = ref$1.type;
//         var size = ref$1.size;
//         var start = ref$1.start;
//         var blend = ref$1.blend;

//         if (curTexArray !== texArray)
//         {
//             curTexArray = texArray;
//             this.bindAndClearTexArray(texArray);
//         }

//         this.state.blendMode = blend;
//         stateSystem.set(this.state);
//         gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
//     }
// };

// /**
//  * Renders the content _now_ and empties the current batch.
//  */
// LightingRenderer.prototype.flush = function flush ()
// {
//     if (this._vertexCount === 0)
//     {
//         return;
//     }

//     this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
//     this._indexBuffer = this.getIndexBuffer(this._indexCount);
//     this._aIndex = 0;
//     this._iIndex = 0;
//     this._dcIndex = 0;

//     this.buildTexturesAndDrawCalls();
//     this.updateGeometry();
//     this.drawBatches();

//     // reset elements buffer for the next flush
//     this._bufferSize = 0;
//     this._vertexCount = 0;
//     this._indexCount = 0;
// };

// /**
//  * Starts a new sprite batch.
//  */
// LightingRenderer.prototype.start = function start ()
// {
//     this.renderer.state.set(this.state);

//     this.renderer.shader.bind(this._shader);

//     if (PIXI.settings.CAN_UPLOAD_SAME_BUFFER)
//     {
//         // bind buffer #0, we don't need others
//         this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
//     }
// };

// /**
//  * Stops and flushes the current batch.
//  */
// LightingRenderer.prototype.stop = function stop ()
// {
//     this.flush();
// };

// LightingRenderer.prototype.destroy = function destroy ()
// {
//     for (var i = 0; i < this._packedGeometryPoolSize; i++)
//     {
//         if (this._packedGeometries[i])
//         {
//             this._packedGeometries[i].destroy();
//         }
//     }

//     this.renderer.off('prerender', this.onPrerender, this);

//     this._aBuffers = null;
//     this._iBuffers = null;
//     this._packedGeometries = null;
//     this._attributeBuffer = null;
//     this._indexBuffer = null;

//     if (this._shader)
//     {
//         this._shader.destroy();
//         this._shader = null;
//     }

//     ObjectRenderer.prototype.destroy.call(this);
// };

// /**
//  * Fetches an attribute buffer from `this._aBuffers` that
//  * can hold atleast `size` floats.
//  *
//  * @param {number} size - minimum capacity required
//  * @return {ViewableBuffer} - buffer than can hold atleast `size` floats
//  * @private
//  */
// LightingRenderer.prototype.getAttributeBuffer = function getAttributeBuffer (size)
// {
//     // 8 vertices is enough for 2 quads
//     var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 8));
//     var roundedSizeIndex = PIXI.utils.log2(roundedP2);
//     var roundedSize = roundedP2 * 8;

//     if (this._aBuffers.length <= roundedSizeIndex)
//     {
//         this._iBuffers.length = roundedSizeIndex + 1;
//     }

//     var buffer = this._aBuffers[roundedSize];

//     if (!buffer)
//     {
//         this._aBuffers[roundedSize] = buffer = new PIXI.ViewableBuffer(roundedSize * this.vertexSize * 4);
//     }

//     return buffer;
// };

// /**
//  * Fetches an index buffer from `this._iBuffers` that can
//  * has atleast `size` capacity.
//  *
//  * @param {number} size - minimum required capacity
//  * @return {Uint16Array} - buffer that can fit `size`
//  *    indices.
//  * @private
//  */
// LightingRenderer.prototype.getIndexBuffer = function getIndexBuffer (size)
// {
//     // 12 indices is enough for 2 quads
//     var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 12));
//     var roundedSizeIndex = PIXI.utils.log2(roundedP2);
//     var roundedSize = roundedP2 * 12;

//     if (this._iBuffers.length <= roundedSizeIndex)
//     {
//         this._iBuffers.length = roundedSizeIndex + 1;
//     }

//     var buffer = this._iBuffers[roundedSizeIndex];

//     if (!buffer)
//     {
//         this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
//     }

//     return buffer;
// };

// /**
//  * Takes the four batching parameters of `element`, interleaves
//  * and pushes them into the batching attribute/index buffers given.
//  *
//  * It uses these properties: `vertexData` `uvs`, `textureId` and
//  * `indicies`. It also uses the "tint" of the base-texture, if
//  * present.
//  *
//  * @param {PIXI.Sprite} element - element being rendered
//  * @param {PIXI.ViewableBuffer} attributeBuffer - attribute buffer.
//  * @param {Uint16Array} indexBuffer - index buffer
//  * @param {number} aIndex - number of floats already in the attribute buffer
//  * @param {number} iIndex - number of indices already in `indexBuffer`
//  */
// LightingRenderer.prototype.packInterleavedGeometry = function packInterleavedGeometry (element, attributeBuffer, indexBuffer, aIndex, iIndex)
// {
//     var uint32View = attributeBuffer.uint32View;
//     var float32View = attributeBuffer.float32View;

//     var packedVertices = aIndex / this.vertexSize;
//     var uvs = element.uvs;
//     var indicies = element.indices;
//     var vertexData = element.vertexData;
//     var textureId = element._texture.baseTexture._batchLocation;

//     var alpha = Math.min(element.worldAlpha, 1.0);
//     var argb = (alpha < 1.0
//         && element._texture.baseTexture.alphaMode)
//         ? PIXI.utils.premultiplyTint(element._tintRGB, alpha)
//         : element._tintRGB + (alpha * 255 << 24);

//     // lets not worry about tint! for now..
//     for (var i = 0; i < vertexData.length; i += 2)
//     {
//         float32View[aIndex++] = vertexData[i];
//         float32View[aIndex++] = vertexData[i + 1];
//         float32View[aIndex++] = uvs[i];
//         float32View[aIndex++] = uvs[i + 1];
//         uint32View[aIndex++] = argb;
//         float32View[aIndex++] = textureId;
//     }

//     for (var i$1 = 0; i$1 < indicies.length; i$1++)
//     {
//         indexBuffer[iIndex++] = packedVertices + indicies[i$1];
//     }
// };

class LightingRenderer extends PIXI.AbstractBatchRenderer {
    constructor(renderer) {
        super(renderer);
        this.vertexSize = 6;
        this.geometryClass = PIXI.BatchGeometry;
        this.shaderGenerator = LightingShaderGenerator;
    }

    initFlushBuffers() {
        // shared the same pool with abstract renderer
        return;
    }
    contextChange() {
        super.contextChange();
        console.log(this._shader.program.fragmentSrc);
    };  
    render(element) {
        if (!element._texture.valid)
            return;

        if (this._vertexCount + (element.vertexData.length / 2) > this.size)
            this.flush();

        this._vertexCount += element.vertexData.length / 2;
        this._indexCount += element.indices.length;
        this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
        this._bufferedElements[this._bufferSize++] = element;
    };

    bindAndClearTexArray(texArray) {
        var textureSystem = this.renderer.texture;
        for (var j = 0; j < texArray.count; j++)
        {
            textureSystem.bind(texArray.elements[j], texArray.ids[j]);
            textureSystem.bind(texArray.elements[j].shadow, this.MAX_TEXTURES - texArray.ids[j] - 1);
            texArray.elements[j] = null;
        }
        texArray.count = 0;
    };
    buildDrawCalls(texArray, start, finish)
    {
        var ref = this;
        var elements = ref._bufferedElements;
        var _attributeBuffer = ref._attributeBuffer;
        var _indexBuffer = ref._indexBuffer;
        var vertexSize = ref.vertexSize;
        var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

        var dcIndex = this._dcIndex;
        var aIndex = this._aIndex;
        var iIndex = this._iIndex;

        var drawCall = drawCalls[dcIndex];

        drawCall.start = this._iIndex;
        drawCall.texArray = texArray;

        for (var i = start; i < finish; ++i)
        {
            var sprite = elements[i];
            var tex = sprite._texture.baseTexture;
            var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
                tex.alphaMode ? 1 : 0][sprite.blendMode];
            elements[i] = null;
            this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
            aIndex += sprite.vertexData.length / 2 * vertexSize;
            iIndex += sprite.indices.length;
            drawCall.blend = spriteBlendMode;
        }
        drawCall.size = iIndex - drawCall.start;
        ++dcIndex;
        this._dcIndex = dcIndex;
        this._aIndex = aIndex;
        this._iIndex = iIndex;
    };
    buildTexturesAndDrawCalls() {
        var ref = this;
        var textures = ref._bufferedTextures;
        var elements = ref._bufferedElements;
        var MAX_TEXTURES = ref.MAX_TEXTURES / 2;
        var textureArrays = PIXI.AbstractBatchRenderer._textureArrayPool;
        var batch = this.renderer.batch;
        var boundTextures = this._tempBoundTextures;
        var touch = this.renderer.textureGC.count;

        var TICK = ++PIXI.BaseTexture._globalBatch;
        var countTexArrays = 0;
        var texArray = textureArrays[0];
        var start = 0;

        batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

        for (var i = 0; i < this._bufferSize; ++i)
        {
            var tex = textures[i];

            textures[i] = null;
            if (tex._batchEnabled === TICK)
            {
                continue;
            }

            if (texArray.count >= MAX_TEXTURES)
            {
                batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                this.buildDrawCalls(texArray, start, i);
                start = i;
                texArray = textureArrays[++countTexArrays];
                ++TICK;
            }

            tex._batchEnabled = TICK;
            tex.touched = touch;
            texArray.elements[texArray.count] = tex;
            texArray.count++;
        }

        if (texArray.count > 0)
        {
            batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
            this.buildDrawCalls(texArray, start, this._bufferSize);
            ++countTexArrays;
            ++TICK;
        }

        // Clean-up

        for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
        {
            boundTextures[i$1] = null;
        }
        PIXI.BaseTexture._globalBatch = TICK;
    };
    drawBatches() {
        var dcCount = this._dcIndex;
        var ref = this.renderer;
        var gl = ref.gl;
        var stateSystem = ref.state;
        var drawCalls = PIXI.AbstractBatchRenderer._drawCallPool;

        var curTexArray = null;

        // Upload textures and do the draw calls
        for (var i = 0; i < dcCount; i++)
        {
            var ref$1 = drawCalls[i];
            var texArray = ref$1.texArray;
            var type = ref$1.type;
            var size = ref$1.size;
            var start = ref$1.start;
            var blend = ref$1.blend;

            if (curTexArray !== texArray)
            {
                curTexArray = texArray;
                this.bindAndClearTexArray(texArray);
            }

            this.state.blendMode = blend;
            stateSystem.set(this.state);
            gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
        }
    };
    flush() {
        if (this._vertexCount === 0)
            return;

        this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
        this._indexBuffer = this.getIndexBuffer(this._indexCount);
        this._aIndex = 0;
        this._iIndex = 0;
        this._dcIndex = 0;

        this.buildTexturesAndDrawCalls();
        this.updateGeometry();
        this.drawBatches();

        // reset elements buffer for the next flush
        this._bufferSize = 0;
        this._vertexCount = 0;
        this._indexCount = 0;
    };
};

Shora.LightingRenderer = LightingRenderer;

}
