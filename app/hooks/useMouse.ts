import React, { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

const useMouse = () => {
   const mouse = {
      x: useMotionValue(0),
      y: useMotionValue(0)
   } 

   const mouseMove = (e:MouseEvent) =>{
      const {clientX, clientY} = e;

      mouse.x.set(clientX)
      mouse.y.set(clientY)
   }

   useEffect(()=>{
      window.addEventListener("mousemove", mouseMove)
      return () => window.removeEventListener("mousemove",mouseMove)
   },[])

   return mouse;
};

export default useMouse;