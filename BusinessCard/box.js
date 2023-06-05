import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


class Cube {

    constructor() {



    }
  
    async create() {

      const loader = new GLTFLoader();
      const mapTexture = new THREE.TextureLoader().load("assets/envmap.png");
      const normalMapTexture = new THREE.TextureLoader().load("assets/5.jpg");

      normalMapTexture.wrapS = THREE.RepeatWrapping;
      normalMapTexture.wrapT = THREE.RepeatWrapping;
      mapTexture.mapping = THREE.EquirectangularReflectionMapping;

     // const TextureLoader = THREE.TextureLoader.load("assets/Project1/Devices.png");

      function mp(textureUrl) {

         const textureLoader = new THREE.TextureLoader();
         const texture = textureLoader.load(textureUrl);

         return {
            map: texture,
            transparent: true,
         }
      }



const plastic = new THREE.MeshPhysicalMaterial({


   color: 0xb0b0b0,
   roughness: 0.5, 
   transparent:true,
   opacity:1,
   reflectivity: 0,
   metalness:0,
   attenuationColor: 0xffffff,
   sheen: 1,
   sheenRoughness: 1,
   transmission: 1,  
   thickness: 0-5,
   envMap: mapTexture,
   envMapIntensity: 3,
   clearcoat: 1,
   iridescence: 1,
   iridescenceIOR:1,

   // clearcoatRoughness: 1,
   // normalMap: normalMapTexture,
   // normalScale: new THREE.Vector2(0.01,0.01),
   // clearcoatNormalMap: normalMapTexture,
   // clearcoatNormalScale: new THREE.Vector2(0.01,0.01)
   

});

 const textureMaterial = new THREE.MeshBasicMaterial(
   mp("assets/Project1/Devices.png")


   );

   const transparentMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      opacity: 0.0,  
      transparent: true,  
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
// cornerModel.scene.traverse( function( child ) {
//    if ( child.type == "Mesh" ) {
//            child.material = plastic;
//            console.log("found it")
//            child.material.shading = THREE.SmoothShading;
//     }
// } );

// jointModel.scene.traverse( function( child ) {
//    if ( child.type == "Mesh" ) {
//            child.material = plastic;
//            //child.material.shading = THREE.SmoothShading;
           
//     }
// } );


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
const planeWidth = sideSize * 0.9;
const planeHeight = sideSize * 0.9;




//joint size
const jointSize = sideSize * 0.1;




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


sidesAll.add(front, top, back, bottom, left, right);

//center the box





//clone the box for textures on background

const textureSides = sidesAll.clone();

//scale the box
sidesAll.scale.set(0.99,0.99,0.99);

//center the box
const center = new THREE.Box3().setFromObject( sidesAll ).getCenter( sidesAll.position ).multiplyScalar( - 1 );
const centerT = new THREE.Box3().setFromObject( textureSides ).getCenter( textureSides.position ).multiplyScalar( - 1 );


textureSides.traverse( function( child ) {


      if ( child.type == "Mesh" && child.geometry instanceof THREE.PlaneGeometry ) {
              child.material = textureMaterial;

             
             
      } else if (child.type != "Group" && !(child.geometry instanceof THREE.PlaneGeometry) ) {
        
        
    
      
         
         child.material = transparentMaterial;
      }
              
   } );

   sidesAll.traverse( function( child ) {

      child.material = plastic;
              
   } );


   



   
   


box.add(sidesAll);





return box;
    
    }

}



export default Cube;

