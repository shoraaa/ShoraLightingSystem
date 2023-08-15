import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import externalGlobals from "rollup-plugin-external-globals";

export default {
  input: 'src/index.ts',
  output: [
    {
      sourcemap: true,
      file: 'D:/Projects/Shora Lighting Project/ShoraLightingSystemDemoMZ.v.2.0/js/plugins/ShoraLightingSystem.js',
      format: 'iife',
    },
    {
      sourcemap: true,
      file: 'D:/Projects/Shora Lighting Project/ShoraLightingSystemDemoMV.v.2.0/js/plugins/ShoraLightingSystem.js',
      format: 'iife',
    },
    {
      sourcemap: true,
      file: 'ShoraLightingSystem.js',
      format: 'iife',
    },
  ],
  plugins: [
    typescript(),
    json(),
    externalGlobals({
      rmmz: "window",
      'pixi.js': 'PIXI',
    }),
  ],
  external: ['rmmz', 'pixi.js'],

};