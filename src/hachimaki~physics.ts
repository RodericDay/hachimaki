///<reference path="hachimaki~controls.ts" />

class Platformer extends Player {
    landed:boolean;
    falling:boolean;
    jumpCharge:number = 0; // required for hops vs. leaps
    jumpChargeLast:number = 0;
    isClimbing:boolean;
    canClimb:boolean;

    resolve() {
        super.resolve();

        this.landed = this.landed || this.falling && Math.round(this.vy) === 0;
        this.falling = this.vy > 0;
        if(this.falling) {
            this.jumpChargeLast = this.jumpCharge; // release jumps near ledge
        }

        if(this.jumpCharge > 0 && this.jumpCharge === this.jumpChargeLast) {
            this.landed = false;
            this.vy -= this.jumpCharge;
            this.jumpCharge = 0;
            this.jumpChargeLast = 0;
        }
        if(this.jumpCharge) {
            this.jumpChargeLast = this.jumpCharge;
        }

        if(!this.canClimb) {
            this.isClimbing = false;
        }
    }

    jump(rate, jumpChargeMax) {
        if(this.canClimb) {
            this.isClimbing = true;
            this.vy = -2;
        }
        else if(this.landed) {
            this.jumpCharge = Math.min(this.jumpCharge+rate, jumpChargeMax);
        }
    }

    crouch() {
        if(this.isClimbing) {
            this.vy = +2;
        }
    }
}
