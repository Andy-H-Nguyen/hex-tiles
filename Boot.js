var HexGame = HexGame || {};

//setting game configuration and loading the assets for the loading screen
HexGame.BootState = {
  init: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('bar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    this.state.start('Preload');
  }
};