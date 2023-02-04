


import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
//import {loadModels} from "/loaders"

//basic init
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

const scene = new THREE.Scene({background: 0x121212});
renderer.setClearColor( 0x121212, 1);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();

const light = new THREE.DirectionalLight(0xffffff, 20);
light.position.set(0, 5, 10);

const Alight = new THREE.AmbientLight( 0x404040 );




renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//oribtcontrols and camera
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 40;









//main async function
async function main() {


	//envmap
	 const mapTexture = new THREE.TextureLoader().load("assets/2.jpg");
	 const normalMapTexture = new THREE.TextureLoader().load("assets/5.jpg");

	 normalMapTexture.wrapS = THREE.RepeatWrapping;
		normalMapTexture.wrapT = THREE.RepeatWrapping;


	 mapTexture.mapping = THREE.EquirectangularReflectionMapping;

	 const plastic = new THREE.MeshPhysicalMaterial({ 
	
		roughness: 1, 
		transparent:true,
		opacity:0.7,
		reflectivity: 1,
		metalness:0,
		ior: 1,
		sheen: 1,
		transmission: 1,  
		thickness: 0.1,
		envMap: mapTexture,
		envMapIntensity: 1,
		clearcoat: 1,
		iridescence: 1,
		iridescenceIOR:1,
		
		clearcoatRoughness: 0,
		normalMap: normalMapTexture,
		normalScale: new THREE.Vector2(0.1,0.1),
		clearcoatNormalMap: normalMapTexture,
		clearcoatNormalScale: new THREE.Vector2(0.1,0.1)
		

	  });

	  const geometry = new THREE.SphereGeometry( 8, 16, 7 );
	  const material = new THREE.MeshStandardMaterial( { 
		
		color: 0xffffff, 
	
	
	} );
	  const cube = new THREE.Mesh( geometry, material );
	 


	
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

	//console.log(cornerModel);
	//set object materials
	cornerModel.scene.traverse( function( child ) {
        if ( child.type == "Mesh" ) {
                child.material = plastic;
				console.log("found it")
				child.material.shading = THREE.SmoothShading;
         }
    } );

	jointModel.scene.traverse( function( child ) {
        if ( child.type == "Mesh" ) {
                child.material = plastic;
				//child.material.shading = THREE.SmoothShading;
				
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
const sideSize = 20;
const planeWidth = sideSize * 0.7;
const planeHeight = planeWidth;


//joint size
const jointSize = sideSize * 0.3;




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
box.add(sidesAll, cube);

scene.add(box, light, Alight);







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