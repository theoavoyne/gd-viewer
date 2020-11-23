import { Group, PointLight } from 'three';

const color = 0xffffff;
const positions = [
  [0, 0, 100],
  [100, 0, 0],
  [0, 0, -100],
  [-100, 0, -100],
  [0, -100, 0], // under
];

export default () => {
  const lights = new Group();

  positions.forEach((position) => {
    const light = new PointLight(color);
    light.position.set(...position);
    lights.add(light);
  });

  return lights;
};
