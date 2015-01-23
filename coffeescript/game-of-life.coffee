"use strict"
window.GameOfLife = do ->

    seedGrid = (w, h, state) ->
        return if state? then state[..] else ( Math.round(Math.random()) for x in [1..(w * h)] )

    return (w, h, state) ->
        _cells = []

        game =
            cells:  seedGrid(w, h, state)
            width:  w
            height: h
            top:    (pos) -> pos <  @width
            bottom: (pos) -> pos >= @width * (@height - 1)
            left:   (pos) -> pos %  @width is 0
            right:  (pos) -> pos %  @width is @width - 1

            step: (num = 1) ->
                for iter in [1..num]
                    buffer = @cells[..]
                    for cell, i in @cells
                        alive = @at(i).neighbors().alive()
                        buffer[i] = if cell then +(4 > alive > 1) else +(alive is 3)
                    @cells = buffer

            at: (idx) ->
                grid = this
                pos = idx

                return _cells[pos] if _cells[pos]

                cell =
                    state:  @cells[pos]
                    neighbors: ->
                        n = [ 1, 1, 1, 1, 0, 1, 1, 1, 1 ]

                        n[0] = n[1] = n[2] = 0 if grid.top(pos)
                        n[6] = n[7] = n[8] = 0 if grid.bottom(pos)
                        n[0] = n[3] = n[6] = 0 if grid.left(pos)
                        n[2] = n[5] = n[8] = 0 if grid.right(pos)

                        adjacent = []
                        for neighbor, i in n
                            if neighbor
                                offset = i - 4
                                cellIndex =
                                    if offset < -1     then grid.width * -1 + (offset + 3) + pos
                                    else if offset > 1 then grid.width      - (3 - offset) + pos
                                    else                    offset + pos
                                adjacent.push cellIndex

                        adjacent.alive = ->
                            total = 0
                            for neighbor in this
                                total += grid.cells[neighbor]
                            return total

                        @neighbors = -> adjacent
                        return adjacent
                _cells[pos] = cell
                if _cells.length is @width * @height then @at = (idx) -> _cells[idx]
                return cell
        return game
