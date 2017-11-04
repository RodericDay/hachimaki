class Scene {
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement, width=320, height=240) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;

        this.context.imageSmoothingEnabled = false;
        this.context.font = '8pt monospace';
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

interface P{x:number, y:number};
interface V{vx:number, vy:number};

class Entity {
    x; y; w; h; vx; vy;
    scene: Scene;

    get x1() {return this.x}
    get x2() {return this.x+this.w}
    get y1() {return this.y}
    get y2() {return this.y+this.h}

    constructor(scene, {x=0, y=0, w=30, h=30, vx=0, vy=0}={}) {
        this.scene = scene;
        this.w = Math.abs(w);
        this.h = Math.abs(h);
        this.x = w < 0 ? x - this.w : x;
        this.y = h < 0 ? y - this.h : y;
        this.vx = 0;
        this.vy = 0;
    }

    set position({x, y}:P) {
        this.x = x;
        this.y = y;
    }

    set velocity({vx, vy}:V) {
        this.vx = vx;
        this.vy = vy;
    }

    move(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    deflect(normal) {
        if (Math.abs(normal.x) > 0) {
            this.vx = -this.vx;
        }
        if (Math.abs(normal.y) > 0) {
            this.vy = -this.vy;
        }
    }

    slide(normal) {
        const dotprod = (this.vx * normal.y + this.vy * normal.x);
        this.vx = dotprod * normal.y;
        this.vy = dotprod * normal.x;
    }

    overlap(entities) {
        return entities.some(entity=>overlap(this, entity));
    }

    nextCollision(entities) {
        const nearest = (c1, c2) => c1.time > c2.time ? c2 : c1;
        return entities.map(sweptAABB, this).reduce(nearest);
    }

    render({label="", color="", fill=""}) {
        const {x, y, w, h} = this;
        if(color!=="") {
            this.scene.context.strokeStyle = color;
            this.scene.context.strokeRect(x, y, w, h);
            if(label!=="") {
                this.scene.context.strokeText(label, x-1, y-2);
            }
        }
        if(fill!=="") {
            this.scene.context.fillStyle = fill;
            this.scene.context.fillRect(x, y, w, h);
        }
    }
}

function overlap(A:Entity, B:Entity) {
    return A.x1 < B.x2 && A.x2 > B.x1 && A.y1 < B.y2 && A.y2 > B.y1
}

function sweptAABB(b2) {
    var b1 = this;
    var collision = {time: 1, normal: {x: 0, y: 0}, target: null};
    var x, X, y, Y;

    if (b1.vx > 0) {
        x = b2.x - (b1.x + b1.w);
        X = (b2.x + b2.w) - b1.x;
    } else {
        x = (b2.x + b2.w) - b1.x;
        X = b2.x - (b1.x + b1.w);
    }

    if (b1.vy > 0) {
        y = b2.y - (b1.y + b1.h);
        Y = (b2.y + b2.h) - b1.y;
    } else {
        y = (b2.y + b2.h) - b1.y;
        Y = b2.y - (b1.y + b1.h);
    }

    var broadPhase = (x > 0 === X >= 0) && (b1.vx === 0)
                  || (y > 0 === Y >= 0) && (b1.vy === 0);

    // TODO: 0/0 === NaN, 1/0 === Infinity
    var tx = b1.vx===0 ? -Infinity : x / b1.vx;
    var tX = b1.vx===0 ?  Infinity : X / b1.vx;

    var ty = b1.vy===0 ? -Infinity : y / b1.vy;
    var tY = b1.vy===0 ?  Infinity : Y / b1.vy;

    var t1 = Math.max(tx, ty);
    var t2 = Math.min(tX, tY);

    if ( t1 > t2 || tx < 0 && ty < 0 || tx > 1 || ty > 1 || broadPhase) {
        // no collision
    } else if (tx > ty) {
        // horizontal collision
        collision.normal.x = x < 0 ? 1 : -1;
        collision.normal.y = 0;
        collision.time = t1;
        collision.target = b2;
    } else {
        // vertical collision
        collision.normal.x = 0;
        collision.normal.y = y < 0 ? 1 : -1;
        collision.time = t1;
        collision.target = b2;
    }
    return collision;
}


//         this.context = this.canvas.getContext('2d');
//         this.context.font = "12px sans-serif";
//         this.context.scale(this.z,-this.z);
//         this.context.translate(0, -this.h);

    // }

//     enableFullScreen() {
//         this.canvas.style.position = "absolute";
//         this.canvas.style.left = 0;
//         this.canvas.style.top = 0;
//     }


//     // camera
//     lock(target) {
//         this.x = Math.max(target.x-this.w/2, 0);
//         this.y = Math.max(target.y-this.h/2, 0);
//         this.context.translate(-this.x, -this.y);
//     }

//     unlock() {
//         this.context.translate(this.x, this.y);
//     }
// }

// }



// class Sprite {

//     constructor(imgSrc) {
//         this.image = new Image();
//         this.image.src = imgSrc;
//     }

//     draw(entity) {
//         var animation = entity.animations[entity.currentAnimation];
//         var tt = Math.abs(new Date()/150|0);
//         var frameId = animation[tt % animation.length];
//         var frame = entity.frames[frameId];

//         scene.context.save();

//         if (entity.faceLeft) {
//             var x = (scene.w-entity.w-entity.x)+(entity.w/2-frame.x);
//             scene.context.translate(scene.w, scene.h);
//             scene.context.scale(-1, -1);
//         } else {
//             var x = (entity.x)+(entity.w/2-frame.x);
//             scene.context.translate(0, scene.h);
//             scene.context.scale(1, -1);
//         }
//         var y = (scene.h-entity.h-entity.y)+(entity.h/2-frame.y);
//         scene.context.drawImage(this.image,
//             frame.X, frame.Y, frame.W, frame.H,
//             x, y, frame.W, frame.H
//         );

//         scene.context.restore();
//     }
// }

// class Entity extends Box {

//     constructor(path) {
//         super();
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', path);
//         xhr.responseType = 'json';
//         xhr.send();
//         xhr.onload = e => this.load(xhr.response);
//     }

//     load(data) {
//         Object.keys(data).forEach(key=>this[key]=data[key]);
//         if(data.imgSrc) {
//             this.sprite = new Sprite(data.imgSrc);
//         }
//     }

//     draw() {
//         try {
//             this.sprite.draw(this);
//         } catch(error) {
//             this.fill('lime');
//         }
//     }

// }
