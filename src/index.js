import 'normalize.css/normalize.css';
import './static/styles/base.scss';

import debounce from 'lodash.debounce';
import Stats from 'stats-js';
import { Box3, EquirectangularReflectionMapping, sRGBEncoding, TextureLoader, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import createCamera from './three/createCamera';
import createLights from './three/createLights';
import createRenderer from './three/createRenderer';
import createScene from './three/createScene';

const canvasElement = document.getElementById('canvas');
const progressBarElement = document.getElementById('progressBar');
const progressContainerElement = document.getElementById('progressContainer');

let stats1;
let stats2;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const showStats = urlParams.get('stats') === 'true';

if (showStats) {
  stats1 = new Stats();
  stats1.showPanel(0);
  stats1.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
  document.body.appendChild(stats1.dom);

  stats2 = new Stats();
  stats2.showPanel(1);
  stats2.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
  document.body.appendChild(stats2.dom);
}

const camera = createCamera();
const lights = createLights();
const renderer = createRenderer(canvasElement);
const scene = createScene();

const controls = new OrbitControls(camera, canvasElement);
controls.autoRotate = true;
controls.enable = false;
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 100;
controls.minDistance = 30;

scene.add(lights);

const animate = () => {
  if (showStats) { stats1.begin(); }
  if (showStats) { stats2.begin(); }
  controls.update();
  renderer.render(scene, camera);
  if (showStats) { stats1.end(); }
  if (showStats) { stats2.end(); }
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
    new TextureLoader()
      .load(
        'https://firebasestorage.googleapis.com/v0/b/gd-viewer.appspot.com/o/studio.jpg?alt=media',
        (texture) => {
          texture.mapping = EquirectangularReflectionMapping;
          texture.encoding = sRGBEncoding;
          resolve(texture);
        },
        undefined,
        reject,
      );
  }),
  new Promise((resolve, reject) => {
    new GLTFLoader()
      .setDRACOLoader(dracoLoader)
      .load(
        'https://firebasestorage.googleapis.com/v0/b/gd-viewer.appspot.com/o/darel4.glb?alt=media',
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

Promise.all(promises).then(([envMap, object]) => {
  scene.environment = envMap;
  const box = new Box3().setFromObject(object);
  const center = box.getCenter(new Vector3());
  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);
  scene.add(object);
  controls.enable = true;
  animate();
});

window.addEventListener('resize', onResize);
