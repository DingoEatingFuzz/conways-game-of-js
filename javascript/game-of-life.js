GameOfLife = (function() {
    "use strict";
    function seedGrid(w, h, state) {
        if (state) return state.slice(0);

        var grid = [];
        for (var i = 0, len = w * h; i < len; ++i) {
            grid.push(Math.round(Math.random()));
        }
        return grid;
    }

    return function(w, h, state) {
        var _cells = [];

        return {
            cells: seedGrid(w, h, state),
            width: w,
            height: h,
            top:    function(pos) { return pos <  this.width; },
            bottom: function(pos) { return pos >= this.width * (this.height - 1); },
            left:   function(pos) { return pos %  this.width === 0; },
            right:  function(pos) { return pos %  this.width === this.width - 1; },
            step: function(num) {
                num = num || 1;
                for (var i = 0; i < num; ++i) {
                    var buffer = this.cells.slice(0);
                    for (var j = 0, len = this.cells.length; j < len; ++j) {
                        var on = this.at(j).neighbors().on();
                        buffer[j] = this.cells[j]
                            ? +(on > 1 && on < 4)
                            : +(on === 3)
                        ;
                    }
                    this.cells = buffer;
                }
            },
            at: function(idx) {
                var grid = this;
                var pos  = idx;grid

                if (_cells[pos]) return _cells[pos];

                var cell = {
                    state:     grid.cells[pos],
                    neighbors: function() {
                        var n = [ 1, 1, 1, 1, 0, 1, 1, 1, 1 ];

                        if (grid.top(pos))    n[0] = n[1] = n[2] = 0;
                        if (grid.bottom(pos)) n[6] = n[7] = n[8] = 0;
                        if (grid.left(pos))   n[0] = n[3] = n[6] = 0;
                        if (grid.right(pos))  n[2] = n[5] = n[8] = 0;

                        var adjacent = [];
                        for (var i = 0, len = n.length; i < len; ++i) {
                            if (n[i]) {
                                var offset = i - 4;
                                var cellVal =
                                      offset < -1 ? grid.width * -1 + (offset + 3) + pos
                                    : offset >  1 ? grid.width      - (3 - offset) + pos
                                    :               offset + pos
                                ;
                                adjacent.push(cellVal);
                            }
                        }

                        adjacent.on = function() {
                            var total = 0;
                            for (var i = 0, len = this.length; i < len; ++i) {
                                total += grid.cells[this[i]];
                            }
                            return total;
                        };

                        this.neighbors = function() { return adjacent; }
                        return adjacent;
                    }
                }
                _cells[pos] = cell;
                if (_cells.length === this.width * this.height) {
                    this.at = function(idx) {
                        return _cells[idx];
                    }
                }
                return cell;
            }
        };
    };

})();
