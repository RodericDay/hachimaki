///<reference path="hachimaki~controls.ts" />

class Platformer extends Player {
    landed:boolean;
    falling:boolean;
    jumpCharge:number = 0; // required for hops vs. leaps
    jumpChargeMax:number;
    jumpChargeLast:number = 0;

    constructor(scene, args, jumpChargeMax) {
        super(scene, args);
        this.jumpChargeMax = jumpChargeMax;
    }

    resolve() {
        super.resolve();
        if(this.jumpCharge > 0 && this.jumpCharge === this.jumpChargeLast) {
            this.landed = false;
            this.vy -= this.jumpCharge;
            this.jumpCharge = 0;
        }
        else if(this.jumpCharge > 0) {
            this.jumpChargeLast = this.jumpCharge;
        }

        this.landed = this.landed || this.falling && Math.round(this.vy) === 0;
        this.falling = this.vy > 0;
    }

    jump(rate) {
        if(this.landed) {
            this.jumpCharge = Math.min(this.jumpCharge+rate, this.jumpChargeMax);
        }
    }

    // resolve(entities) {
    //     var dt = 1;
    //     var vx = 0;
    //     var vy = this.vy-this.weight*dt;
    //     if (this.pressed.has(37)) { vx -= this.speed*dt; this.faceLeft = true; }
    //     if (this.pressed.has(39)) { vx += this.speed*dt; this.faceLeft = false; }
    //     if (this.pressed.has(38)) {
    //         if (this.canJump&&this.midAir===false) { vy = this.jumpStrength; }
    //         else if (this.vy > 0) { vy += this.jumpStrength*dt*0.15; }
    //     }
    //     // terminal speed
    //     vy = Math.sign(vy) * Math.min(Math.abs(vy), this.jumpStrength)
    //     this.setSpeed(vx, vy);

    //     this.midAir = true;
    //     var collision = this.nextCollision(entities);
    //     if (collision && collision.target) {
    //         // if hit the ground
    //         if (collision.normal.y === -1 && this.vy < 0) {
    //             this.canJump = !this.pressed.has(38);
    //             this.midAir = false;
    //             this.vy = 0;
    //         }
    //         this.move(collision.time);
    //         this.slide(collision.normal);
    //         // hit another wall after sliding
    //         var anotherCollision = this.nextCollision(entities);
    //         this.move(Math.min(1-collision.time, anotherCollision.time));
    //     } else {
    //         this.canJump = false;
    //         this.move(1);
    //     }

    //     if (this.midAir) { this.currentAnimation = 'jump' }
    //     else if (this.vx) { this.currentAnimation = 'run' }
    //     else { this.currentAnimation = 'stand' }
    //     if (this.pressed.has(16)) { this.currentAnimation += '+shoot' }
    // }
}
