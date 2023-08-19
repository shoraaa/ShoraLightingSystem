export class Layer extends PIXI.Sprite {
    render(renderer) {
        $gameLighting.render(renderer);
        super.render(renderer);
    }

}