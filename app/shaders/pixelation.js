export const vertex = /*glsl*/`
   varying vec2 vUv;
   void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
   }
`

export const fragment = /*glsl */`
   varying vec2 vUv;
   uniform sampler2D u_texture;
   uniform vec2 u_mouse;
   uniform vec2 u_prevMouse;
   uniform float u_aberrationIntensity;

   void main() {
      vec2 gridUv = floor(vUv * vec2(40.,40.)) / vec2(40.,40.);
      vec2 centerOfPixel = gridUv + vec2(1./40., 1./40.); 

      vec2 mouseDirection = u_mouse - u_prevMouse;

      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.3,0.,pixelDistanceToMouse);

      vec2 uvOffset = strength * - mouseDirection * 0.3;
      vec2 uv = vUv - uvOffset;

      vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
      vec4 colorG = texture2D(u_texture, uv);
      vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

      gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
   }
`

