


import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


//basic init
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

const scene = new THREE.Scene({background: 0x121212});
renderer.setClearColor( 0x121212, 1);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new GLTFLoader();

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(0, 5, 10);

const Alight = new THREE.AmbientLight( 0x404040 );




renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//oribtcontrols and camera
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 3;









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
		envMapIntensity: 2,
		clearcoat: 1,
		iridescence: 1,
		iridescenceIOR:1,
	
		clearcoatRoughness: 0,
		normalMap: normalMapTexture,
		normalScale: new THREE.Vector2(0.01,0.01),
		clearcoatNormalMap: normalMapTexture,
		clearcoatNormalScale: new THREE.Vector2(0.01,0.01)
		

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
const sideSize = 1;
const planeWidth = sideSize * 0.7;
const planeHeight = sideSize * 0.7;

const height = 1 * sideSize;
const depth = 1 * sideSize;
const width = 0.5 * sideSize


//joint size
const jointSize = sideSize * 0.3;




//mesh arrays and geometries
const planes = [];
const joints = [];
const corners = [];
const panelGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);



//create planes
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
const front = new THREE.Group();
const sidesAll = new THREE.Group();
const box = new THREE.Group();

front.add(cornerRight, cornerLeft, jointTop, panel, jointLeft, jointRight)

//assemble sides
const top = front.clone();

top.rotateX(-Math.PI/2);
top.translateY(sideSize/2);
top.translateZ(sideSize/2);

const back = top.clone();
back.rotateX(-Math.PI/2);
back.translateY(sideSize/2);
back.translateZ(sideSize/2);

const bottom = back.clone();
bottom.rotateX(-Math.PI/2);
bottom.translateY(sideSize/2);
bottom.translateZ(sideSize/2);

const right = sidePanelRight;
right.rotateY(-Math.PI/2);
right.translateZ(sideSize/2);
right.translateX(-sideSize/2);

const left = sidePanelLeft;
left.rotateY(Math.PI/2);
left.translateZ(sideSize/2);
left.translateX(sideSize/2);

//set front dynamic size
//front.children[1].translate.set(2,1,2);



sidesAll.add(front, top, back, bottom, left, right);

sidesAll.translateZ(sideSize/2);



box.add(sidesAll);



scene.add(box, light, Alight);















function animate() {
  
	requestAnimationFrame( animate );

	box.rotation.y += 0.001;
	box.rotation.x += 0.001;


	renderer.render( scene, camera );
}
animate();




}

main();