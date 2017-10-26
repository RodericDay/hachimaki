(function main() {

const canvas = document.querySelector("canvas");
const scene = new Scene(canvas, 320, 240);
const player = new Platformer(scene, {x:160, y:120}, 15);
player.listen({
    "ArrowLeft":  ()=>player.vx-=4,
    "ArrowRight": ()=>player.vx+=4,
    "ArrowUp":    ()=>player.jump(2.5),
    "ArrowDown":  ()=>null,
});
const walls = [
    new Entity(scene, {x:canvas.width*0.1, y:canvas.height*0.9, w:canvas.width*0.8, h:10}),
    new Entity(scene, {x:canvas.width/2, y:canvas.height*3/4, w:10, h:canvas.height/4}),
    new Entity(scene, {x:canvas.width/6, y:canvas.height/2, w:canvas.width/4, h:10}),
    new Entity(scene, {x:canvas.width/2, y:canvas.height/4, w:canvas.width/4, h:10}),
    new Entity(scene, {x:canvas.width*4/6, y:canvas.height*1/4, w:10, h:canvas.height/2-10}),
    new Entity(scene, {x:canvas.width*4/6, y:canvas.height-30, w:10, h:canvas.height/2}),
];

function render(t){
    document.title = `${[player.jumpChargeLast]}`;
    scene.clear();
    walls.forEach(wall=>wall.render({fill:"gray"}));
    player.resolve();

    player.vy = Math.min(20, player.vy + 1.3);
    const collision = player.nextCollision(walls);
    player.move(collision.time);
    if(collision.target) {
        player.slide(collision.normal);
        const collision2 = player.nextCollision(walls);
        player.move(collision2.target?collision2.time:1-collision.time);
    }
    player.vx = 0;
    player.position = {
        x: player.x>canvas.width?-player.w:player.x+player.w<0?canvas.width:player.x,
        y: player.y % canvas.height
    };

    player.render({fill: "red"});
    requestAnimationFrame(render);
}
render(0);

})()
