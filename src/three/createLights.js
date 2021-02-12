import { AmbientLight, DirectionalLight, Group } from 'three';

const aLightColor = 0xffffff;
const aLightItensity = 1;
const dLightColor = 0x505050;
const dLightItensity = 0.02;
const dLightPositions = [
  [0, 0, 100],
  [100, 0, 0],
  [0, 0, -100],
  [-100, 0, -100],
];

export default () => {
  const lights = new Group();

  // dLightPositions.forEach((position) => {
  //  const dLight = new DirectionalLight(dLightColor, dLightItensity);
  //  dLight.castShadow = true;
  //  dLight.position.set(...position);
  //  lights.add(dLight);
  // });

  const aLight = new AmbientLight(aLightColor, aLightItensity);
  lights.add(aLight);

  return lights;
};
