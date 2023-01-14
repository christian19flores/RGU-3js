import * as THREE from 'three'

export default function die(x, y, z) {
        const tetrahedron = new THREE.Group();
        const tetrahedronGeometry = new THREE.TetrahedronGeometry(10, 0);
        const tetrahedronMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const tetrahedronMesh = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);

        tetrahedron.position.x = x;
        tetrahedron.position.y = y;
        tetrahedron.position.z = z;
        tetrahedron.add(tetrahedronMesh);
        return tetrahedron;
}