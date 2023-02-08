import './style.css';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

// Setup


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus1 and Torus2

const geometry = new THREE.TorusGeometry(10, 1, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x03C988});
const torus1 = new THREE.Mesh(geometry, material);

scene.add(torus1);
// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

 //const lightHelper = new THREE.PointLightHelper(pointLight)
 //const gridHelper = new THREE.GridHelper(200, 50);
 //scene.add(lightHelper, gridHelper)

 //const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('/space.jpg');
scene.background = spaceTexture;

// Avatar

const faceTexture = new THREE.TextureLoader().load('/suvan.png');

const suvan = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: faceTexture }));

scene.add(suvan);

// saturn

const saturnTexture = new THREE.TextureLoader().load('/saturn.jpg');


const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: saturnTexture 
  })
);

scene.add(saturn);

//rings

const texture = new THREE.TextureLoader().load(
  "https://i.postimg.cc/zz7Gr430/saturn-rings-top.png"
);
const geometry1 = new THREE.RingBufferGeometry(3, 5, 64);
var pos = geometry1.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++){
  v3.fromBufferAttribute(pos, i);
  geometry1.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}
// adjustRingGeometry(geometry);

const material1 = new THREE.MeshBasicMaterial({
  map: texture,
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true
});
const mesh = new THREE.Mesh(geometry1, material1);

scene.add(mesh)
//Icosahedron

const icogeometry = new THREE.IcosahedronGeometry(10,0);
const icomaterial = new THREE.MeshStandardMaterial({ color: 0x1C82AD});
const icosahedron = new THREE.Mesh(icogeometry, icomaterial);



scene.add(icosahedron);


//positions

saturn.position.z = 30;
saturn.position.setX(-10);

suvan.position.z = -5;
suvan.position.x = 2;

mesh.position.z=30;
mesh.position.setX(-10);

icosahedron.position.z = 45;
icosahedron.position.x = -25;
icosahedron.position.y =  -5

//Ambient audio
function Ambientaudio() {
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);
const audioloader = new THREE.AudioLoader();
audioloader.load('/spacemusic.mp3',(buffer) =>{
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(2);
  sound.setRefDistance(0.5);
  sound.setRolloffFactor(0.09)
  sound.play();
})

suvan.add(sound);
}

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  saturn.rotation.x += 0.05;
  saturn.rotation.y += 0.075;
  saturn.rotation.z += 0.05;

  suvan.rotation.y += 0.01;
  suvan.rotation.z += 0.01;

  icosahedron.rotation.x += 0.05;
  icosahedron.rotation.y += 0.08;
  icosahedron.rotation.x += 0.1;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();
Ambientaudio();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus1.rotation.x += 0.01;
  torus1.rotation.y += 0.005;
  torus1.rotation.z += 0.01;

  mesh.rotation.x +=0.01;
  mesh.rotation.y += 0.008;  

  icosahedron.rotation.x +=0.005;
  icosahedron.rotation.y +=0.02;

  saturn.rotation.x += 0.005;

  //controls.update();

  renderer.render(scene, camera);
}

animate();
