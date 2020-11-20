import * as THREE from 'three';

// SPHERE
const heightSegments = 24;
const radius = 20;
const widthSegments = 24;

// LINE
const color = 0x758c69;

export default () => {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color });

  return new THREE.LineSegments(wireframe, material);
};
