/**
 * Aura Fluid / Liquid Mesh Gradient - Original Light Theme
 * Soft and subtle background effect using White, Indigo, and Rose hues.
 */

const vertexShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform vec2 uMouse;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      vec3 g = a0.xyw * x0.x + a0.yzw * x0.y;
      vec3 t = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 r = vec3(0.0);
      r.x = g.x * t.x;
      r.y = g.y * t.y;
      r.z = g.z * t.z;
      return 130.0 * dot(m, r);
    }

    void main() {
        vUv = uv;
        float time = uTime * 0.05; // Even slower motion
        
        float d = snoise(uv * 1.0 + time + uMouse * 0.05);
        d += snoise(uv * 2.0 - time * 0.3) * 0.5;
        
        vDisplacement = d;
        
        vec3 displacedPosition = position;
        displacedPosition.z += d * 0.2; // Subtle depth
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform vec3 uColor1; // White
    uniform vec3 uColor2; // Soft Indigo
    uniform vec3 uColor3; // Soft Rose
    uniform vec3 uColor4; // Soft Off-white

    void main() {
        vec2 uv = vUv;
        float d = vDisplacement;
        
        // Soft blending of pastels
        vec3 color = mix(uColor4, uColor2, smoothstep(-1.2, 1.2, d));
        color = mix(color, uColor3, smoothstep(0.0, 1.5, d));
        color = mix(color, uColor1, smoothstep(0.5, 2.0, d));
        
        // Very subtle highlight on peaks
        float spec = smoothstep(0.8, 1.5, d);
        color += vec3(1.0) * spec * 0.1;
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

class AuraBackgroundLight {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 3.5; // Wider view
        
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        
        this.init();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        const geometry = new THREE.PlaneGeometry(10, 8, 64, 64);
        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uColor1: { value: new THREE.Color(0xffffff) }, // Pure White
            uColor2: { value: new THREE.Color(0xeef2ff) }, // Soft Indigo
            uColor3: { value: new THREE.Color(0xfff1f2) }, // Soft Rose
            uColor4: { value: new THREE.Color(0xf8fafc) }  // Soft Off-white
        };
        
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            side: THREE.DoubleSide,
            transparent: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -0.2; // Very subtle tilt
        this.scene.add(this.mesh);
        
        this.onResize();
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.uniforms.uResolution.value.set(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.uniforms.uTime.value += 0.02; // Very slow
        
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.02;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.02;
        this.uniforms.uMouse.value.copy(this.mouse);
        
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuraBackgroundLight();
});
