(function main() {

const canvas = document.querySelector("canvas");
const scene = new Scene(canvas, 320, 240);
const world = {width: 800, height: 600};
const player = new Platformer(scene, {x:160, y:120});
const playerSprite = new Sprite(player, "demos/assets/megaman", render);
player.listen({
    "ArrowLeft":  ()=>player.vx-=4,
    "ArrowRight": ()=>player.vx+=4,
    "ArrowUp":    ()=>player.jump(2.5, 15),
    "ArrowDown":  ()=>player.crouch(),
});
const walls = [
    new Entity(scene, {x:0, y:world.height, w:world.width, h:-10}),
    new Entity(scene, {x:world.width-100, y:world.height, w:-200, h:-world.height/2}),
    new Entity(scene, {x:canvas.width*3/4, y:world.height*1/4, w:200, h:10}),
];
const ladders = [
    new Entity(scene, {x:canvas.width*3/4, y:world.height, w:-30, h: -world.height*3/4}),
]

function render(t){
    player.canClimb = player.overlap(ladders);
    if(!player.climbing) {
        player.vy = Math.min(20, player.vy + 1.3);
    }
    const collision = player.nextCollision(walls);
    player.move(collision.time);
    if(collision.target) {
        player.slide(collision.normal);
        const collision2 = player.nextCollision(walls);
        player.move(collision2.target?collision2.time:1-collision.time);
    }
    if(player.climbing) {
        player.vy = 0;
    }
    player.vx = 0;
    player.position = {
        x: player.x>world.width ?-player.w:player.x2<0?world.width :player.x,
        y: player.y>world.height?-player.h:player.y2<0?world.height:player.y,
    };

    scene.clear();
    scene.lock(player, world);
    ladders.forEach(ladder=>ladder.render({fill:"darkgray"}));
    walls.forEach(wall=>wall.render({fill:"gray"}));
    player.resolve();
    playerSprite.render();
    scene.unlock();
    requestAnimationFrame(render);
}

})()
