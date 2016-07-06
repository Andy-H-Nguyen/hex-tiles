var HexGame = HexGame || {};

HexGame.GameState = {

  init: function() {

    this.TILE_W = 56;
    this.TILE_H = 64;
    this.MARGIN_X = 30;
    this.MARGIN_Y = 5;
  },
  create: function() {
    this.map = JSON.parse(this.game.cache.getText('map'));
    this.board = new HexGame.Board(this, this.map.grid);
    this.places = this.add.group();

    this.playerUnits = this.add.group();
    this.enemyUnits = this.add.group();

    this.initUnits();
    this.initPlaces();

    //run turn
    this.newTurn();
  },
  initUnits: function() {
    //load player units
    this.playerUnitsData = JSON.parse(this.game.cache.getText('playerUnits'));

    var unit;
    this.playerUnitsData.forEach(function(unitData){
      unit = new HexGame.Unit(this, unitData);

      //unit belongs to the player
      unit.isPlayer = true;

      this.playerUnits.add(unit);
    }, this);

    //load player units
    this.enemyUnitsData = JSON.parse(this.game.cache.getText('enemyUnits'));

    this.enemyUnitsData.forEach(function(unitData){
      unit = new HexGame.Unit(this, unitData);
      this.enemyUnits.add(unit);
    }, this);
  },
  clearSelection: function() {
    this.board.setAll('alpha', 1);

    //remove attached events from tiles
    this.board.forEach(function(tile){
      tile.events.onInputDown.removeAll();
    }, this);
  },
  newTurn: function(){
    //create an array to keep all alive units
    this.allUnits = [];

    this.playerUnits.forEachAlive(function(unit){
      this.allUnits.push(unit);
    }, this);

    this.enemyUnits.forEachAlive(function(unit){
      this.allUnits.push(unit);
    }, this);

    //randomize array
    this.shuffle(this.allUnits);

    //keep track of the index of the current moving unit
    this.currUnitIndex = 0;

    //prepare the next unit
    this.prepareNextUnit();
  },
  //shuffle array method from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript)
  shuffle: function(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  },
  prepareNextUnit: function(){
    //if there are units to move
    if(this.currUnitIndex < this.allUnits.length) {
      //grab unit
      var unit = this.allUnits[this.currUnitIndex];

      this.currUnitIndex++;

      if(unit.alive) {
        unit.playTurn();
      }
      else {
        this.prepareNextUnit();
      }
    }
    //do new turn
    else {
      this.newTurn();
    }
  },
  initPlaces: function(){
    //player home base
    var pos = this.board.getXYFromRowCol(this.map.playerBase.row, this.map.playerBase.col);
    this.playerBase = new Phaser.Sprite(this.game, pos.x, pos.y, this.map.playerBase.asset);
    this.playerBase.anchor.setTo(0.5);
    this.playerBase.row = this.map.playerBase.row;
    this.playerBase.col = this.map.playerBase.col;
    this.places.add(this.playerBase);

    //enemy home base
    var pos = this.board.getXYFromRowCol(this.map.enemyBase.row, this.map.enemyBase.col);
    this.enemyBase = new Phaser.Sprite(this.game, pos.x, pos.y, this.map.enemyBase.asset);
    this.enemyBase.anchor.setTo(0.5);
    this.enemyBase.row = this.map.enemyBase.row;
    this.enemyBase.col = this.map.enemyBase.col;
    this.places.add(this.enemyBase);
  },
  checkGameEnd: function() {
    var unit = this.allUnits[this.currUnitIndex - 1];

    //check if player won
    if(unit.isPlayer) {
      if(unit.row === this.enemyBase.row && unit.col === this.enemyBase.col) {
        console.log('you won!');
      }
    }
    else {
      if(unit.row === this.playerBase.row && unit.col === this.playerBase.col) {
        console.log('you lost!');
      }
    }
  }
};
