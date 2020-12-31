export var fragment = `

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D image;
uniform sampler2D displacement;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main(){

  vec4 displace = texture2D(displacement, vUv);

  vec2 displacedUV = vec2(vUv.x + 0.1*sin(vUv.y*19. + time/4.), vUv.y);
  vec4 color = texture2D(image, displacedUV);
  

  
  gl_FragColor = color;
  

}
`;
