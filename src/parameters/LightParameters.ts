type IntensityParameters = {
    status: boolean, 
    strength: number, 
}

export default interface LightParameters {
    ambient: number,
    intensity: IntensityParameters,
};