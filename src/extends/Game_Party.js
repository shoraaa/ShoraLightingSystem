
const gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    gainItem.call(this, item, amount, includeEquip);
    $gamePlayer.scanLighting();
}