import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/Addons.js';
import Stats from 'stats.js';
import { createNoise2D } from 'simplex-noise';
import * as dat from 'dat.gui';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x1643f0);
document.body.appendChild( renderer.domElement );

// Debugging tool
const gui = new dat.GUI();
const clock = new THREE.Clock();

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set(-32, 15, -32);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();

// Initialize stats to show FPS
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


// Add a 3D GridHelper
//const gridHelper = new THREE.GridHelper(100, 100); // Size of the grid, divisions
//scene.add(gridHelper);

// Controls
const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 150;
controls.lookSpeed = 0.1;

// Terrain
let terrain_width = 500;
let terrain_height = 500;
const terrain_geometry = new THREE.PlaneGeometry( terrain_width, terrain_height, terrain_width, terrain_height );
terrain_geometry.rotateX(Math.PI / 2)

const params = {
    scale: 0.007,
    amplitude: 35
};
gui.add(params, 'scale', 0, 0.1).onChange(updateTerrain);
gui.add(params, 'amplitude', 0, 50).onChange(updateTerrain);

const noise2D = createNoise2D();

// Function to displace vertices based on Perlin noise
function displaceVertices(geometry, scale, amplitude) {
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 2];
        const noise_1 = noise2D(x * scale * 1, y * scale * 1) * (amplitude / 1);
        const noise_2 = noise2D(x * scale * 2, y * scale * 2) * (amplitude / 2);
        const noise_3 = noise2D(x * scale * 4, y * scale * 4) * (amplitude / 4);
        const noise_4 = noise2D(x * scale * 8, y * scale * 8) * (amplitude / 8);
        const noise_5 = noise2D(x * scale * 128, y * scale * 128) * (amplitude / 64);


        const noiseValue = noise_1 + noise_2 + noise_3 + noise_4 + noise_5;
        vertices[i + 1] = noiseValue;
    }
    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;
}

function updateTerrain() {
    displaceVertices(terrain_geometry, params.scale, params.amplitude);
}

// Initial terrain generation
updateTerrain();


const terrain_material = new THREE.MeshStandardMaterial( {
    color: 0x556655, 
    side: THREE.DoubleSide, 
    wireframe: false
} );
gui.add(terrain_material, 'wireframe');

const terrain_mesh = new THREE.Mesh( terrain_geometry, terrain_material );
scene.add( terrain_mesh );

const terrain_vertices = terrain_geometry.attributes.position.array

// Lighting
function setupLights() {
    const light1 = new THREE.DirectionalLight();
    light1.position.set(1,1,1);

    scene.add(light1);

    const light1_helper = new THREE.DirectionalLightHelper(light1, 0.1); // Size of the helper
    scene.add(light1_helper);

    const ambient_light = new THREE.AmbientLight();
    ambient_light.intensity = 0.1;
    scene.add(ambient_light);
} 

setupLights();

function animate() {
    stats.begin();

    controls.update( clock.getDelta() );
    renderer.render(scene, camera);

    stats.end();
    requestAnimationFrame(animate);
}

animate();
//renderer.setAnimationLoop( animate );

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
});
