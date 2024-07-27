import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import { color } from 'three/examples/jsm/nodes/Nodes.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createNoise2D } from 'simplex-noise';
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

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add a 3D GridHelper
//const gridHelper = new THREE.GridHelper(100, 100); // Size of the grid, divisions
//scene.add(gridHelper);

// Terrain
let terrain_width = 100;
let terrain_height = 100;
const terrain_geometry = new THREE.PlaneGeometry( terrain_width, terrain_height, terrain_width, terrain_height );
terrain_geometry.rotateX(Math.PI / 2)

const params = {
    scale: 0.04,
    amplitude: 7
};
gui.add(params, 'scale', -1, 1).onChange(updateTerrain);
gui.add(params, 'amplitude', 0, 10).onChange(updateTerrain);

const noise2D = createNoise2D();

// Function to displace vertices based on Perlin noise
function displaceVertices(geometry, scale, amplitude) {
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 2];
        const noiseValue = noise2D(x * scale, y * scale);
        vertices[i + 1] = noiseValue * amplitude;
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
    color: 0xaaffbb, 
    side: THREE.DoubleSide, 
    wireframe: true
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
