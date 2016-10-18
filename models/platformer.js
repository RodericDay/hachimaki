class Platformer extends Entity {

    constructor(...args) {
        super(...args);
        this.pressed = new Set();
        window.onkeyup = e => this.pressed.delete(e.keyCode);
        window.onkeydown = e => this.pressed.add(e.keyCode);
        // define in asset
        this.speed = 0;
        this.jumpStrength = 0;
        // booleans
        this.midAir = true;
        this.faceLeft = false;
        this.canJump = false;
    }

    resolve(entities) {
        var dt = 1;
        var vx = 0;
        var vy = this.vy-this.speed*dt;
        if (this.pressed.has(37)) { vx -= this.speed*dt; this.faceLeft = true; }
        if (this.pressed.has(39)) { vx += this.speed*dt; this.faceLeft = false; }
        if (this.pressed.has(38)) {
            if (this.canJump&&this.midAir===false) { vy = this.jumpStrength; }
            else if (this.vy > 0) { vy += this.speed*dt*0.75; }
        }
        // terminal speed
        vy = Math.sign(vy) * Math.min(Math.abs(vy), this.jumpStrength)
        this.setSpeed(vx, vy);

        this.midAir = true;
        var collision = this.nextCollision(entities);
        if (collision && collision.target) {
            // if hit the ground
            if (collision.normal.y === -1 && this.vy < 0) {
                this.canJump = !this.pressed.has(38);
                this.midAir = false;
                this.vy = 0;
            }
            this.move(collision.time);
            this.slide(collision.normal);
            // hit another wall after sliding
            var anotherCollision = this.nextCollision(entities);
            this.move(Math.min(1-collision.time, anotherCollision.time));
        } else {
            this.canJump = false;
            this.move(1);
        }
    }
}
