import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import Board from './pieces/board.js'
import Die from './pieces/die.js'
import Checker from './pieces/checker.js'
import { addObjectClickListener } from './helpers/game_actions'

let game_state = {
    player_turn: 1,
    dice_rolled: false,
    dice_value: 0,
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const boardCubes = [
    // First Row
    {
        position: { x: 40, y: -10, z: 0 },
        color: 0x333333,
        boardPos: 13
    },
    {
        position: { x: 30, y: -10, z: 0 },
        color: 0xff0000,
        boardPos: 14
    },
    {
        position: { x: 0, y: -10, z: 0 },
        color: 0x333333,
        boardPos: 1
    },
    {
        position: { x: -10, y: -10, z: 0 },
        color: 0xc8c8c8,
        boardPos: 2
    },
    {
        position: { x: -20, y: -10, z: 0 },
        color: 0x333333,
        boardPos: 3
    },
    {
        position: { x: -30, y: -10, z: 0 },
        color: 0xff0000,
        boardPos: 4
    },

    // Second Row
    {
        position: { x: -30, y: 0, z: 0 },
        color: 0x333333,
        boardPos: 5
    },
    {
        position: { x: -20, y: 0, z: 0 },
        color: 0xc8c8c8,
        boardPos: 6
    },
    {
        position: { x: -10, y: 0, z: 0 },
        color: 0x333333,
        boardPos: 7
    },
    {
        position: { x: 0, y: 0, z: 0 },
        color: 0xff00ff,
        boardPos: 8
    },
    {
        position: { x: 10, y: 0, z: 0 },
        color: 0x333333,
        boardPos: 9
    },
    {
        position: { x: 20, y: 0, z: 0 },
        color: 0xc8c8c8,
        boardPos: 10
    },
    {
        position: { x: 30, y: 0, z: 0 },
        color: 0x333333,
        boardPos: 11
    },
    {
        position: { x: 40, y: 0, z: 0 },
        color: 0xc8c8c8,
        boardPos: 12
    },

    // Third Row
    {
        position: { x: 40, y: 10, z: 0 },
        color: 0x333333
    },
    {
        position: { x: 30, y: 10, z: 0 },
        color: 0xff0000
    },
    {
        position: { x: 0, y: 10, z: 0 },
        color: 0x333333
    },
    {
        position: { x: -10, y: 10, z: 0 },
        color: 0xc8c8c8
    },
    {
        position: { x: -20, y: 10, z: 0 },
        color: 0x333333
    },
    {
        position: { x: -30, y: 10, z: 0 },
        color: 0xff0000
    },
]

const board = Board(boardCubes);
scene.add(board);



const die = Die();
scene.add(die);

let checker = Checker(0, -10, 5);
scene.add(checker);

// const car = Car();
// scene.add(car);

// Set up lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

// Set up camera
const aspectRation = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(
    20,
    aspectRation,
    60,
    1000
);
scene.add(camera);

camera.position.set(200, -200, 300);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Clock
const clock = new THREE.Clock()

// Controls
const controls = new OrbitControls(camera, canvas)
controls.listenToKeyEvents(window) // optional

var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x660000), new THREE.Color(0x660000));
gridXZ.position.set(0, 50, 0);
scene.add(gridXZ);

var gridXY = new THREE.GridHelper(100, 10, new THREE.Color(0x660000), new THREE.Color(0x660000));
gridXY.position.set(0, 0, -50);
gridXY.rotation.x = Math.PI / 2;
scene.add(gridXY);

var gridYZ = new THREE.GridHelper(100, 10, new THREE.Color(0x660000), new THREE.Color(0x660000));
gridYZ.position.set(-50, 0, 0);
gridYZ.rotation.z = Math.PI / 2;
scene.add(gridYZ);

// var domEvents = new THREEx.DomEvents(camera, renderer.domElement)
// domEvents.addEventListener(board, 'click', function (e) {
//     console.log('click on board')
//     console.log(e)
// }, false)

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


let oldElapsedTime = 0;

// Animations
const tick = () => {
    // Clock

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[i].object.material.color.set( 0xff0000 );

	}

    //world.step(1 / 60, deltaTime, 3)
    // console.log(elapsedTime)
    //console.log(deltaTime)

    // checker.position.x = elapsedTime * -10

    // Update objects
    // camera.position.y = Math.sin(elapsedTime)
    // camera.position.x = Math.cos(elapsedTime)

    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}


window.addEventListener('mousemove', onPointerMove)
window.requestAnimationFrame(tick);