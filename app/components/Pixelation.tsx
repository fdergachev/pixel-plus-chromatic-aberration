"use client"
import { OrthographicCamera } from '@react-three/drei';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import PixelationMesh from './PixelationMesh';



const Pixelation = () => {
   let aspectRatio = window.innerWidth / window.innerHeight;
   const cameraRef = useRef<THREE.OrthographicCamera>(null);
   const containerRef = useRef<HTMLDivElement | null>(null)
   useEffect(() => {
      window.addEventListener("resize", handleResize, false);
      return () => {
         window.removeEventListener("resize", handleResize, false)
      }
   }, [])

   function handleResize() {
      const aspectRatio = window.innerWidth / window.innerHeight;
      if (cameraRef.current) {
         cameraRef.current.left = -1;
         cameraRef.current.right = 1;
         cameraRef.current.top = 1 / aspectRatio;
         cameraRef.current.bottom = -1 / aspectRatio;
         cameraRef.current.updateProjectionMatrix()
      }
   }
   return (
      <div ref={containerRef} className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
         <Canvas gl={{ pixelRatio: window.devicePixelRatio, antialias: true }} className="" >
            <group >
               <OrthographicCamera ref={cameraRef} makeDefault left={-1} right={1} top={1 / aspectRatio} bottom={-1 / aspectRatio} near={0.1} far={1000} position={[0, 0, 1]} />
               <PixelationMesh container={containerRef} />
            </group>
         </Canvas>
      </div>
   );
};






export default Pixelation;