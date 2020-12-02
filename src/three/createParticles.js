import sample from 'lodash.sample';
import { Group, Sprite, SpriteMaterial, TextureLoader } from 'three';

import Snow1PNG from '../static/images/snow1.png';
import Snow2PNG from '../static/images/snow2.png';
import Snow3PNG from '../static/images/snow3.png';

const count = 500;

export default () => {
  const textureLoader = new TextureLoader();

  const materials = [
    new SpriteMaterial({ map: textureLoader.load(Snow1PNG) }),
    new SpriteMaterial({ map: textureLoader.load(Snow2PNG) }),
    new SpriteMaterial({ map: textureLoader.load(Snow3PNG) }),
  ];

  const particles = new Group();

  for (let i = 0; i < count; i += 1) {
    const particle = new Sprite(sample(materials));
    particle.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
    );
    particles.add(particle);
  }

  return particles;
};
