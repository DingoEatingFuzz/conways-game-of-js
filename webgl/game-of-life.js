GameOfLife = (function() {
  "use strict";

  function seedGrid(w, h, gl, textures, state) {
    var grid = state ? Uint8Array.from(state) : new Uint8Array(w * h);
    if (!state) {
      for (var i = 0, len = w * h; i < len; i++) {
        grid[i] = Math.random() > 0.3 ? 1 : 0;
      }
    }

    var rgba = new Uint8Array(w * h * 4);
    for (i = 0, len = grid.length; i < len; i++) {
      var ii = i * 4;
      rgba[ii + 0] = rgba[ii + 1] = rgba[ii + 2] = grid[i] ? 255 : 0;
      rgba[ii + 3] = 255;
    }

    textures.front.subset(rgba, 0, 0, w, h);
  }

  return function(w, h, canvas, state) {
    var igloo = new Igloo(canvas);
    var gl = igloo.gl;
    var cw = canvas.width;
    var ch = canvas.height;
    var textures = {
      front: igloo.texture(null, gl.RGBA, gl.CLAMP_TO_EDGE, gl.NEAREST).blank(w, h),
      back:  igloo.texture(null, gl.RGBA, gl.CLAMP_TO_EDGE, gl.NEAREST).blank(w, h)
    };

    seedGrid(w, h, igloo.gl, textures, state);

    return {
      igloo: igloo,
      width: w,
      height: h,
      viewsize: new Float32Array([ cw, ch ]),
      statesize: new Float32Array([ w, h ]),
      seed: Math.random()*50,
      programs: {
        paint: igloo.program('glsl/quad.vert', 'glsl/paint.frag'),
        gol:  igloo.program('glsl/quad.vert', 'glsl/gol.frag'),
        gridlines:  igloo.program('glsl/quad.vert', 'glsl/gridlines.frag')
      },
      buffers: {
        quad: igloo.array(Igloo.QUAD2)
      },
      textures: textures,
      framebuffers: {
        step: igloo.framebuffer()
      },
      swap: function() {
        var tmp = this.textures.front;
        this.textures.front = this.textures.back;
        this.textures.back = tmp;
      },
      step: function(num) {
        num = num || 1;
        var gl = this.igloo.gl;

        for (var i = 0; i < num; i++) {
          this.framebuffers.step.attach(this.textures.back);
          this.textures.front.bind(0);
          gl.viewport(0, 0, this.width, this.height);
          this.programs.gol.use()
            .attrib('quad', this.buffers.quad, 2)
            .uniformi('state', 0)
            .uniform('scale', this.statesize)
            .draw(gl.TRIANGLE_STRIP, 4);
          this.swap();
        }
      },
      draw: function() {
        var gl = this.igloo.gl;
        this.igloo.defaultFramebuffer.bind();
        this.textures.front.bind(0);
        gl.viewport(0, 0, this.viewsize[0], this.viewsize[1]);
        this.programs.paint.use()
          .attrib('quad', this.buffers.quad, 2)
          .uniformi('state', 0)
          .uniform('scale', this.viewsize)
          .uniform('ratio', this.viewsize[0] / this.statesize[0])
          .uniform('seed', this.seed)
          .uniform('showLines', this.viewsize[0] / this.statesize[0] > 5)
          .draw(gl.TRIANGLE_STRIP, 4);
      }
    }
  }
})();
