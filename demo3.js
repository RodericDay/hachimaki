textarea = document.createElement("textarea");
textarea.rows = 10;
textarea.cols = 50;
textarea.value = `
##         ###
#####     ####
##############`
textarea.onkeyup = makeTiles;

function makeTiles() {
    var rows = textarea.value.split('\n').reverse();
    tiles = rows
            .map((row, i)=>row.split('').map((cell,j)=>cell==='#'?new Box(j*40, i*40, 40, 40):null))
            .reduce((a,b) => a.concat(b))
            .filter(a=>a);
}

function render() {
    scene.clear('lightblue');

    scene.lock(player);

    tiles.forEach(tile=>tile.fill('green'));

    player.resolve(tiles);
    player.fill('steelblue');

    scene.unlock();
}

scene = new Scene(300, 300);
player = new Platformer(100, 200, 30, 35)
makeTiles();

document.body.appendChild(textarea);
render();
window.setInterval(render, 1000/60);
