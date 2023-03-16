import * as THREE from 'three';

export default function checker(x, y, z, player, count) {
    const checkerGeometry = new THREE.CylinderGeometry(4, 4, 2, 32);
    const checkerMaterial = new THREE.MeshLambertMaterial({ color: player === 1 ? 0x0000ff : 0xff0000, opacity: 0.5, transparent: true });
    const checkerMesh = new THREE.Mesh(checkerGeometry, checkerMaterial);
    
    checkerMesh.position.x = x;
    checkerMesh.position.y = y;
    checkerMesh.position.z = z;
    checkerMesh.player = player;
    checkerMesh.name = 'checker';
    checkerMesh.index = count;

    return checkerMesh;
}