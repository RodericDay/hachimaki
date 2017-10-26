(function main() {

const canvas = document.querySelector("canvas");
const scene = new Scene(canvas, 320, 240);
const player = new Player(scene, {x:160, y:120});
player.listen({
    "ArrowLeft":  ()=>player.vx-=1.5,
    "ArrowRight": ()=>player.vx+=1.5,
    "ArrowUp":    ()=>player.vy-=1.5,
    "ArrowDown":  ()=>player.vy+=1.5,
});
const thickness = 10;
const walls = [
    new Entity(scene, {x:0, y:0, w:canvas.width, h:thickness}),
    new Entity(scene, {x:0, y:0, w:thickness, h:canvas.height}),
    new Entity(scene, {x:0, y:canvas.height-thickness, w:canvas.width, h:thickness}),
    new Entity(scene, {x:canvas.width-thickness, y:0, w:thickness, h:canvas.height}),
    new Entity(scene, {x:canvas.width/3, y:canvas.height/3, w:thickness, h:thickness}),
];

function render(t){
    document.title = `${[player.vx, player.vy, Array.from(player.pressed)]}`;
    scene.clear();
    walls.forEach(wall=>wall.render({fill:"gray"}));
    player.resolve();

    const collision = player.nextCollision(walls);
    player.move(collision.time);
    if(collision.target) {
        player.slide(collision.normal);
        const collision2 = player.nextCollision(walls);
        player.move(collision2.target?collision2.time:1-collision.time);
    }
    player.velocity = {vx: player.vx * 0.9|0, vy: player.vy * 0.9|0};

    player.render({fill: "red"});
    requestAnimationFrame(render);
}

render(0);

})()
