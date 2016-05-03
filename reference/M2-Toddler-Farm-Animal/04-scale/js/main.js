//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('chicken', 'assets/images/chicken.png');
    this.load.image('horse', 'assets/images/horse.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('sheep', 'assets/images/sheep3.png');
    
  },
  //executed after everything is loaded
  create: function() {
    
    //create a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background');
    
    //center of the world
    this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'chicken');
    
    //place a sprite by it's center, not the top-left corner
    this.chicken.anchor.setTo(0.5, 0.5); // or just this.chicken.anchor.setTo(0.5)

    this.chicken.scale.setTo(2, 1);

    this.horse = this.game.add.sprite(120, 10, 'horse');
    this.horse.scale.setTo(0.5);
  },
  //this is executed multiple times per second
  update: function() {
  },
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');