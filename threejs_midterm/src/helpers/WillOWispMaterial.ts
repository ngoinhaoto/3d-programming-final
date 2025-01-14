import { ShaderMaterial, AdditiveBlending, Color } from "three";

/**
 * Options for the WillOWispMaterial constructor.
 */
interface WillOWispMaterialOptions {
  uTime?: number; // Time for animation
  uGlowRadius?: number; // Radius for glowing effect
  uColor?: Color; // Color for the Will o' the Wisp
}

/**
 * WillOWispMaterial class rendering Will o' the Wisp particles with customizable properties.
 */
export class WillOWispMaterial extends ShaderMaterial {
  constructor(options: WillOWispMaterialOptions = {}) {
    // Destructure options with default values
    const {
      uTime = 0,
      uGlowRadius = 0.3,
      uColor = new Color("#00ff00"),
    } = options;

    // Call the parent constructor
    super({
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false, // Ensure depth write is disabled for proper blending
      uniforms: {
        uTime: { value: uTime },
        uGlowRadius: { value: uGlowRadius },
        uColor: { value: uColor },
      },
      vertexShader: `uniform float uTime;
        attribute vec3 color; // Per-instance color
        varying vec2 vUv;
        varying vec3 vColor; // Pass color to fragment shader
        varying float vOffset;

        void main() {
          float displacementX = sin(uTime + float(gl_InstanceID) * 0.05) * 0.5;
          float displacementY = sin(uTime + float(gl_InstanceID) * 0.07) * 0.7;
          float displacementZ = sin(uTime + float(gl_InstanceID) * 0.09) * 0.5;

          vec2 rotatedPosition = vec2(
            cos(0.0) * position.x - sin(0.0) * position.y,
            sin(0.0) * position.x + cos(0.0) * position.y
          );

          vec4 finalPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          finalPosition.xy += rotatedPosition;

          finalPosition.x += displacementX;
          finalPosition.y += displacementY;
          finalPosition.z += displacementZ;

          gl_Position = projectionMatrix * finalPosition;

          vUv = uv;
          vColor = color; // Pass per-instance color
          vOffset = float(gl_InstanceID);
}`,
      fragmentShader: `varying vec2 vUv;
        varying vec3 vColor; // Received per-instance color
        uniform float uTime;
        uniform float uGlowRadius;
        varying float vOffset;

        void main() {
          float distance = length(vUv - 0.5);
          float glow = smoothstep(0.50, uGlowRadius, distance);
          float disk = smoothstep(uGlowRadius, uGlowRadius - 0.01, distance);

          float flash = sin(uTime * 2.0 + vOffset * 0.1) * 0.5 + 0.5;
          float alpha = clamp((glow + disk) * flash, 0.0, 1.0);

          vec3 glowColor = vColor * 3.0 * flash; // Use vColor for glow
          vec3 wispColor = vColor * 2.5;         // Use vColor for wisp

          vec3 finalColor = mix(glowColor, wispColor, disk);

          if (alpha < 0.01) discard;

          gl_FragColor = vec4(finalColor, alpha);
}
`,
    });
  }

  /**
   * Update time uniform for animation.
   * @param {number} time - The time to update the uniform with.
   */
  updateTime(time: number): void {
    this.uniforms.uTime.value = time;
  }

  /**
   * Set the Will o' the Wisp color uniform.
   * @param {Color} color - The color for the Will o' the Wisp.
   */
  setColor(color: Color): void {
    this.uniforms.uColor.value.copy(color);
  }

  /**
   * Set the glow radius uniform.
   * @param {number} radius - The glow radius for Will o' the Wisp.
   */
  setGlowRadius(radius: number): void {
    this.uniforms.uGlowRadius.value = radius;
  }
}
