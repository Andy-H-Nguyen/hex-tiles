var HexGame = HexGame || {};

HexGame.game = new Phaser.Game(640, 360, Phaser.AUTO);

HexGame.game.state.add('Boot', HexGame.BootState);
HexGame.game.state.add('Preload', HexGame.PreloadState);
HexGame.game.state.add('Game', HexGame.GameState);

HexGame.game.state.start('Boot');
