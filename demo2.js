function render() {
    scene.clear();
    tiles.forEach(tile => tile.fill('gray'));

    player.resolve(tiles);
    player.fill('steelblue');
    player.label('steelblue', [...player.pressed])
}

scene = new Scene(300, 300);
player = new Platformer(100, 250, 50, 50);
tiles = [
    new Box(50, 50, 200, 10),
    new Box(50, 51, 10, 100),
    new Box(150, 151, 10, 50),
];

window.setInterval(render, 1000/60);
