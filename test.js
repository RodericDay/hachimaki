function render() {
    scene.clear('steelblue');

    scene.lock(player);
    tiles.forEach(tile=>tile.fill('lightgray'));

    if (!pause.checked) { player.resolve(tiles); }
    var mod = player.pressed.has(16)?"+shoot":"";
    if (player.midAir) { player.draw("jump"+mod); }
    else {
        if (player.vx) { player.draw("run"+mod, Math.abs(new Date()/150|0)); }
        else { player.draw("stand"+mod); }
    }

    scene.unlock();
}

function makeTiles(map, symbol, size) {
    return map
        .split('\n')
        .reverse()
        .map((row, i)=>row.split('').map((cell,j)=>
            cell===symbol?new Box(j*size, i*size, size, size):null))
        .reduce((a,b) => a.concat(b))
        .filter(a=>a);
}

scene = new Scene(100, 100, 3);
player = new Platformer('assets/megaman.json');
player.setPosition(50, 50);
tiles = makeTiles(map, '#', 16);

window.setInterval(render, 1000/60);
