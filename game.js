function Enemy(x, y) { 
  this.x = x;
  this.y = y;
  this.width = 10;
  this.height = 6;
  this.direction = 1;
}

Enemy.prototype.update = function() {
  if (this.x <= 0 || this.x + this.width >= game.gameFieldWidth()) {
    return true;
  }
  return false;
}

Enemy.prototype.advance = function() {
  this.direction *= -1;
  this.y += 10;
  if (this.y + this.height >= game.gameFieldHeight()) {
    return true
  }
  return false
}

Enemy.prototype.clear = function() {
  console.log("clear");
  var canvas = document.getElementById("game-layer");
  var context = canvas.getContext("2d");
  context.clearRect(this.x, this.y, this.width, this.height);
}

// Renderer object
var renderer = (function () {
  function _drawEnemy(context, enemy) {
    context.fillStyle = "red";
    context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  function _drawPlayer(context, player) {
    context.fillStyle = "blue";
    context.fillRect(player.x, player.y, player.width, player.height);
  }

  function _render() {
    var canvas = document.getElementById("game-layer");
    var context = canvas.getContext("2d");
    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var entity, entities = game.entities();
    for (var i = 0; i < game.rows(); i++) {
      for (var j = 0; j < game.cols(); j++) {
        entity = entities[i][j];
        if(entity instanceof Enemy) {
          _drawEnemy(context, entity);
        } else if(entity instanceof Player) {
          _drawPlayer(context, entity);
        }
      }
    }
  }
  
  return {
    render: _render
  };
})();

// Physics Object
var physics = (function() {
  function _update() {
    var entities = game.entities();
    for (var i = 0; i < game.rows(); i++) {
      for (var j = 0; j < game.cols(); j++) {
        entities[i][j].x += entities[i][j].direction;  
      }
    }
  }

  return { update: _update };
})();

var game = (function() {
  var _gameFieldHeight = 200;
  var _gameFieldWidth = 200;
  var _entities = [];
  var leftLimit = 0;
  var rightLimit = 200;
  var _rows = 5;
  var _cols = 8;

  function _start() {
    for (var m = 0; m < _rows; m++) {
      entity_row  = []
      for (var n = 0; n < _cols; n++) {
        entity_row.push(new Enemy(5 + (15 * n), 5 + (11 * m)));
      }
      _entities.push(entity_row);
    }
    console.log(_entities);
    window.requestAnimationFrame(this.update.bind(this));
  }

  function _update() {
    physics.update();
    var setReverse = false;
    for (var m = 0; m < _rows; m++) {
      for (var n = 0; n < _cols; n++) {
        if (_entities[m][n].update()) {
          setReverse = true;
          break;
        }
      }
    }
    if (setReverse) {
      for (var m = 0; m < _rows; m++) {
        for (var n = 0; n < _cols; n++) {
          if (_entities[m][n].advance()) {
            _endgame();
            return;
          }
        }
      }
    }
    renderer.render();
    window.requestAnimationFrame(this.update.bind(this));
  }

  function _endgame() {
    console.log("??????????????");
    for (var m = 0; m < _rows; m++) {
      for (var n = 0; n < _cols; n++) {
        _entities[m][n].clear();
      }
    }
    var canvas = document.getElementById("game-layer");
    var context = canvas.getContext("2d");
    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width/2, canvas.height/2);
    // var go = document.createElement("div");
    // go.style.text
    // go.style.textAlign = "center";
    // go.style.position = "absolute";
    // go.style.bottom = "100px";
    // go.innerHTML = "Game Over";
    // go.style.width = "100%";
    // context.appendChild(go);
  }

  return {
    gameFieldHeight: function() { return _gameFieldHeight; },
    gameFieldWidth: function() { return _gameFieldWidth; },
    update: _update,
    start: _start,
    entities: function() { return _entities; },
    rows: function() { return _rows; },
    cols: function() { return _cols; }
  }
})();

game.start();