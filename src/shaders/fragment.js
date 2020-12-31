export var fragment = `

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D image;
uniform sampler2D text;
uniform sampler2D displacement;
uniform vec4 resolution;

varying vec2 vUv;
uniform vec3 mouse;
varying vec3 vPosition;
float PI = 3.141592653589793238;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(){

  vec4 displace = texture2D(displacement, vUv.yx);

  vec2 displacedUV = vec2(
    vUv.x , 
    vUv.y ) ;



    displacedUV.y = mix(vUv.y, displace.r, progress);



  vec4 color = texture2D(image, displacedUV);

  color.r = texture2D(image, displacedUV + vec2(0.,10.* 0.005)*progress).r;
  color.g = texture2D(image, displacedUV + vec2(0.,10.* 0.01)*progress).g;
  color.b = texture2D(image, displacedUV + vec2(0.,10.* 0.02)*progress).b;
  

  



  //====================



vec2 direction = normalize(vPosition.xy - mouse.xy);
  float dist = length(vPosition- mouse);

  float prox = 1. - map( dist, 0.,0.2,0.,1.);

  
vec2 zoomedUV = vUv + direction*prox*progress;
vec2 zoomedUV1 = mix(vUv, mouse.xy + vec2(0.5),prox*progress);
  vec4 textColor = texture2D(text,zoomedUV1);

  prox = clamp(prox, 0.,1.);
  gl_FragColor = textColor;
  //gl_FragColor = vec4(prox,prox,prox, 1.);
  //gl_FragColor = vec4(direction,0.,1.);
  

}
`;
