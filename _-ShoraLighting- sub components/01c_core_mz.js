

if (!Shora.isMV) {

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
        $gameLighting.setMapAmbient(args.color, Number(args.time) || 0, Number(args.type) || 0);
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
}

