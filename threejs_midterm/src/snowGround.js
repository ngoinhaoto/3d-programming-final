import * as THREE from "three";

const noise = new SimplexNoise();

export const createGroundPlane = (scene) => {
  const geometry = new THREE.PlaneGeometry(400, 400); // Create a large plane
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color for snow ground
    roughness: 1.0,
    metalness: 0.0,
  });
  const plane = new THREE.Mesh(geometry, material);

  plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat
  plane.position.set(0, 0.5, 0); // Position it at the origin
  plane.receiveShadow = true; // Allow the plane to receive shadows
  scene.add(plane);
};

// export const makeRoughGround = (mesh) => {
//   const time = Date.now();
//   const positions = mesh.geometry.attributes.position.array;

//   for (let i = 0; i < positions.length; i += 3) {
//     const noise1 =
//       noise.noise2D(
//         positions[i] * 0.01 + time * 0.0003, // Slow snow rise
//         positions[i + 1] * 0.01 + time * 0.0001, // Slow snow rise
//       ) * 5;
//     const noise2 =
//       noise.noise2D(
//         positions[i] * 0.02 + time * 0.00004, // Slow snow rise
//         positions[i + 1] * 0.02 + time * 0.00006, // Slow snow rise
//       ) * 4;
//     const noise3 =
//       noise.noise2D(
//         positions[i] * 0.009 + time * 0.00006, // Slow snow rise
//         positions[i + 1] * 0.012 + time * 0.00004, // Slow snow rise
//       ) * 4;
//     const distance = noise1 + noise2 + noise3;
//     positions[i + 2] = distance; // Update the z position for roughness
//   }

//   mesh.geometry.attributes.position.needsUpdate = true;
// };
export const makeRoughGround = (mesh) => {
  const time = Date.now();
  const positions = mesh.geometry.attributes.position.array; // Access position attribute
  const normals = mesh.geometry.attributes.normal.array; // Access normal attribute if available

  // Loop through the positions array (every 3 values represent a vertex)
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];

    // Generate noise based on the x and y values
    const noise1 =
      noise.noise2D(x * 0.01 + time * 0.0003, y * 0.01 + time * 0.0003) * 5;
    const noise2 =
      noise.noise2D(x * 0.02 + time * 0.00012, y * 0.02 + time * 0.00015) * 4;
    const noise3 =
      noise.noise2D(x * 0.009 + time * 0.00015, y * 0.012 + time * 0.00009) * 4;
    const distance = noise1 + noise2 + noise3;

    // Modify the z position for roughness
    positions[i + 2] = distance;

    // Optionally modify normals based on the new position to keep lighting consistent
    // (this step can be skipped if you are relying on Three.js to handle normals)
    // For example, you can recalculate the normal vector if needed
    if (normals) {
      const normalIndex = i; // This assumes that positions and normals are in the same order
      // Simple recalculation of normals can be done here if required
      // Use your method to update the normals based on the new vertex positions
    }
  }

  mesh.geometry.attributes.position.needsUpdate = true;

  // Recompute vertex normals (you don't need to use computeFaceNormals here)
  mesh.geometry.computeVertexNormals();
};
