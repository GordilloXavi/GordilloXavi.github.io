import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import { color } from 'three/examples/jsm/nodes/Nodes.js';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();

// Draw cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


function animate() {
    cube.rotateX(0.01);
    cube.rotateY(0.01);
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
