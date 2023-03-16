import * as THREE from 'three';

export default function checker(x, y, z, player, count, name = 'checker') {
    const checkerGeometry = new THREE.CylinderGeometry(4, 4, 2, 32);
    const checkerMaterial = new THREE.MeshLambertMaterial({ color: player === 1 ? 0x0000ff : 0xff0000 });
    const checkerMesh = new THREE.Mesh(checkerGeometry, checkerMaterial);
    
    checkerMesh.position.x = x;
    checkerMesh.position.y = y;
    checkerMesh.position.z = z;
    checkerMesh.player = player;
    checkerMesh.name = name;
    checkerMesh.index = count;
    checkerMesh.board_position = 0;

    //checker.add(checkerMesh);
    return checkerMesh;
}