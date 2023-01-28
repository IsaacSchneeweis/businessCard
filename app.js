//basic init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//sizing of the box
const planeWidth = 2;
const planeHeight = planeWidth;

//mesh arrays and geometries
const planes = [];
const joints = [];
const corners = [];
const panel = new THREE.PlaneGeometry(planeWidth, planeHeight);

const box = new THREE.Group();

//material
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );


//create and position geometries
for (var i = 0; i <= 3; i++) {

    //create planes
    planes[i] = new THREE.Mesh(panel, material);
    planes[i].rotateY(1.5707 * i);
    planes[i].translateZ(planeWidth/2 );

    //create joints

    //create corners
  
    box.add(planes[i]);
   

}

scene.add( box );




camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
   //box.rotation.x += 0.01;
box.rotation.y += 0.01;


	renderer.render( scene, camera );
}
animate();