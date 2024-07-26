import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import { color } from 'three/examples/jsm/nodes/Nodes.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from './world';
import * as dat from 'dat.gui';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x1040f0);
document.body.appendChild( renderer.domElement );

// Debugging tool
const gui = new dat.GUI();

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-32, 15, -32);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();

// World

const world = new World({width: 64, height: 5});
world.generate();
scene.add(world);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add a 3D GridHelper
const gridHelper = new THREE.GridHelper(100, 100); // Size of the grid, divisions
scene.add(gridHelper);

// Lighting
function setupLights() {
    const light1 = new THREE.DirectionalLight();
    light1.position.set(1,1,1);

    scene.add(light1);

    const light1_helper = new THREE.DirectionalLightHelper(light1, 0.1); // Size of the helper
    scene.add(light1_helper);

    const light2 = new THREE.DirectionalLight(0xff0000, 1); // red color, intensity 1
    light2.position.set(-1, 1, -0.5);
    scene.add(light2);

    const light2_helper = new THREE.DirectionalLightHelper(light2, 0.1); // Size of the helper
    scene.add(light2_helper);

    const ambient_light = new THREE.AmbientLight();
    ambient_light.intensity = 0.1;
    scene.add(ambient_light);
} 

function animate() {
	renderer.render( scene, camera );
}

setupLights();
renderer.setAnimationLoop( animate );

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
