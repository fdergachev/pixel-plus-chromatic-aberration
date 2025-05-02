import React, { useRef, useMemo, useEffect } from 'react';
import { vertex, fragment } from "../shaders/pixelation"
import { useFrame } from '@react-three/fiber';
import { createTextTexture } from '../utils/textToTexture';
import * as THREE from "three"



const PixelationMesh = (props: { container: React.RefObject<HTMLDivElement | null> }) => {
   const meshRef = useRef<any>(null);

   let easeFactor = 0.02;
   const rect = useRef<DOMRect | null>(null)

   let mousePosition = { x: 0.5, y: 0.5 }
   let targetMousePosition = { x: 0.5, y: 0.5 };
   let previousPosition = { x: 0.5, y: 0.5 };
   let aberrationIntensity = 0.0;

   const uniforms = useMemo(() => ({
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_prevMouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: createTextTexture("polaroid", "ClashDisplay-Medium", null, "#ffffff", "500") },
      u_aberrationIntensity: { type: "f", value: 0.0 }
   }), [])

   useEffect(() => {
      props.container.current?.addEventListener("mouseenter", handleMouseEnter)
      props.container.current?.addEventListener("mousemove", handleMouseMove)
      props.container.current?.addEventListener("mouseleave", handleMouseLeave)
      window.addEventListener("resize", handleResize, false);

      document.fonts.ready.then(() => {
         reloadTexture();
      });

      return () => {
         props.container.current?.removeEventListener("mouseenter", handleMouseEnter)
         props.container.current?.removeEventListener("mousemove", handleMouseMove)
         props.container.current?.removeEventListener("mouseleave", handleMouseLeave)
         window.removeEventListener("resize", handleResize, false)
      }
   }, [])
   useEffect(() => {
      if (props.container.current) {
         rect.current = props.container.current?.getBoundingClientRect()
      }
   }, [props.container.current])

   useFrame(() => {
      mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
      mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;


      if (meshRef.current) {
         meshRef.current.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
         meshRef.current.material.uniforms.u_prevMouse.value.set(previousPosition.x, 1.0 - previousPosition.y);

         aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);

         meshRef.current.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;
      }
   })

   function reloadTexture() {
      const newTexture = createTextTexture("polaroid", "ClashDisplay-Medium", null, "#ffffff", "500")

      if (meshRef.current) {
         meshRef.current.material.uniforms.u_texture.value = newTexture;
         meshRef.current.material.uniforms.u_texture.value.needsUpdate = true;
      }
   }

   function handleMouseMove(event: MouseEvent) {
      easeFactor = 0.04;
      previousPosition = { ...targetMousePosition }

      targetMousePosition.x = (event.clientX - rect.current!.left) / rect.current!.width
      targetMousePosition.y = (event.clientY - rect.current!.top) / rect.current!.height

      aberrationIntensity = 1;
   }

   function handleMouseEnter(event: MouseEvent) {
      easeFactor = 0.02;
      mousePosition.x = targetMousePosition.x = (event.clientX - rect.current!.left) / rect.current!.width
      mousePosition.y = targetMousePosition.y = (event.clientY - rect.current!.top) / rect.current!.height
   }

   function handleMouseLeave(event: MouseEvent) {
      easeFactor = 0.02;
      targetMousePosition = { ...previousPosition }
   }

   function handleResize() {
      if (props.container.current) {
         rect.current = props.container.current?.getBoundingClientRect()
      }
   }


   return (
      <mesh ref={meshRef} >
         <planeGeometry args={[2, 2]} />
         <shaderMaterial
            uniforms={uniforms}
            vertexShader={vertex}
            fragmentShader={fragment} />
      </mesh>
   );
};

export default PixelationMesh;