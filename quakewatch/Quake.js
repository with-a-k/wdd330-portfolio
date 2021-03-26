import { getJSON } from "./utilities.js";

export default class Quake {
  constructor() {
    this.baseUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2021-02-02";

    this._quakes = [];
  }

  async getEarthquakesByRadius(position, radius = 100) {
    const query = `${this.baseUrl}&latitude=${position.lat}&longitude=${position.lon}&maxradiuskm=${radius}`;
    this._quakes = await getJSON(query);
    console.log(this._quakes);
    return this._quakes;
  }
}
