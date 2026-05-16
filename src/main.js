import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import earthTexture from './img/earth.jpg';
import jupiterTexture from './img/jupiter.jpg';
import marsTexture from './img/mars.jpg';
import mercuryTexture from './img/mercury.jpg';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';
import saturnRingTexture from './img/saturn ring.png';
import saturnTexture from './img/saturn.jpg';
import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import uranusRingTexture from './img/uranus ring.png';
import uranusTexture from './img/uranus.jpg';
import venusTexture from './img/venus.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj }
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xFFFFFF, 1000, 5000);
scene.add(pointLight);

const gui = new GUI();

const options = {
    planetSpeed: 1,
    sunLightIntensity: 500
};

gui.add(options, 'planetSpeed', 0, 2, 0.01);

gui.add(options, 'sunLightIntensity', 0, 2000);

function animate() {
    orbit.update();

    //Self-rotation
    sun.rotateY(0.004 * options.planetSpeed);

    mercury.mesh.rotateY(0.004 * options.planetSpeed);
    venus.mesh.rotateY(0.002 * options.planetSpeed);
    earth.mesh.rotateY(0.02 * options.planetSpeed);
    mars.mesh.rotateY(0.018 * options.planetSpeed);
    jupiter.mesh.rotateY(0.04 * options.planetSpeed);
    saturn.mesh.rotateY(0.038 * options.planetSpeed);
    uranus.mesh.rotateY(0.03 * options.planetSpeed);
    neptune.mesh.rotateY(0.032 * options.planetSpeed);
    pluto.mesh.rotateY(0.008 * options.planetSpeed);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04 * options.planetSpeed);
    venus.obj.rotateY(0.015 * options.planetSpeed);
    earth.obj.rotateY(0.01 * options.planetSpeed);
    mars.obj.rotateY(0.008 * options.planetSpeed);
    jupiter.obj.rotateY(0.002 * options.planetSpeed);
    saturn.obj.rotateY(0.0009 * options.planetSpeed);
    uranus.obj.rotateY(0.0004 * options.planetSpeed);
    neptune.obj.rotateY(0.0001 * options.planetSpeed);
    pluto.obj.rotateY(0.00007 * options.planetSpeed);

    pointLight.intensity = options.sunLightIntensity;
    earth.obj.rotateY(0.01 * options.planetSpeed);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});