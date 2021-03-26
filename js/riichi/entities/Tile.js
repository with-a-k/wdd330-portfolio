class Tile {
  constructor(suit, number, variant = '', visibility = 'closed') {
    this.suit = suit;
    this.number = number;
    this.variant = variant;
    this.visibility = visibility;
  }

  validate() {
    if (!(this.suit in ['m', 's', 'p', 'h'])) {
      console.log('Invalid tile suit: must be m, s, p, h');
      return false;
    }
    if (!(this.variant in ['', 'red'])) {
      console.log('Invalid variant: must be empty or red');
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
      if (this.variant === 'red' and this.number !== 5) {
        console.log('Only 5 tiles can be red');
        return false;
      }
    } else {
      if (!(this.number in ['E', 'S', 'W', 'N', 'H', 'G', 'R'])) {
        console.log('Invalid honor type: must be E, S, W, N, H, G, R');
      }
    }
  }
}
