type RegionID = {
    start: number, 
    end: number, 
    top: number, 
    ignore: number,
};

type TerrainTags = {
    wall: number, 
    topWall: number, 
};

type SoftShadowParameters = {
    status: boolean, 
    strength: number, 
    quality: number,
}

export default interface ShadowParameters {
    engineShadow: boolean,
    regionId: RegionID,
    terrainTags: TerrainTags,
    ambient: number, 
    topAmbient: number,
    soft: SoftShadowParameters,
};