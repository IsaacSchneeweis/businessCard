

import * as THREE from '../node_modules/three/build/three.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
//basic init
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls( camera, renderer.domElement );


//map function
function mapper (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


//sizing of the box
const sideSize = 3;
const planeWidth = sideSize * 0.95;
const planeHeight = planeWidth;

//joint shape
//create joint shape
const jS = new THREE.Shape()


//joint size
jointSize = sideSize * 0.05;
const boxRadius = 0.95;

jS.bezierCurveTo(
    //control points
    0,
    jointSize * boxRadius,
    mapper(boxRadius,0,1,jointSize,0),
    jointSize, 
    
    //final point
    jointSize,jointSize);

    jS.lineTo(jointSize,jointSize/2);
   
   
    jS.bezierCurveTo(
        //control points
        mapper(boxRadius,0,1,1*jointSize,0.5*jointSize),
        jointSize/2,
        jointSize/2,
        mapper(boxRadius,0,1,0,jointSize/2), 
        
        //final point
        jointSize/2, 0.0);
     

        console.log(mapper(boxRadius,0,1,0.5,0));
  

//joint settings
const extrudeSettings = { depth: planeWidth, bevelEnabled: true, bevelSegments: 0, steps: 10, bevelSize: 0, bevelThickness: 0, curveSegments: 12 };




//mesh arrays and geometries
const planes = [];
const joints = [];
const corners = [];
const panelGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);





const jointGeometry = new THREE.ExtrudeGeometry(jS, extrudeSettings);



//group
const side = new THREE.Group();
const box = new THREE.Group();

//material
const greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.99 } );
const blueMaterial = new THREE.MeshBasicMaterial( { color: 0x3446eb, side: THREE.DoubleSide,transparent: true, opacity: 0.99 } );


//create and position short side meshes
const panel = new THREE.Mesh(panelGeometry, greenMaterial);
    

const jointTop = new THREE.Mesh(jointGeometry, blueMaterial);
jointTop.rotateY(1.5707);
jointTop.translateZ((-planeWidth/2));
jointTop.translateY(planeWidth/2);


const jointRight = new THREE.Mesh(jointGeometry, blueMaterial);
jointRight.rotateX(3.14);
jointRight.rotateX(-1.5707);
jointRight.translateZ((-planeWidth/2));
jointRight.translateX(planeWidth/2);
jointRight.rotateZ(Math.PI);

const jointLeft = new THREE.Mesh(jointGeometry, blueMaterial);
jointLeft.rotateX(-1.5707);
jointLeft.translateX(-planeWidth/2);
jointLeft.translateZ((-planeWidth/2));






side.add(panel, jointTop, jointRight, jointLeft);





//create corner meshes
for (var i = 0; i <= 4; i++) {


}
    

const side2 = side.clone();

box.add(side, side2);
side2.rotateX(-1.5);
side.translateZ(sideSize/2);
side2.translateZ(sideSize/2);


scene.add( box, light);




camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
   box.rotation.x += 0.01;
//box.rotation.y += 0.01;
controls.update();

	renderer.render( scene, camera );
}
animate();