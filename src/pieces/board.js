import * as THREE from 'three'

export default function Board(boardCubes) {

    

    const board = new THREE.Group();

    boardCubes.forEach(cubeData => {
        let cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(10, 10, 10),
            new THREE.MeshLambertMaterial({ color: cubeData.color })
        )

        cube.position.x = cubeData.position.x;
        cube.position.y = cubeData.position.y;
        cube.position.z = cubeData.position.z;
        
        board.add(cube);
    })

    
    return board;
}