(function main() {

const canvas = document.querySelector("canvas");
const scene = new Scene(canvas, 320, 240);
const walls = [
    new Entity(scene, {x:0, y:0, h:canvas.height, w:40}),
    new Entity(scene, {x:0, y:0, h:40, w:canvas.width/2}),
    new Entity(scene, {x:canvas.width*.7, y:canvas.height*.5, h:40, w:40}),
];
const box = new Entity(scene);

function render({clientX, clientY}){
    const [x, y] = [canvas.width/2, canvas.height/2];
    const {left, top} = scene.canvas.getBoundingClientRect();
    const center = {x, y};
    const cursor = {x: clientX-left-15, y: clientY-top-15};
    const velocity = {vx: cursor.x - center.x, vy: cursor.y - center.y};

    scene.clear();
    walls.forEach(wall=>wall.render({fill:"gray"}));

    box.position = center;
    box.render({label: "fixed", color: "red"});

    box.velocity = velocity;
    box.move(1);
    box.render({label: "ethereal", color: "blue"});

    box.move(-1); // notice we backtrack using negative time
    const collision = box.nextCollision(walls);
    box.move(collision.time);
    box.render({label: "sticky", color: "green"});

    box.deflect(collision.normal);
    const timeLeft = 1 - collision.time;
    box.move(timeLeft);
    box.render({label: "deflect", color: "orange"});

    // reset
    box.position = center;
    box.velocity = velocity;
    box.move(collision.time);
    box.slide(collision.normal);
    const collisionTwo = box.nextCollision(walls);
    box.move(Math.min(timeLeft, collisionTwo.time));
    box.render({label: "slide", color: "purple"});
}

addEventListener("mousemove", render);
render({clientX:0, clientY:0});
})()
