var HexGame = HexGame || {};

HexGame.Unit = function(state, data) {
  var position = state.board.getXYFromRowCol(data.row, data.col);

  Phaser.Sprite.call(this, state.game, position.x, position.y, data.asset);

  this.game = state.game;
  this.state = state;
  this.board = state.board;
  this.row = data.row;
  this.col = data.col;
  this.data = data;

  this.anchor.setTo(0.5);

  //this.inputEnabled = true;
  //this.input.pixelPerfectClick = true;
  //this.events.onInputDown.add(this.showMovementOptions, this);
};

HexGame.Unit.prototype = Object.create(Phaser.Sprite.prototype);
HexGame.Unit.prototype.constructor = HexGame.Unit;

HexGame.Unit.prototype.showMovementOptions = function(){

  this.state.clearSelection();

  //only if the UI is free
  if(this.state.uiBlocked) {
    return;
  }

  //get current tile
  var currTile = this.board.getFromRowCol(this.row, this.col);

  //get the adjacent cells
  var adjacentCells = this.board.getAdjacent(currTile, true);

  adjacentCells.forEach(function(tile){
    tile.alpha = 0.7;

    //add input
    tile.events.onInputDown.add(this.moveUnit, this);
  }, this);
};

HexGame.Unit.prototype.moveUnit = function(tile){
  this.state.clearSelection();

  this.state.uiBlocked = true;

  //target position
  var pos = this.board.getXYFromRowCol(tile.row, tile.col);

  var unitMovement = this.game.add.tween(this);

  unitMovement.to(pos, 200);
  unitMovement.onComplete.add(function(){
    this.state.uiBlocked = false;
    this.row = tile.row;
    this.col = tile.col;

    //check for battles
    this.checkBattle();

    //check for game ending
    this.state.checkGameEnd();

    //prepare the next unit
    this.state.prepareNextUnit();

  }, this);
  unitMovement.start();
};

HexGame.Unit.prototype.attack = function(attacked) {
  var attacker = this;

  //both units attack each other
  var damageAttacked = Math.max(0, attacker.data.attack * Math.random() - attacked.data.defense * Math.random());
  var damageAttacker = Math.max(0, attacked.data.attack * Math.random() - attacker.data.defense * Math.random());

  attacked.data.health -= damageAttacked;
  attacker.data.health -= damageAttacker;

  if(attacked.data.health <= 0) {
    attacked.kill();
  }

  if(attacker.data.health <= 0) {
    attacker.kill();
  }
};

HexGame.Unit.prototype.checkBattle = function() {
  //get rival army
  var rivalUnits = this.isPlayer ? this.state.enemyUnits : this.state.playerUnits;
  var fightUnit;

  //check rival army units to find a match
  rivalUnits.forEachAlive(function(unit){
    if(this.row === unit.row && this.col === unit.col) {
      console.log('both are in the same cell! -- fight!!!');
      fightUnit = unit;
    }
  }, this);

  //fight until death
  if(fightUnit) {
    while(this.data.health >= 0 && fightUnit.data.health >= 0) {
      this.attack(fightUnit);
    }
    console.log('battle end');
  }
};

HexGame.Unit.prototype.playTurn = function() {
  if(this.isPlayer) {
    this.showMovementOptions();
  }
  else {
    this.aiEnemyMovement();
  }
};

HexGame.Unit.prototype.aiEnemyMovement = function() {
  //clear previous selection
  this.state.clearSelection();

  //get the current tile
  var currTile = this.board.getFromRowCol(this.row, this.col);

  //get the adjacent cells
  var adjacentCells = this.board.getAdjacent(currTile, true);

  //target tile
  var targetTile;

  //go through each adjacent cell and find a rival
  adjacentCells.forEach(function(tile){
    //find out if there is a rival in there
    this.state.playerUnits.forEachAlive(function(unit){
      if(tile.row === unit.row && tile.col === unit.col) {
        console.log('we have found a rival to attack');
        targetTile = tile;
      }
    }, this);
  }, this);

  //if you didnt find a rival, then move randomly
  if(!targetTile) {
    var randomIndex = Math.floor(Math.random() * adjacentCells.length);
    targetTile = adjacentCells[randomIndex];
  }

  //move to the target
  this.moveUnit(targetTile);
};