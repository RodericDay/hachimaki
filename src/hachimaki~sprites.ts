class Sprite {
    entity; frames; animations; image = new Image();

    constructor(entity:Entity, asset:string, callback?) {
        this.entity = entity;
        this.image.src = `${asset}.png`;
        this.load(asset, callback);
    }

    async load(asset, callback?) {
        const response = await fetch(`${asset}.json`);
        const json = await response.json();
        this.entity.w = json.w*2;
        this.entity.h = json.h*2;
        this.frames = json.frames;
        this.animations = json.animations;
        if(callback) callback();
    }

    render() {
        const {frames, animations, image, entity} = this;
        const {scene} = entity;
        const pos = (entity.x/20|0) + (entity.y/20|0) % 20;
        const animation = entity.climbing
            ? animations.climb : entity.falling || !entity.landed
            ? animations.jump : entity.vx !== 0
            ? animations.run : animations.stand;
        const frame = frames[animation[pos % animation.length]];
        const dy = entity.y-frame.oy*2+entity.h/2;
        if(entity.facingBack) {
            scene.context.save();
            scene.context.scale(-1, 1);
            scene.context.translate(-scene.canvas.width, 0);
            const dx = scene.canvas.width-(entity.x+frame.ox*2+entity.w/2);
            scene.context.drawImage(image, frame.x, frame.y, frame.w, frame.h, dx, dy, frame.w*2, frame.h*2);
            scene.context.restore();
        }
        else {
            const dx = entity.x-frame.ox*2+entity.w/2;
            scene.context.drawImage(image, frame.x, frame.y, frame.w, frame.h, dx, dy, frame.w*2, frame.h*2);
        }
    }
}
