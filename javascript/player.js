Player = (function() {
  var Player = function(size, gameCanvas, gridCanvas) {
    this.isRunning = true;

    this.size = size;
    this.gameCanvas = gameCanvas;
    this.gridCanvas = gridCanvas;
    this.gameCtx = gameCanvas.getContext('2d');
    this.gridCtx = gridCanvas.getContext('2d');

    this.setup();
    this.start();
  };

  Player.prototype = {
    minGridSize: 3,
    size: 10,
    setup: function() {
      this.rainbow = generateRainbow(1000, 2, 0.3);
      this.board = GameOfLife(
        Math.floor(this.gameCanvas.width / this.size),
        Math.floor(this.gameCanvas.height / this.size)
      );

      this.noise = generatePerlinNoise(this.board.width, this.board.height, {
        octaveCount: 6
      });

      if (this.size > this.minGridSize) {
        printLines(this.gridCanvas, this.size);
      }
    },
    reset: function(size) {
      this.size = size;

      this.clear();
      this.setup();
    },
    start: function() {
      this.isRunning = true;
      this.step();
    },
    stop: function() {
      this.isRunning = false;
    },
    step: function() {
      this.board.step();
      printBoard(this.board, this.gameCtx, this.size, this.noise, this.rainbow);
      if (this.isRunning) {
        requestAnimationFrame(this.step.bind(this));
      }
    },
    clear: function() {
      this.gameCtx
        .clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

      this.gridCtx
        .clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
    }
  }

  return Player;

  function printBoard(board, ctx, size, noise, rainbow) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, board.width * size, board.height * size);
    ctx.beginPath();
    var rainbowLength = rainbow.length - 1, color, x, y;
    for (var i = 0, len = board.cells.length; i < len; ++i) {
      x = i % board.width, y = Math.floor(i / board.width);
      if (board.cells[i]) {
        color = rainbow[Math.round(noise[board.width * y + x] * rainbowLength)];
        ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }

  function printLines(canvas, size) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    for (var i = -0.5, len = canvas.width; i <= len; i += size) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
    }
    for (i = -0.5, len = canvas.height; i <= len; i += size) {
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    ctx.closePath();
  }

  function generateRainbow(length, numBands, shiftPct) {
    var rainbow = [], frequency = 5 / length * numBands;
    var shiftPi = shiftPct * Math.PI * 2;
    for(var i = 0; i < length; i++) {
      rainbow.push([
        (Math.sin(frequency * i + shiftPi) * 128 + 128).toFixed(0),
        (Math.sin(frequency * i + Math.PI / 2 + shiftPi) * 128 + 128).toFixed(0),
        (Math.sin(frequency * i + Math.PI + shiftPi) * 128 + 128).toFixed(0)
      ]);
    }
    return rainbow;
  }
})();
