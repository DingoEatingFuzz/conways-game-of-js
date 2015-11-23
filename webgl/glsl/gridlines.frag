#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D state;
uniform vec2 gameScale;
uniform float scale;

void main() {
  float xr = floor(gl_FragCoord.x) / floor(scale);
  float yr = floor(gl_FragCoord.y) / floor(scale);

  if (abs(xr - floor(xr)) < 0.05 || abs(yr - floor(yr)) < 0.05) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.3);
  } else {
    gl_FragColor = texture2D(state, gl_FragCoord.xy / gameScale);
  }
}
