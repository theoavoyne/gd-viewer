import { sRGBEncoding, WebGLRenderer } from 'three';

const alpha = true;
const antialias = true;

export default (canvas) => {
  const renderer = new WebGLRenderer({ alpha, antialias, canvas });
  renderer.outputEncoding = sRGBEncoding;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return renderer;
};
