function render(event) {
    scene.clear();
    tiles.forEach(tile => tile.fill('gray'));

    box.setPosition(100, 100);
    box.fill('blue');

    if (event) {
        var mouse = scene.transpose(event);
        box.setSpeed(mouse.x-100-box.w/2, mouse.y-100-box.h/2);
    } else {
        box.setSpeed(100, -100);
    }

    box.move(1);
    box.label('green', 'none');
    box.stroke('green');
    box.move(-1);

    collision = box.nextCollision(tiles);
    remaining = 1 - collision.time;

    box.move(collision.time);
    box.label('red', 'stop');
    box.stroke('red');

    box.deflect(collision.normal);
    box.move(remaining);
    box.label('orange', 'deflect');
    box.stroke('orange');
    box.move(-remaining);
    box.deflect(collision.normal);

    box.slide(collision.normal);
    box.move(remaining);
    box.label('purple', 'slide');
    box.stroke('purple');
    box.move(-remaining);

    collision = box.nextCollision(tiles);
    remaining = Math.min(remaining, collision.time);
    box.move(remaining);
    box.label('cyan', 'slide and stop');
    box.stroke('cyan');
}

scene = new Scene(300, 300);
box = new Box(100, 100, 60, 60);
tiles = [
    new Box(200, 10, 10, 10),
    new Box(200, 100, 100, 100),
    new Box(0, 250, 200, 50),
    new Box(10, 10, 50, 50),
    new Box(0, 80, 40, 10),
    new Box(0, 200, 50, 10),
];
window.onmousemove = render;
render();
