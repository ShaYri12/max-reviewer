"use client";
import { useState, useRef } from "react";
import jsQR from "jsqr";

const QRScanner = ({ id, onScan, onError }) => {
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);

  const handleScan = async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        videoRef.current.onloadedmetadata = () => {
          scanQR();
        };
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const scanQR = () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (qrCode) {
            const scannedUrl = qrCode.data;
            const productId = scannedUrl.split("/").pop();
            onScan(productId); // Trigger onScan from the parent
            stopCamera();
            setScanning(false);
          } else {
            requestAnimationFrame(scanQR);
          }
        } else {
          requestAnimationFrame(scanQR);
        }
      };

      const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      onError(); // Trigger onError from the parent
      setScanning(false);
    }
  };
  return (
    <div
      className={`relative w-full h-64 border-2 border-[#71C9ED] rounded-lg overflow-hidden ${
        id ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {scanning ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
      ) : (
        <button
          type="button"
          onClick={handleScan}
          className="w-full h-64 rounded-lg p-6 flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <div className=" w-2/5 flex items-center justify-center">
            <img src="/scan.svg" alt="Scan" width={60} height={60} />
          </div>
          <p className="text-[#6C7278] w-3/5 text-start font-bold">
            Click para escanear con tu cámara móvil
          </p>
        </button>
      )}
    </div>
  );
};

export default QRScanner;
