

if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var confetti;
var container, stats, controls;
var camera, scene, renderer, light;
var loader;

var clock = new THREE.Clock();

var mixers = [];

init();
render();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 200, 1500 );

    controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, 100, 0 );
    // controls.enablePan = false;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    // ground
    
    var grid = new THREE.GridHelper( 4000, 20, 0x999999, 0x999999 );
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    scene.add( grid );

    // confetti (explode)
    confetti = new ExplosionConfetti({
        rate: 1, // percent of explosion in every tick - smaller is fewer - be careful, larger than 10 may crash your browser!
        amount: 200, // max amount particle of an explosion
        radius: 800, // max radius of an explosion
        areaWidth: 500, // width of the area 
        areaHeight: 500, // height of the area 
        fallingHeight: 500, // start exploding from Y position
        fallingSpeed: 1, // max falling speed
        colors: [0xffffff, 0xff0000, 0xffff00] // random colors
    });
    scene.add( confetti.object );
    
    // main renderer:
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );
    stats.dom.left = "auto";
    stats.dom.right = 0;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// render:
function render() {
    requestAnimationFrame( render );
    // var delta = clock.getDelta();

    if(confetti) confetti.update();
    if(renderer) renderer.render( scene, camera );
    if(stats) stats.update();
}