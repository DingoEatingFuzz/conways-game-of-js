"use strict"
class Player
  constructor: (@size, @gameCanvas, @gridCanvas) ->
    @isRunning = true
    @gameCtx = @gameCanvas.getContext('2d')
    @gridCtx = @gridCanvas.getContext('2d')

    @setup()
    @start()

  minGridSize: 3
  size: 10

  setup: ->
    @board = GameOfLife(
      Math.floor(@gameCanvas.width / @size),
      Math.floor(@gameCanvas.height / @size)
    )

    printLines(@gridCanvas, @size) if @size > @minGridSize

  reset: (size) ->
    @size = size
    @clear()
    @setup()

  start: ->
    @isRunning = true
    @step()

  stop: ->
    @isRunning = false

  step: ->
    @board.step()
    printBoard(@board, @gameCtx, @size)
    requestAnimationFrame(=> @step()) if @isRunning

  clear: ->
    @gameCtx.clearRect(0, 0, @gameCanvas.width, @gameCanvas.height)
    @gridCtx.clearRect(0, 0, @gridCanvas.width, @gridCanvas.height)

printBoard = (board, ctx, size) ->
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, board.width * size, board.height * size)
  ctx.fillStyle = '#09F'
  ctx.beginPath()
  for i in [0..board.cells.length]
    x = i % board.width
    y = Math.floor(i / board.width)
    ctx.fillRect(x * size, y * size, size, size) if board.cells[i]

printLines = (canvas, size) ->
  ctx = canvas.getContext('2d')
  ctx.strokeStyle = '#CCC'
  ctx.lineWidth   = 1
  ctx.beginPath()

  for i in (x * size - 0.5 for x in [0..canvas.width/size])
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvas.height)

  for i in (x * size - 0.5 for x in [0..canvas.height/size])
    ctx.moveTo(0, i)
    ctx.lineTo(canvas.width, i)

  ctx.stroke()
  ctx.closePath()

window.Player = Player
