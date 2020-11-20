import { PointLight } from 'three';

const color = 0xffffff;
const position = [0, 0, 100];

export default () => {
  const light = new PointLight(color);
  light.position.set(...position);

  return light;
};
