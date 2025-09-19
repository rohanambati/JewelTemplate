/// <reference types="vite/client" />
/// <reference types="@types/three" />

// This file provides type definitions for Three.js and other libraries
// that don't have their own type definitions

declare namespace JSX {
  interface IntrinsicElements {
    // Three.js elements
    group: any;
    mesh: any;
    torusGeometry: any;
    meshStandardMaterial: any;
    octahedronGeometry: any;
    ringGeometry: any;
    meshBasicMaterial: any;
    ambientLight: any;
    pointLight: any;
    // Add other Three.js elements as needed
  }
}
