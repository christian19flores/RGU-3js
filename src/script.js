import './style.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import Board from './pieces/board.js'
import Checker from './pieces/checker.js'
import PredictionChecker from './pieces/predictionChecker.js'
import { rollDice } from './helpers/game_actions'

let container, stats;
let camera, scene, raycaster, renderer, canvas;
let checker, die;
let diceRollElement = document.getElementById('dice-roll');

let INTERSECTED;
let theta = 0;

var pointer = new THREE.Vector2();
var mouse = new THREE.Vector2();
const radius = 100;

let game_state = {
    player_turn: 0,
    dice_rolled: false,
    dice_value: 2,
    selected_checker: null,
    player: [
        {
            points: 0,
            checkers: []

        },
        {
            points: 0,
            checkers: []

        }
    ],
    predicted_moves: [],
    temporary_checker: null
}

const boxMaterial1 = new THREE.MeshLambertMaterial({ color: 0xc8c8c8 });
const boxMaterial2 = new THREE.MeshLambertMaterial({ color: 0x333333 });
const boxMaterial3 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const boxMaterial4 = new THREE.MeshLambertMaterial({ color: 0xff00ff });

const boardCubes = [
    // First Row
    {
        position: { x: 40, y: 5, z: -10 },
        color: boxMaterial2,
        safe: true,
        extraMove: true,
        board: [
            {
                position: null
            },
            {
                position: 13
            }
        ]
    },
    {
        position: { x: 30, y: 5, z: -10 },
        color: boxMaterial3,
        safe: true,
        extraMove: false,
        board: [
            {
                position: null
            },
            {
                position: 14
            }
        ]
    },
    {
        position: { x: 0, y: 5, z: -10 },
        color: boxMaterial2,
        safe: true,
        extraMove: false,
        board: [
            {
                position: null
            },
            {
                position: 1
            }
        ]
    },
    {
        position: { x: -10, y: 5, z: -10 },
        color: boxMaterial1,
        safe: true,
        extraMove: false,
        board: [
            {
                position: null
            },
            {
                position: 2
            }
        ]
    },
    {
        position: { x: -20, y: 5, z: -10 },
        color: boxMaterial2,
        safe: true,
        extraMove: false,
        board: [
            {
                position: null
            },
            {
                position: 3
            }
        ]
    },
    {
        position: { x: -30, y: 5, z: -10 },
        color: boxMaterial3,
        safe: true,
        extraMove: true,
        board: [
            {
                position: null
            },
            {
                position: 4
            }
        ]
    },

    // Second Row
    {
        position: { x: -30, y: 5, z: 0 },
        color: boxMaterial2,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 5
            },
            {
                position: 5
            }
        ]
    },
    {
        position: { x: -20, y: 5, z: 0 },
        color: boxMaterial1,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 6
            },
            {
                position: 6
            }
        ]
    },
    {
        position: { x: -10, y: 5, z: 0 },
        color: boxMaterial2,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 7
            },
            {
                position: 7
            }
        ]
    },
    {
        position: { x: 0, y: 5, z: 0 },
        color: boxMaterial4,
        safe: true,
        extraMove: true,
        board: [
            {
                position: 8
            },
            {
                position: 8
            }
        ]
    },
    {
        position: { x: 10, y: 5, z: 0 },
        color: boxMaterial2,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 9
            },
            {
                position: 9
            }
        ]
    },
    {
        position: { x: 20, y: 5, z: 0 },
        color: boxMaterial1,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 10
            },
            {
                position: 10
            }
        ]
    },
    {
        position: { x: 30, y: 5, z: 0 },
        color: boxMaterial2,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 11
            },
            {
                position: 11
            }
        ]
    },
    {
        position: { x: 40, y: 5, z: 0 },
        color: boxMaterial1,
        safe: false,
        extraMove: false,
        board: [
            {
                position: 12
            },
            {
                position: 12
            }
        ]
    },

    // Third Row
    {
        position: { x: 40, y: 5, z: 10 },
        color: boxMaterial2,
        safe: true,
        extraMove: false,
        board: [
            {
                position: 13
            },
            {
                position: 13
            }
        ]
    },
    {
        position: { x: 30, y: 5, z: 10 },
        color: boxMaterial3,
        safe: true,
        extraMove: true,
        board: [
            {
                position: 14
            },
            {
                position: null
            }
        ]
    },
    {
        position: { x: 0, y: 5, z: 10 },
        color: boxMaterial2,
        safe: true,
        extraMove: false,
        board: [
            {
                position: 1
            },
            {
                position: null
            }
        ]
    },
    {
        position: { x: -10, y: 5, z: 10 },
        color: boxMaterial1,
        safe: true,
        extraMove: false,
        board: [
            {
                position: 2
            },
            {
                position: null
            }
        ]
    },
    {
        position: { x: -20, y: 5, z: 10 },
        color: boxMaterial2,
        safe: true,
        extraMove: false,
        board: [
            {
                position: 3
            },
            {
                position: null
            }
        ]
    },
    {
        position: { x: -30, y: 5, z: 10 },
        color: boxMaterial3,
        safe: true,
        extraMove: true,
        board: [
            {
                position: 4
            },
            {
                position: null
            }
        ]
    },
]

init();
animate();

function init() {
    console.log('init')
    canvas = document.querySelector('canvas.webgl')

    const aspectRatio = window.innerWidth / window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    camera.position.y = 100
    camera.position.z = 100
    scene.add(camera)

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(100, -300, 400);
    scene.add(dirLight);

    const boxGeometry = new THREE.BoxBufferGeometry(10, 10, 10);


    for (let i = 0; i < boardCubes.length; i++) {
        console.log('object')
        const object = new THREE.Mesh(boxGeometry, boardCubes[i].color);
        console.log(boardCubes[i])
        object.position.x = boardCubes[i].position.x;
        object.position.y = boardCubes[i].position.y;
        object.position.z = boardCubes[i].position.z;
        object.safe = boardCubes[i].safe;
        object.extraMove = boardCubes[i].extraMove;
        object.board = boardCubes[i].board;

        scene.add(object);
    }


    game_state.player[0].checkers.push(new Checker(0, 10, 10, 0, 0))
    scene.add(game_state.player[0].checkers[0]);

    game_state.player[1].checkers.push(new Checker(0, 10, -10, 1, 0));
    scene.add(game_state.player[1].checkers[0]);

    game_state.temporary_checker = new Checker(0, 100, 10, 0, 0)
    scene.add(game_state.temporary_checker);

    const dieGeometry = new THREE.TetrahedronGeometry(10, 0);
    const dieMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const die = new THREE.Mesh(dieGeometry, dieMaterial);

    die.name = 'die'
    die.position.x = 0;
    die.position.y = 10;
    die.position.z = -40;

    die.callback = () => {
        console.log('clicked die')
        let dice_roll = rollDice()
        console.log(dice_roll)
        diceRollElement.innerHTML = dice_roll
        game_state.dice_value = dice_roll
    };
    scene.add(die);



    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.listenToKeyEvents(window) // optional

    // var gridXZ = new THREE.GridHelper(100, 10);
    // gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
    // gridXZ.position.set( 0,0,0 );
    // scene.add(gridXZ);

    // var gridXY = new THREE.GridHelper(100, 10);
    // gridXY.position.set( 100,100,0 );
    // gridXY.rotation.x = Math.PI/2;
    // gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
    // scene.add(gridXY);

    // var gridYZ = new THREE.GridHelper(100, 10);
    // gridYZ.position.set( 0,100,100 );
    // gridYZ.rotation.z = Math.PI/2;
    // gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
    // scene.add(gridYZ);

    // stats = new Stats();



    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.dom)

    document.addEventListener('mousemove', onPointerMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    console.log('click')

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        console.log(intersects[0].object)

        if (game_state.selected_checker) {
            // SET NEW POSITION IF VALID
            if (isValidMove()) {
                // set checker new position
                game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.x = intersects[0].object.position.x
                game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.z = intersects[0].object.position.z
            }

            // unhide checker
            game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.y = 10
            game_state.selected_checker = null;
            for (let i = 0; i < game_state.predicted_moves.length; i++) {
                scene.remove(game_state.predicted_moves[i])
            }
            game_state.predicted_moves = []
            game_state.temporary_checker.position.y = 100
        } else {
            if (intersects[0].object.name == 'die') {
                intersects[0].object.callback();
            }

            if (intersects[0].object.name == 'checker') {
                predictMove(intersects[1].object.board[game_state.player_turn].position)
                game_state.selected_checker = {
                    player: intersects[0].object.player,
                    index: intersects[0].object.index,
                    name: intersects[0].object.name,
                    //cube_position: intersects[1].object.board[game_state.player_turn].position,
                }

                // hide selected checker
                game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.y = 5
            }
        }


    }
}

function isValidMove() {
    for (let i = 0; i < game_state.predicted_moves.length; i++) {
        if (game_state.predicted_moves[i].position.x == game_state.temporary_checker.position.x && game_state.predicted_moves[i].position.z == game_state.temporary_checker.position.z) {
            return true;
        }
    }
}

function predictMove(currentPosition) {
    console.log(currentPosition)
    console.log(game_state.player_turn)
    let allowedMoves = []

    let gs = game_state;

    // Loop through all cubes, to find all available moves
    for (let i = 0; i < boardCubes.length; i++) {
        if (boardCubes[i].board[gs.player_turn].position == (currentPosition + gs.dice_value)) {
            console.log('Cube can be moved to: ' + boardCubes[i].board[gs.player_turn].position)
            game_state.predicted_moves.push(new PredictionChecker(boardCubes[i].position.x, 10, boardCubes[i].position.z, gs.player_turn, 0))
            allowedMoves.push(boardCubes[i])
        }
    }

    for (let i = 0; i < game_state.predicted_moves.length; i++) {
        console.log(game_state.predicted_moves[i])
        scene.add(game_state.predicted_moves[i])
    }

    return allowedMoves
}

function update() {
    raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object && intersects[0].object.name != 'die') {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;

            // Move selected checker to box under mouse pointer
            let selected_checker = game_state.selected_checker;
            if (game_state.selected_checker.name == 'checker') {
                console.log(selected_checker)
                game_state.temporary_checker.position.x = INTERSECTED.position.x
                game_state.temporary_checker.position.z = INTERSECTED.position.z
                game_state.temporary_checker.position.y = 10
            }

        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;
    }

    stats.update();
}

function render() {

    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}


