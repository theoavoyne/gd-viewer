import 'normalize.css/normalize.css';
import './static/styles/base.scss';

import debounce from 'lodash.debounce';

import createCamera from './three/createCamera';
import createLight from './three/createLight';
import createRenderer from './three/createRenderer';
import createScene from './three/createScene';
import createSphere from './three/createSphere';

const canvasElement = document.getElementById('canvas');

const camera = createCamera();
const light = createLight();
const renderer = createRenderer(canvasElement);
const scene = createScene();
const sphere = createSphere();

scene.add(light);
scene.add(sphere);

const animate = () => {
  sphere.rotation.y += 0.005;
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

window.addEventListener('resize', onResize);

animate();
