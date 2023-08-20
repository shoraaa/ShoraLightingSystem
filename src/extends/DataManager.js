import { lightingManager } from "../light/LightingManager";

const makeSaveContents = DataManager.makeSaveContents;
const extractSaveContents = DataManager.extractSaveContents;

DataManager.makeSaveContents = function() {
    const contents = makeSaveContents();
    contents.lighting = lightingManager.data;
    return contents;
}

DataManager.extractSaveContents = function(contents) {
    extractSaveContents(contents);
    lightingManager.data = contents.lighting;
}