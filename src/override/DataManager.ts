import { DataManager } from "rmmz";
import Game_Lighting from "../api/Game_Lighting";

declare global {
    interface Window { 
        $gameLighting: Game_Lighting;
    }
}

window.$gameLighting = new Game_Lighting();

// const createGameObjects: () => void = DataManager.createGameObjects;
// DataManager.createGameObjects = function() {
//     window.$gameLighting = new Game_Lighting();
//     createGameObjects();
// }

const makeSaveContents: () => void = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents: any = makeSaveContents();
    contents.lighting = window.$gameLighting.data;
    return contents;
}

const extractSaveContents: (contents: any) => void = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents: any) {
    extractSaveContents(contents);
    window.$gameLighting.data = contents.lighting;
}