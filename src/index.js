import 'normalize.css/normalize.css';
import './static/styles/base.scss';

import debounce from 'lodash.debounce';
import Stats from 'stats-js';
import { Box3, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import createCamera from './three/createCamera';
import createLight from './three/createLight';
import createParticles from './three/createParticles';
import createRenderer from './three/createRenderer';
import createScene from './three/createScene';

const canvasElement = document.getElementById('canvas');
const progressBarElement = document.getElementById('progressBar');
const progressContainerElement = document.getElementById('progressContainer');

const stats = new Stats();
stats.showPanel(2);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const showStats = urlParams.get('stats') === 'true';
if (showStats) { document.body.appendChild(stats.dom); }

const camera = createCamera();
const light = createLight();
const particles = createParticles();
const renderer = createRenderer(canvasElement);
const scene = createScene();

const controls = new OrbitControls(camera, canvasElement);
controls.autoRotate = true;
controls.enable = false;
controls.enableDamping = true;
controls.maxDistance = 100;
controls.minDistance = 30;

scene.add(light);
scene.add(particles);

const animate = () => {
  stats.begin();
  controls.update();
  particles.children.forEach((particle) => {
    if (particle.position.y <= -100) {
      particle.position.y = 100;
    } else {
      particle.position.y -= 0.1;
    }
  });
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
};

const onResize = debounce(
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  150,
);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('public/draco/');

const promises = [
  new Promise((resolve, reject) => {
    new GLTFLoader()
      .setDRACOLoader(dracoLoader)
      .load(
        'https://firebasestorage.googleapis.com/v0/b/gd-viewer.appspot.com/o/darel.glb?alt=media',
        (gltf) => {
          dracoLoader.dispose();
          resolve(gltf.scene);
        },
        (xhr) => {
          const progress = xhr.loaded / xhr.total;
          progressBarElement.style.width = `${progress * 100}%`;
          if (progress === 1) { progressContainerElement.style.opacity = 0; }
        },
        reject,
      );
  }),
];

Promise.all(promises).then(([object]) => {
  const box = new Box3().setFromObject(object);
  const center = box.getCenter(new Vector3());
  object.children[0].castShadow = true;
  object.children[0].receiveShadow = true;
  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);
  scene.add(object);
  controls.enable = true;
  animate();
});

window.addEventListener('resize', onResize);
