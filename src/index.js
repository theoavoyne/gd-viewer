import 'normalize.css/normalize.css';
import './static/styles/base.scss';

import debounce from 'lodash.debounce';
import { PMREMGenerator, UnsignedByteType, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import createCamera from './three/createCamera';
import createLight from './three/createLight';
import createRenderer from './three/createRenderer';
import createScene from './three/createScene';

const canvasElement = document.getElementById('canvas');
const progressBarElement = document.getElementById('progressBar');
const progressContainerElement = document.getElementById('progressContainer');

const camera = createCamera();
const light = createLight();
const renderer = createRenderer(canvasElement);
const scene = createScene();

const controls = new OrbitControls(camera, canvasElement);
controls.autoRotate = true;
controls.enable = false;
controls.enableDamping = true;
controls.maxDistance = 100;
controls.minDistance = 30;

scene.add(light);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
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

const pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const promises = [
  new Promise((resolve, reject) => {
    new RGBELoader()
      .setDataType(UnsignedByteType)
      .load(
        'https://firebasestorage.googleapis.com/v0/b/barney-production.appspot.com/o/venice-sunset.hdr?alt=media',
        (texture) => {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          pmremGenerator.dispose();
          resolve(envMap);
        },
        undefined,
        reject,
      );
  }),
  new Promise((resolve, reject) => {
    new GLTFLoader()
      .setDRACOLoader(dracoLoader)
      .load(
        'https://firebasestorage.googleapis.com/v0/b/barney-production.appspot.com/o/black-shoe.glb?alt=media',
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

Promise.all(promises).then(([envMap, obj]) => {
  scene.environment = envMap;
  obj.scale.set(100, 100, 100);
  obj.position.y = -15;
  obj.rotateOnWorldAxis(new Vector3(1, 0, 0), -Math.PI / 2);
  obj.rotation.z = Math.PI / 2;
  scene.add(obj);
  controls.enable = true;
  animate();
});

window.addEventListener('resize', onResize);
