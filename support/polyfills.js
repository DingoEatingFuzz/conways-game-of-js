window.requestAnimationFrame = window.requestAnimationFrame || function(fn) {
  setTimeout(fn, 1000 / 30);
};
