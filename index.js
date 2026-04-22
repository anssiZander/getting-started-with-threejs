import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const fov=75;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const geometry = new THREE.IcosahedronGeometry(1,3);
const material = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading: true});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
    


const wireMat=new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.set(1.01, 1.01, 1.01);
mesh.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xff1100, 1);
scene.add(hemiLight);

function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    controls.update();

    renderer.render(scene,camera);
}
animate();