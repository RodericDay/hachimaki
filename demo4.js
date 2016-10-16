function render() {
    scene.clear('steelblue');

    scene.lock(player);
    tiles.forEach(tile=>tile.fill('lightgray'));

    player.resolve(tiles);
    var mod = player.pressed.has(16)?"+shoot":"";
    if (player.midAir) { sprite.draw(player, "jump"+mod); }
    else {
        if (player.vx) { sprite.draw(player, "run"+mod, Math.abs(new Date()/150|0)); }
        else { sprite.draw(player, "stand"+mod); }
    }

    scene.unlock();
}

map = `
                         ##
                     ##
#####
####       ####  ##
##        ####
##        ####
##############                #####`
scene = new Scene(100, 100, 3);
player = new Platformer(100, 200, 12, 20)
tiles = makeTiles(map, '#', 16);
sprite = new Sprite('assets/megaman.json');

render();
window.setInterval(render, 1000/60);
