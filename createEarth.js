import { getFresnelMat } from "./getFresnelMat.js";

export function createEarth(THREE) {
  const loader = new THREE.TextureLoader();
  const surfaceGeometry = new THREE.IcosahedronGeometry(1, 12);

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("./textures/earthmap1k.jpg"),
    bumpMap: loader.load("./textures/earthbump1k.jpg"),
    bumpScale: 0.03,
    specularMap: loader.load("./textures/earthspec1k.jpg"),
    specular: new THREE.Color(0x355884),
    shininess: 18,
  });

  const earthMesh = new THREE.Mesh(surfaceGeometry, earthMaterial);

  const cityLightsMaterial = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const cityLightsMesh = new THREE.Mesh(surfaceGeometry, cityLightsMaterial);

  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("./textures/earthcloudmap.jpg"),
    alphaMap: loader.load("./textures/earthcloudmaptrans.jpg"),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const cloudsMesh = new THREE.Mesh(surfaceGeometry, cloudsMaterial);
  cloudsMesh.scale.setScalar(1.02);

  const fresnelMesh = new THREE.Mesh(
    surfaceGeometry,
    getFresnelMat(THREE, {
      rimHex: 0x5fb7ff,
      facingHex: 0x000000,
    })
  );
  fresnelMesh.scale.setScalar(1.05);

  const tiltedEarth = new THREE.Group();
  tiltedEarth.rotation.z = (-23.4 * Math.PI) / 180;
  tiltedEarth.add(earthMesh);
  tiltedEarth.add(cityLightsMesh);
  tiltedEarth.add(cloudsMesh);
  tiltedEarth.add(fresnelMesh);

  const root = new THREE.Group();
  root.add(tiltedEarth);

  const ambientLight = new THREE.AmbientLight(0x8096b8, 0.9);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.9);
  sunLight.position.set(-4, 2, 3);

  root.add(ambientLight);
  root.add(sunLight);

  root.userData.spin = (deltaSeconds) => {
    const earthSpin = deltaSeconds * 0.45;
    const cloudSpin = deltaSeconds * 0.52;

    earthMesh.rotation.y += earthSpin;
    cityLightsMesh.rotation.y += earthSpin;
    cloudsMesh.rotation.y += cloudSpin;
  };

  root.userData.dispose = () => {
    surfaceGeometry.dispose();
    earthMaterial.dispose();
    cityLightsMaterial.dispose();
    cloudsMaterial.dispose();
    fresnelMesh.material.dispose();
  };

  return root;
}
