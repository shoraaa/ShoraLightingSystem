import { DataManager } from 'rmmz';
import Game_Lighting from "../lighting/Game_Lighting";
(window as any).$gameLighting = new Game_Lighting();

declare var $gameLighting: Game_Lighting;

const makeSaveContents: () => void = DataManager.makeSaveContents;
const extractSaveContents: (contents: any) => void = DataManager.extractSaveContents;

DataManager.makeSaveContents = function() {
    const contents: any = makeSaveContents();
    contents.lighting = $gameLighting.data;
    return contents;
}

DataManager.extractSaveContents = function(contents: any) {
    extractSaveContents(contents);
    $gameLighting.data = contents.lighting;
}