import * as THREE from "three"

export function createTextTexture(text: string, font: string, size: number | null, color: string, fontWeight = "500") {
   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");

   const canvasWidth = window.innerWidth * 2;
   const canvasHeight = window.innerHeight * 2;

   canvas.width = canvasWidth;
   canvas.height = canvasHeight;

   ctx!.fillStyle = color || "#ffffff";
   ctx!.fillRect(0, 0, canvas.width, canvas.height);

   const fontSize = size || Math.floor(canvasWidth * 2);

   ctx!.fillStyle = "#1a1a1a";
   ctx!.font = `${fontWeight} ${fontSize}px "${font || "ClashDisplay-Medium"}"`
   ctx!.textAlign = "center";
   ctx!.textBaseline = "middle";

   ctx!.imageSmoothingEnabled = true;
   ctx!.imageSmoothingQuality = "high"

   const textMetrics = ctx!.measureText(text);
   const textWidth = textMetrics!.width;

   const scaleFactor = Math.min(1, (canvasWidth * 1) / textWidth);
   const aspectCorrection = canvasWidth / canvasHeight;

   ctx!.setTransform(
      scaleFactor,
      0,
      0,
      scaleFactor / aspectCorrection,
      canvasWidth / 2,
      canvasHeight / 2
   );

   ctx!.strokeStyle = "#1a1a1a";
   ctx!.lineWidth = fontSize * 0.005;
   for (let i = 0; i < 3; i++) {
      ctx!.strokeText(text, 0, 0);
   }

   ctx!.fillText(text, 0, 0);

   const newTexture = new THREE.CanvasTexture(canvas)

   newTexture.anisotropy = 32;  // You can adjust this value to improve sharpness

   // Optionally, make sure mipmaps are enabled for texture sharpness
   newTexture.minFilter = THREE.LinearMipmapLinearFilter; // Use mipmaps
   newTexture.magFilter = THREE.LinearFilter;
   newTexture.wrapS = THREE.RepeatWrapping;
   newTexture.wrapT = THREE.RepeatWrapping;
   // newTexture.encoding = THREE.sRGBEncoding
   return newTexture;
}