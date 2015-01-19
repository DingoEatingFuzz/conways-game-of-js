FPS = (function() {
  var FPS = function(onupdate) {
    this.onupdate = onupdate || function() {};
    this.isRunning = true;
    this.prev = performance.now();

    this.tick();
  };

  FPS.prototype = {
    start: function() {
      this.isRunning = true;
      tick(this);
    },
    stop: function() {
      this.isRunning = false;
    },
    toggle: function() {
      this.isRunning ? this.stop() : this.start();
    },
    tick: function() {
      this.current = performance.now();
      this.fps = 1000 / (this.current - this.prev);
      this.prev = this.current;

      this.onupdate(this.fps);

      if (this.isRunning) {
        requestAnimationFrame(this.tick.bind(this));
      }
    }
  }

  return FPS;
})();
