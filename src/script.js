import './style.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Checker from './pieces/checker.js'
import PredictionChecker from './pieces/predictionChecker.js'
import { rollDice } from './helpers/game_actions'

let stats;
let camera, scene, raycaster, renderer, canvas;
let diceRollElement = document.getElementById('dice-roll');
let player_colors = [0x0000ff, 0xff0000];

let INTERSECTED;
var pointer = new THREE.Vector2();
var mouse = new THREE.Vector2();

let game_state = {
    allowExtraMove: true,
    player_turn: 0,
    dice_rolled: false,
    dice_value: 0,
    selected_checker: null,
    player: [
        {
            pointElement: document.getElementById('player1-points'),
            score: 0,
            checkers: []

        },
        {
            pointElement: document.getElementById('player2-points'),
            score: 0,
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
const boxMaterial5 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

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
        extraMove: true,
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
        position: { x: 20, y: 5, z: -10 },
        color: boxMaterial5,
        safe: true,
        extraMove: false,
        board: [
            {
                position: null
            },
            {
                position: 15
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
                position: null
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
        position: { x: 20, y: 5, z: 10 },
        color: boxMaterial5,
        safe: true,
        extraMove: false,
        board: [
            {
                position: 15
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
        object.name = 'boardCube';

        scene.add(object);
    }


    for (let i = 0; i <= 7; i++) {
        game_state.player[0].checkers.push(new Checker(10, i * 2, 10, 0, i))
        scene.add(game_state.player[0].checkers[i]);

        game_state.player[1].checkers.push(new Checker(10, i * 2, -10, 1, i));
        scene.add(game_state.player[1].checkers[i]);
    }

    game_state.temporary_checker = new Checker(0, 100, 10, 0, 0, 'holo')
    scene.add(game_state.temporary_checker);

    const dieGeometry = new THREE.TetrahedronGeometry(10, 0);
    const dieMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const die = new THREE.Mesh(dieGeometry, dieMaterial);

    die.name = 'die'
    die.position.x = 0;
    die.position.y = 10;
    die.position.z = -40;

    die.callback = function (event) {
        console.log(this.name)
        console.log('clicked die')
        let dice_roll = rollDice()
        console.log(dice_roll)
        diceRollElement.innerHTML = dice_roll
        game_state.dice_value = dice_roll
        game_state.dice_rolled = true
    };
    scene.add(die);



    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.listenToKeyEvents(window)



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

    // Logic for mouse clicks
    if (intersects.length > 0) {
        if (game_state.selected_checker) {
            // SET NEW POSITION IF VALID
            if (isValidMove() && game_state.dice_rolled) {
                if (isCapture(intersects)) {
                    console.log('capture')
                    // remove captured checker
                    putBackOnStack(intersects[0].object)
                    // set checker new position
                    moveChecker(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z, intersects[3].object.board[game_state.player_turn].position)
                } else {
                    if (isScore(intersects)) {
                        scene.remove(game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index])
                    } else {
                        console.log("valid move")
                        // set checker new position
                        moveChecker(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z, intersects[2].object.board[game_state.player_turn].position)
                    }
                }

                if (intersects[2].object.extraMove && game_state.allowExtraMove) {
                    extraMove()
                } else {
                    endTurn()
                }
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
            // If die not rolled, then roll die
            if (intersects[0].object.name == 'die' && !game_state.dice_rolled) {
                intersects[0].object.callback();

                if (isAvailableMoves()) {
                    console.log('available moves')

                } else {
                    console.log('no available moves')
                    endTurn()
                }
            }

            // If checker and is player's turn
            if (intersects[0].object.name == 'checker' && game_state.dice_rolled) {
                if (intersects[0].object.player == game_state.player_turn) {
                    predictMove(intersects[0].object.board_position)

                    game_state.selected_checker = {
                        player: intersects[0].object.player,
                        index: intersects[0].object.index,
                        name: intersects[0].object.name,
                        board_position: intersects[0].object.board_position,
                    }

                    // hide selected checker
                    game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.y = 5
                } else {
                    console.log('not your turn')
                }
            }
        }


    }
}

function update() {
    raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object && intersects[0].object.name != 'die') {

            INTERSECTED = intersects[0].object;

            // Move selected checker to box under mouse pointer
            let selected_checker = game_state.selected_checker;
            console.log(selected_checker)
            if (selected_checker !== null && selected_checker.name == 'checker') {
                game_state.temporary_checker.position.x = INTERSECTED.position.x
                game_state.temporary_checker.position.z = INTERSECTED.position.z
                game_state.temporary_checker.position.y = 10
            }

        }
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

function putBackOnStack(object) {
    // TODO: put back on stack instead of deleting it
    scene.remove(object)
}

function isCapture(intersects) {
    console.log(intersects.length)
    console.log(intersects)

    if (intersects[0].object.name == 'checker' && intersects[2].object.name == 'checker') {
        if (intersects[3].object.board[game_state.player_turn].position !== 8) {
            if (intersects[0].object.player !== intersects[2].object.player) {
                console.log('holo')
                console.log('capture!')
                return true;
            }
        }
    }

    return false;
}

function isScore(intersects) {
    if (intersects[2].object.board[game_state.player_turn].position == 15) {
        console.log('score!')
        game_state.player[game_state.player_turn].score = game_state.player[game_state.player_turn].score + 1
        game_state.player[game_state.player_turn].pointElement.innerHTML = game_state.player[game_state.player_turn].score
        return true;
    }

    return false;
}

function endTurn() {
    // change player turn
    game_state.player_turn = game_state.player_turn == 0 ? 1 : 0

    // reset dice
    game_state.dice_rolled = false

    // reset extra move
    game_state.allowExtraMove = true

    // change holo checker color
    game_state.temporary_checker.material.color.setHex(player_colors[game_state.player_turn == 0 ? 1 : 0])
}

function extraMove() {
    // check if player has extra move
    if (game_state.allowExtraMove) {
        console.log('extra move')
        game_state.dice_rolled = false
        game_state.allowExtraMove = false
        return true;
    }

    return false;
}

function moveChecker(x, y, z, position) {
    // moves player checker to new x,z position
    game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.x = x
    game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.y = y
    game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].position.z = z

    // update player checker board index
    game_state.player[game_state.selected_checker.player].checkers[game_state.selected_checker.index].board_position = position
}

function isValidMove() {
    for (let i = 0; i < game_state.predicted_moves.length; i++) {
        if (game_state.predicted_moves[i].position.x == game_state.temporary_checker.position.x && game_state.predicted_moves[i].position.z == game_state.temporary_checker.position.z) {
            return true;
        }
    }
}

function isAvailableMoves() {
    let player_turn = game_state.player_turn
    let unmoveable_spots = []
    // build array of unmoveable spots, these are spots that are occupied by player's own checkers
    for (let i = 0; i < game_state.player[player_turn].checkers.length; i++) {
        unmoveable_spots.push(game_state.player[player_turn].checkers[i].board_position)
    }

    // loop through all player checkers
    for (let i = 0; i < game_state.player[player_turn].checkers.length; i++) {
        // check if each checker has a possible move
        let currentPosition = game_state.player[player_turn].checkers[i].board_position
        console.log(currentPosition)


        // Loop through all cubes, to find all available moves
        for (let i = 0; i < boardCubes.length; i++) {
            if (boardCubes[i].board[player_turn].position == (currentPosition + game_state.dice_value) && !unmoveable_spots.includes(boardCubes[i].board[player_turn].position)) {
                console.log('available move')
                return true;
            }
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

    if (allowedMoves.length == 0) {
        console.log('No moves available')
        return false;
    }

    return true
}