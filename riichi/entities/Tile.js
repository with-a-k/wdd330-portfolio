export default class Tile {
  constructor(suit, number, variant = '', visibility = 'closed') {
    this.suit = suit;
    this.number = number;
    this.variant = variant;
    this.visibility = visibility;
    this.image = null;
    this.hint = null;
    this.container = null;
  }

  validate() {
    if (!(this.suit in ['m', 's', 'p', 'h'])) {
      console.log('Invalid tile suit: must be m, s, p, h');
      return false;
    }
    if (!(this.variant in ['', 'r'])) {
      console.log('Invalid variant: must be empty or r');
      return false;
    }
    if (this.suit !== 'h') {
      if (this.number < 1 || this.number > 9) {
        console.log('Tile number out of range: must be 1-9');
        return false;
      }
      if (Math.floor(this.number) !== this.number) {
        console.log('Tile number must be an integer');
        return false;
      }
      if (this.variant === 'red' && this.number !== 5) {
        console.log('Only 5 tiles can be red');
        return false;
      }
    } else {
      if (!(this.number in ['E', 'S', 'W', 'N', 'H', 'G', 'R'])) {
        console.log('Invalid honor type: must be E, S, W, N, H, G, R');
        return false;
      }
    }
  }

  display(target) {
    let assetURL, hintText;
    if (this.visibility === "closed") {
      assetURL = `./assets/tiles/nohint/closed.svg`;
    } else {
      assetURL = `./assets/tiles/nohint/${this.type()}.svg`;
    }
    if (this.visibility === "closed") {
      hintText = '';
    } else if (this.suit === 'h') {
      hintText = this.expandHonor();
    } else {
      hintText = `${this.variant === 'r' ? 'Red ' : ''}${this.number} of ${this.expandSuit()}`;
    }
    let tileHTML = document.createElement('div');
    let tileImage = document.createElement('img');
    tileImage.src = assetURL;
    if (this.image) {
      this.image.src = assetURL;
      this.hint.innerHTML = hintText;
      return;
    }
    tileImage.classList.add('tile-image');
    let tileHint = document.createElement('p');
    tileHint.classList.add('tile-hint');
    tileHint.innerHTML = hintText;
    tileHTML.appendChild(tileImage);
    tileHTML.appendChild(tileHint);
    if (!this.container) {
      this.container = target;
      this.container.appendChild(tileHTML);
    }
    this.image = tileImage;
    this.hint = tileHint;
  }

  expandHonor() {
    return {
      'E': 'East',
      'S': 'South',
      'W': 'West',
      'N': 'North',
      'H': 'White Dragon',
      'G': 'Green Dragon',
      'R': 'Red Dragon'
    }[this.number];
  }

  expandSuit() {
    return {
      'm': 'Chars.',
      's': 'Sticks',
      'p': 'Wheels'
    }[this.suit];
  }

  type() {
    return `${this.number}${this.suit}${this.variant}`;
  }

  open() {
    this.visibility = 'open';
    this.display();
  }

  close() {
    this.visibility = "closed";
    this.display();
  }
}
