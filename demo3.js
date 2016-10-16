function render() {
    scene.clear('lightblue');

    scene.lock(player);

    tiles.forEach(tile=>tile.fill('green'));
    player.resolve(tiles);
    player.fill('steelblue');

    scene.unlock();
}

map = `
    #
#  #   #
##    ##
########`
scene = new Scene(300, 300);
player = new Platformer(100, 200, 40, 40)
tiles = makeTiles(map, '#', 40);

window.setInterval(render, 1000/60);
