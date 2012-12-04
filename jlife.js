JLife = (function() {

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
            at: function(x, y) {
                var grid      = this;
                var pos       = y ? grid.width*y + x : x;

                if (_cells[pos]) return _cells[pos];

                var _adjacent = [];
                var cell = {
                    state:     grid.cells[pos],
                    top:       function() { return pos <  grid.width; },
                    bottom:    function() { return pos >= grid.width * (grid.height - 1); },
                    left:      function() { return pos %  grid.width === 0; },
                    right:     function() { return pos %  grid.width === grid.width - 1; },
                    neighbors: function() {
                        if (_adjacent.length) return _adjacent;

                        var n = [ 1, 1, 1, 1, 0, 1, 1, 1, 1 ];

                        if (this.top())    n[0] = n[1] = n[2] = 0;
                        if (this.bottom()) n[6] = n[7] = n[8] = 0;
                        if (this.left())   n[0] = n[3] = n[6] = 0;
                        if (this.right())  n[2] = n[5] = n[8] = 0;

                        var adjacent = [];
                        for (var i = 0, len = n.length; i < len; ++i) {
                            if (n[i]) {
                                var offset = i - 4;
                                var cellVal =
                                      offset < -1 ? grid.width * -1 - (offset + 3) + pos
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

                        _adjacent = adjacent;
                        return adjacent;
                    }
                }
                _cells[pos] = cell;
                return cell;
            }
        };
    };

})();