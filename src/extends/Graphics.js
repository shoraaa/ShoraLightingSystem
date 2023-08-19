import { engineName } from "../parameters/index";

if (engineName === 'MV') {
    const _createRenderer = Graphics._createRenderer;
    Graphics._createRenderer = function() {
        _createRenderer.call(this);
        this.app = { renderer: this._renderer };
    };
}