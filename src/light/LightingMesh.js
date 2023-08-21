const frag = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void){   
        vec4 c = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(1.0);
    }`;