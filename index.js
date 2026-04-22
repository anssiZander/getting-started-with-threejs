import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { getFresnelMat } from "./getFresnelMat.js";

import getStarfield from "./getStarfield.js";


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

const loader = new THREE.TextureLoader();


const geometry = new THREE.IcosahedronGeometry(1,12);
const material = new THREE.MeshStandardMaterial({map: loader.load("textures/earthmap1k.jpg")
});
const mesh = new THREE.Mesh(geometry, material);

    
const earthGroup = new THREE.Group();
earthGroup.rotation.z=-23.4*Math.PI/180;
earthGroup.add(mesh);
scene.add(earthGroup);

scene.add(getStarfield({ numStars: 2000 }));


const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("textures/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh =new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat= new THREE.MeshStandardMaterial({
    map: loader.load("textures/earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.set(1.02,1.02,1.02);
earthGroup.add(cloudsMesh);

const fresnelMat= getFresnelMat();

const fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
fresnelMesh.scale.set(1.05,1.05,1.05);
earthGroup.add(fresnelMesh);

const sunLight= new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-5,-2,2);
scene.add(sunLight);

function animate(){
    requestAnimationFrame(animate);
    //mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.005;
    lightsMesh.rotation.y += 0.005;
    cloudsMesh.rotation.y += 0.005;
    controls.update();

    renderer.render(scene,camera);
}
animate();