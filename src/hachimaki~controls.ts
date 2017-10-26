///<reference path="hachimaki.ts" />

class Player extends Entity {
    handlers:Object;
    pressed = new Set();

    listen(handlers) {
        this.handlers = handlers;
        addEventListener("keydown", (e) => {
            if(this.handlers[e.key]){e.preventDefault();this.pressed.add(e.key)}});
        addEventListener("keyup", (e) => {
            if(this.handlers[e.key]){e.preventDefault();this.pressed.delete(e.key)}});
    }

    resolve() {
        for(const key of Array.from(this.pressed)) {
            this.handlers[key]();
        }
    }
}
