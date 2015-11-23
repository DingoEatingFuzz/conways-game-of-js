Player = (function() {
  var Player = function(size, gameCanvas) {
    this.isRunning = true;

    this.size = size;
    this.gameCanvas = gameCanvas;

    this.setup();
    this.start();
  };

  Player.prototype = {
    minGridSize: 3,
    size: 10,
    setup: function() {
      var w = Math.floor(this.gameCanvas.width / this.size), h = Math.floor(this.gameCanvas.height / this.size);
      this.gameCanvas.width = Math.floor(this.gameCanvas.width / w) * w;
      this.gameCanvas.height = Math.floor(this.gameCanvas.height / h) * h;
      this.rainbow = generateRainbow(1000, 2, 0.3);
      this.noise = generatePerlinNoise(w, h, { octaveCount: 6 });
      this.board = GameOfLife(w, h, this.gameCanvas, this.noise.map(function(cell) { return cell > 0.4 && Math.random() > 0.6 }));
      // this.board = GameOfLife(w, h, this.gameCanvas);

      if (this.size > this.minGridSize) {
        printLines(this.gameCanvas, this.size);
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
      this.board.draw();
      if (this.isRunning) {
        requestAnimationFrame(this.step.bind(this));
      }
    },
    clear: function() {
      // this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
    }
  }

  return Player;

  function printLines(canvas, size) {
    var igloo = new Igloo(canvas);
    var gl = igloo.gl;
    var quad = igloo.array(Igloo.QUAD2);

    gl.viewport(0, 0, canvas.width, canvas.height);
    console.log(size);
    igloo.program('glsl/quad.vert', 'glsl/gridlines.frag').use()
      .attrib('quad', quad, 2)
      .uniform('scale', size)
      .draw(gl.TRIANGLE_STRIP, 4);
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
