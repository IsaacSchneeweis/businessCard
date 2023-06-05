import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls 	} from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader 	} from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass 		} from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";
import Cube from "./box"; 

//basic init
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

//renderer options
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( innerWidth, innerHeight );
const sceneA = new THREE.Scene();
renderer.setClearColor( 0x141415, 1);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//bloom
const renderScene = new RenderPass(sceneA,camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	0.1,
	0.1,
	0.6
);

//lights
const light = new THREE.DirectionalLight(0xffffff, 0);
light.position.set(0, 5, 10);

const Alight = new THREE.AmbientLight( 0x121212, 0 );



//oribtcontrols and camera
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 3;

const geometry = new THREE.SphereGeometry( 0.2, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );

//main async function
async function main() {

//add cubes
var cubearray = [];

for (var count = 0; count <= 2; count++) {
	cubearray[count] = await new Cube().create();
	sceneA.add(cubearray[count]);
	cubearray[count].translateX(count *4);
}

const cubetest = await new Cube().create();

//add everything else to scene
sceneA.add(   light, Alight);
composer.addPass(bloomPass);



sceneA.add( sphere );


//animation function

function animate() {
	composer.render(sceneA, camera)
	requestAnimationFrame( animate );

	cubearray[0].rotation.x += 0.001;
	cubearray[0].rotation.z += 0.001;

	

	// renderer.render(sceneA, camera);
}
animate();




}


main();