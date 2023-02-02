

import { EquirectangularReflectionMapping } from "three";
import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
//import {loadModels} from "/loaders"

//basic init
const renderer = new THREE.WebGLRenderer({antialias: true});

const scene = new THREE.Scene();
renderer.setClearColor( 0x121212, 1);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();

const light = new THREE.DirectionalLight(0xfff0dd, 3);
light.position.set(0, 5, 10);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//oribtcontrols and camera
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 10;





//material
const greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 } );
const blueMaterial = new THREE.MeshBasicMaterial( { color: 0x3446eb, side: THREE.DoubleSide,transparent: true, opacity: 0.5 } );
const lineMaterial = new THREE.LineBasicMaterial( {
	color: 0x3446eb,
	linewidth: 1,
	linecap: 'round', //ignored by WebGLRenderer
	linejoin:  'round', //ignored by WebGLRenderer
    side: THREE.DoubleSide
} );
var tex;


//main async function
async function main() {


	//envmap
	 const mapTexture = new THREE.TextureLoader().load("assets/envmap.png");

	 mapTexture.mapping = THREE.EquirectangularReflectionMapping;

	 const plastic = new THREE.MeshPhysicalMaterial({ 
		roughness: 1, 
		transparent:true,
		opacity:0.7,
		transmission: 1,  
		thickness: 0.5,
		envMap: mapTexture,
		envMapIntensity: 5,
		clearcoat: 1,
		iridescence: 1,
		iridescenceIOR:1

	  });




	
	//load models
	var cornerModel = await loader.loadAsync("../assets/corner.glb", function ( gltf ) {

		
		
		

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		


	});

	var jointModel = await loader.loadAsync("../assets/joint.glb", function ( gltf ) {
		
		
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		
	

	});


	//set object materials
	cornerModel.scene.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
                child.material = plastic;
				
         }
    } );

	jointModel.scene.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
                child.material = plastic;
				
         }
    } );

	
	const cornerRight = cornerModel.scene;
	const cornerLeft = cornerRight.clone();
	const jointTop = jointModel.scene;
	const jointLeft = jointTop.clone();
	const jointRight = jointTop.clone();




//map function
function mapper (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}



//sizing of the box
const sideSize = 3;
const planeWidth = sideSize * 0.8;
const planeHeight = planeWidth;


//joint size
const jointSize = sideSize * 0.2;
const boxRadius = 1.0;



//mesh arrays and geometries
const planes = [];
const joints = [];
const corners = [];
const panelGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);





//create plane
const panel = new THREE.Mesh(panelGeometry, plastic);

const sidePanelRight = new THREE.Mesh(panelGeometry, plastic);

const sidePanelLeft = new THREE.Mesh(panelGeometry, plastic);

//create and position objects

//joints
jointTop.scale.set(planeWidth*2, jointSize, jointSize);
jointTop.translateY((planeWidth/2) +(jointSize/4) );
jointTop.translateZ(-jointSize/4);

jointLeft.rotateZ(Math.PI/2);
jointLeft.scale.set(planeWidth*2, jointSize, jointSize);
jointLeft.translateY((planeWidth/2) +(jointSize/4) );
jointLeft.translateZ(-jointSize/4);

jointRight.rotateZ(-Math.PI/2);
jointRight.scale.set(planeWidth*2, jointSize, jointSize);
jointRight.translateY((planeWidth/2) +(jointSize/4) );
jointRight.translateZ(-jointSize/4);

//corners
cornerRight.scale.set(jointSize, jointSize, jointSize);
cornerRight.translateY((planeWidth/2) +(jointSize/4) );
cornerRight.translateX((planeWidth/2) +jointSize/4);
cornerRight.translateZ(-jointSize/4);

cornerLeft.rotateY(-Math.PI/2);
cornerLeft.scale.set(jointSize, jointSize, jointSize);
 cornerLeft.translateY((planeWidth/2) +(jointSize/4) );
  cornerLeft.translateZ((planeWidth/2) + jointSize/4  );
 cornerLeft.translateX(-jointSize/4);

    
//create groups
const side = new THREE.Group();
const sidesAll = new THREE.Group();
const box = new THREE.Group();



side.add(cornerRight, cornerLeft, jointTop, panel, jointLeft, jointRight)

//assemble sides
const side2 = side.clone();

side2.rotateX(-Math.PI/2);
side2.translateY(sideSize/2);
side2.translateZ(sideSize/2);

const side3 = side2.clone();
side3.rotateX(-Math.PI/2);
side3.translateY(sideSize/2);
side3.translateZ(sideSize/2);

const side4 = side3.clone();
side3.rotateX(-Math.PI/2);
side3.translateY(sideSize/2);
side3.translateZ(sideSize/2);

const side5 = sidePanelRight;
side5.rotateY(-Math.PI/2);
side5.translateZ(sideSize/2);
side5.translateX(-sideSize/2);

const side6 = sidePanelLeft;
side6.rotateY(Math.PI/2);
side6.translateZ(sideSize/2);
side6.translateX(sideSize/2);


sidesAll.add(side, side2, side3, side4, side5, side6);

sidesAll.translateZ(sideSize/2);
box.add(sidesAll);

scene.add(box, light);





//center the box








function animate() {
  
	requestAnimationFrame( animate );

	box.rotation.y += 0.003;
	box.rotation.x += 0.003;


	renderer.render( scene, camera );
}
animate();




}

main();