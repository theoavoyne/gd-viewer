import { AmbientLight, Group, PointLight } from 'three';

const ambientLightColor = 0xffffff;
const ambientLightItensity = 1.5;
const pointLightColor = 0x969696;
const pointLightItensity = 0.05;
const pointLightPositions = [
  [0, 0, 100],
  [100, 0, 0],
  [0, 0, -100],
  [-100, 0, -100],
];

export default () => {
  const lights = new Group();

  pointLightPositions.forEach((position) => {
    const light = new PointLight(pointLightColor, pointLightItensity);
    light.position.set(...position);
    lights.add(light);
  });

  const ambientLight = new AmbientLight(ambientLightColor, ambientLightItensity);
  lights.add(ambientLight);

  return lights;
};
