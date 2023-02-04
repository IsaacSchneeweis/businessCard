

import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


//basic init
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
renderer.setClearColor( 0xd1d1d1);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const loader = new THREE.GLTFLoader();

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls( camera, renderer.domElement );


//map function
function mapper (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


//sizing of the box
const sideSize = 3;
const planeWidth = sideSize * 0.94;
const planeHeight = planeWidth;

//joint shape

//joint size
const jointSize = sideSize * 0.06;
const boxRadius = 1.0;

//create joint shape
const jS = new THREE.Shape()

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


//



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
const greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 } );
const blueMaterial = new THREE.MeshBasicMaterial( { color: 0x3446eb, side: THREE.DoubleSide,transparent: true, opacity: 0.5 } );
const lineMaterial = new THREE.LineBasicMaterial( {
	color: 0x3446eb,
	linewidth: 1,
	linecap: 'round', //ignored by WebGLRenderer
	linejoin:  'round', //ignored by WebGLRenderer
    side: THREE.DoubleSide
} );


//create and position short side meshes
const panel = new THREE.Mesh(panelGeometry, greenMaterial);
    

const jointTop = new THREE.Mesh(jointGeometry, blueMaterial);
jointTop.rotateY(1.5707);
jointTop.translateZ((-planeWidth/2));
jointTop.translateY(planeWidth/2);


const jointRight = new THREE.Mesh(jointGeometry, blueMaterial);

jointRight.rotateZ(Math.PI);
jointRight.rotateX(Math.PI/2);


jointRight.translateZ((-planeWidth/2));
jointRight.translateY(-jointSize);
jointRight.translateX(-planeWidth/2-jointSize);



const jointLeft = new THREE.Mesh(jointGeometry, blueMaterial);
jointLeft.rotateX(-1.5707);
jointLeft.rotateZ(1.5707);
jointLeft.translateZ(-planeWidth/2);
jointLeft.translateY(planeWidth/2);



side.add(panel, jointTop, jointRight, jointLeft);







//create corner meshes
const curve1 = new THREE.QuadraticBezierCurve3(
	new THREE.Vector3( 0, 0, 0),
	new THREE.Vector3( 0.5, 0,  .5),
	new THREE.Vector3( 1, 0, 0)
);
const curve2 = new THREE.QuadraticBezierCurve3(
	new THREE.Vector3( 1, 0, 0 ),
	new THREE.Vector3( 1, 0.5, 0 ),
	new THREE.Vector3( 0.5, 0.5, 0 )
);
const curve3 = new THREE.QuadraticBezierCurve3(
	new THREE.Vector3( 0.5, 0.5, 0 ),
	new THREE.Vector3(0, 0.5, 0 ),
	new THREE.Vector3( 0., 0, 0 )
);


const curves = new THREE.CurvePath();
curves.add(curve1, curve2,curve3);

const points1 = curve1.getPoints( 24 );
const points2 = curve2.getPoints( 24 );
const points3 = curve3.getPoints( 24 );

const combinedPoints = points1.concat(points2, points3);

const cornerGeometry = new THREE.ExtrudeGeometry().setFromPoints(combinedPoints);
const corner = new THREE.Mesh(cornerGeometry, lineMaterial);




    

const side2 = side.clone();




side2.rotateX(-Math.PI/2);
side2.translateY(sideSize/2);
side2.translateZ((sideSize/2)+(jointSize/2));

const side3 = side2.clone();
side3.rotateX(-Math.PI/2);
side3.translateY(sideSize/2);
side3.translateZ((sideSize/2)+(jointSize/2));

box.add(side, side2, side3,);
scene.add( corner );




camera.position.z = 2;

function animate() {
	requestAnimationFrame( animate );
 //  box.rotation.x += 0.01;
//box.rotation.y += 0.01;

	renderer.render( scene, camera );
}
animate();