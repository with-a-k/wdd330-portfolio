import { getLocation } from './utilities.js';

import Quake from './Quake.js';
import QuakeView from './QuakeView.js';

export default class QuakeController {
  constructor(parent, position = null) {
    this.parent = parent;
    this.parentElement = null;
    this.position = position || {
      lat: 0,
      lon: 0
    }
    this.quakes = new Quake();
    this.quakesView = new QuakeView();
  }

  async init() {
    this.parentElement = document.querySelector(this.parent);
    await this.initialPosition();
    this.getQuakesByRadius(100);
  }

  async initialPosition() {
    if (this.position.lat === 0) {
      try {
        const posFull = await getLocation();

        this.position.lat = posFull.coords.latitude;
        this.position.lon = posFull.coords.longitude;
      } catch (e) {
        console.log(e);
      }
    }
  }

  async getQuakesByRadius(radius = 100) {
    this.parentElement.innerHTML = '<li>Loading...</li>';

    const quakeList = await this.quakes.getEarthquakesByRadius(
      this.position,
      radius
    );

    this.quakesView.renderQuakeList(quakeList, this.parentElement);
  }

  async getQuakeDetails(quakeId) {
    const quake = this.quakes.getQakeById(quakeId);
    this.quakesView.renderQuake(quake, this.parentElement);
  }
}
