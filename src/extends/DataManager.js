

const makeSaveContents = DataManager.makeSaveContents;
const extractSaveContents = DataManager.extractSaveContents;

DataManager.makeSaveContents = function() {
    const contents = makeSaveContents();
    contents.lighting = $gameLighting.data;
    return contents;
}

DataManager.extractSaveContents = function(contents) {
    extractSaveContents(contents);
    $gameLighting.data = contents.lighting;
}