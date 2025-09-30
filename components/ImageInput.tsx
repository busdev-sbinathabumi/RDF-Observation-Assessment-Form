import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal.tsx';

interface ImageInputProps {
  file: File | null;
  onChange: (file: File | null) => void;
  onThumbnailClick: (file: File) => void;
}

const cropImageTo916 = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        const imgAspectRatio = imgWidth / imgHeight;
        const canvasAspectRatio = 9 / 16;

        let sx, sy, sWidth, sHeight;

        if (imgAspectRatio > canvasAspectRatio) {
          sHeight = imgHeight;
          sWidth = imgHeight * canvasAspectRatio;
          sx = (imgWidth - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = imgWidth;
          sHeight = imgWidth / canvasAspectRatio;
          sx = 0;
          sy = (imgHeight - sHeight) / 2;
        }

        canvas.width = 720;
        canvas.height = 1280;

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name.replace(/\..+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(croppedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ImageInput: React.FC<ImageInputProps> = ({ file, onChange, onThumbnailClick }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startStream = async () => {
      if (isCameraOpen && !capturedImage) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin.");
          setIsCameraOpen(false);
        }
      }
    };
    startStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, capturedImage]);

  const processAndSetFile = async (selectedFile: File) => {
    try {
      const croppedFile = await cropImageTo916(selectedFile);
      onChange(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Gagal memproses gambar. Silakan coba file lain.");
      onChange(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        processAndSetFile(selectedFile);
    } else {
        onChange(null);
    }
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();
  const handlePreviewClick = () => file && onThumbnailClick?.(file);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0 && droppedFiles[0].type.startsWith('image/')) {
        processAndSetFile(droppedFiles[0]);
    }
  };

  const handleOpenCamera = () => setIsCameraOpen(true);
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const videoAspectRatio = videoWidth / videoHeight;
      const canvasAspectRatio = 9 / 16;
      
      let sx, sy, sWidth, sHeight;
      
      if (videoAspectRatio > canvasAspectRatio) {
        sHeight = videoHeight;
        sWidth = videoHeight * canvasAspectRatio;
        sx = (videoWidth - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = videoWidth;
        sHeight = videoWidth / canvasAspectRatio;
        sx = 0;
        sy = (videoHeight - sHeight) / 2;
      }

      canvas.width = 720;
      canvas.height = 1280;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, sx, sy, sWidth, sHeight, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
      }
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => setCapturedImage(null);

  const handleUsePhoto = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        if (blob) {
          const newFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onChange(newFile);
          handleCloseCamera();
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 text-gray-500 transition-colors ${
            isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleBrowseClick} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Unggah</span>
            </button>
            <span className="text-gray-300">|</span>
            <button type="button" onClick={handleOpenCamera} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Kamera</span>
            </button>
          </div>
          <span className="text-xs text-gray-400 mt-2">atau seret dan lepas foto</span>
        </div>
      ) : (
        <div className="relative w-full aspect-[9/16] bg-slate-100 rounded-md overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            onClick={handlePreviewClick}
            className={`w-full h-full object-contain ${onThumbnailClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Hapus gambar"
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Modal isOpen={isCameraOpen} onClose={handleCloseCamera}>
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 text-center">Ambil Foto</h3>
          <div className="relative bg-black rounded-md overflow-hidden aspect-[9/16] w-full max-w-sm mx-auto">
            {!capturedImage ? (
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }}></video>
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {!capturedImage ? (
              <button 
                  type="button" 
                  onClick={handleCapture} 
                  className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Ambil Foto"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
              </button>
            ) : (
              <>
                <button type="button" onClick={handleRetake} className="px-6 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50">Ambil Ulang</button>
                <button type="button" onClick={handleUsePhoto} className="px-6 py-2 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">Gunakan Foto</button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};