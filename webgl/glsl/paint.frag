#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D state;
uniform vec2 scale;
uniform float ratio;
uniform bool showLines;
uniform float seed;

const float PI_2 = 6.283185307;
const float PI = 3.1415926535897932384626433832795;
const float PI_1_2 = 1.57079632679489661923;

//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P, float s)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz + vec4(s);
  vec4 iy = Pi.yyww + vec4(s);
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

vec4 rainbow(float s, float numBands, float shiftPct) {
  float shiftPi = shiftPct * PI_2;
  float i = s * numBands * PI;
  return vec4(
    sin(i + shiftPi) * 0.5 + 0.5,
    sin(i + PI_1_2 + shiftPi) * 0.5 + 0.5,
    sin(i + PI + shiftPi) * 0.5 + 0.5,
    1.0
  );
}

void main() {
  vec4 color = texture2D(state, gl_FragCoord.xy / scale);
  vec2 pxSize = vec2(ratio, ratio);
  bool showHorizontalLine = mod(floor(gl_FragCoord.y) / ratio, 1.0) < 0.01;
  bool showVerticalLine = mod(floor(gl_FragCoord.x) / ratio, 1.0) < 0.01;
  bool linePixel = showLines && (showHorizontalLine || showVerticalLine);

  if (linePixel && color.r == 1.0) {
    float n = cnoise(floor(gl_FragCoord.xy / pxSize) * pxSize / scale * 5.0, seed);
    vec4 r = rainbow(n, 1.0, 0.0);
    gl_FragColor = vec4(r.x * 0.9, r.y * 0.9, r.z * 0.9, 1.0);
  } else if (linePixel){
    gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
  } else if (color.r == 1.0) {
    float n = cnoise(floor(gl_FragCoord.xy / pxSize) * pxSize / scale * 5.0, seed);
    gl_FragColor = rainbow(n, 1.0, 0.0);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
