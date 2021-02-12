import { AmbientLight, DirectionalLight, Group } from 'three';

const aLightColor = 0xffffff;
const aLightItensity = 1.5;
const dLightColor = 0x505050;
const dLightItensity = 1;
const dLightPositions = [
  [100, 100, 0],
  [50, 50, -50],
  [-20, 100, -100],
];

export default () => {
  const lights = new Group();

  dLightPositions.forEach((position) => {
    const dLight = new DirectionalLight(dLightColor, dLightItensity);
    dLight.castShadow = true;
    dLight.position.set(...position);
    lights.add(dLight);
  });

  const aLight = new AmbientLight(aLightColor, aLightItensity);
  lights.add(aLight);

  return lights;
};
