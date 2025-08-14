import React, { useState, useRef } from "react";
import "./index.css";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ImageIcon,
  Settings,
  Eye,
} from "lucide-react";
import QRCode from "qrcode";

const QRWatermarker = () => {
  const [data, setData] = useState("");
  const [position, setPosition] = useState("center");
  const [transparency, setTransparency] = useState(128);
  const [scale, setScale] = useState(25);
  const [watermark, setWatermark] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setWatermark(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Please select a valid image file");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data) {
      setError("QR Code Data cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      // 1. Create a canvas element in memory
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const qrSize = 512; // A good base resolution for the QR code
      canvas.width = qrSize;
      canvas.height = qrSize;

      // 2. Generate the QR code and draw it onto the canvas
      const qrDataUrl = await QRCode.toDataURL(data, {
        width: qrSize,
        margin: 1,
        errorCorrectionLevel: "H", // High error correction, best for watermarks
      });
      const qrImage = new Image();
      // Use a promise to wait for the image to load
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = qrDataUrl;
      });
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

      // 3. If a watermark is provided, draw it on top
      if (watermark && previewUrl) {
        const watermarkImage = new Image();
        // Use a promise to wait for the watermark image to load
        await new Promise((resolve, reject) => {
          watermarkImage.onload = resolve;
          watermarkImage.onerror = reject;
          watermarkImage.src = previewUrl;
        });

        // Calculate watermark dimensions
        const watermarkScale = scale / 100;
        const watermarkWidth = qrSize * watermarkScale;
        const watermarkHeight =
          (watermarkImage.height / watermarkImage.width) * watermarkWidth;
        const margin = qrSize * 0.05; // 5% margin from the edge

        // Calculate watermark position
        let x = (qrSize - watermarkWidth) / 2;
        let y = (qrSize - watermarkHeight) / 2;

        if (position === "top-left") {
          x = margin;
          y = margin;
        }
        if (position === "top-right") {
          x = qrSize - watermarkWidth - margin;
          y = margin;
        }
        if (position === "bottom-left") {
          x = margin;
          y = qrSize - watermarkHeight - margin;
        }
        if (position === "bottom-right") {
          x = qrSize - watermarkWidth - margin;
          y = qrSize - watermarkHeight - margin;
        }

        // Apply transparency
        ctx.globalAlpha = transparency / 255;

        // Draw the watermark
        ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
      }

      // 4. Get the final image from the canvas and set it as the result
      setResultUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error(err);
      setError(
        "Failed to generate QR code. Please check the data and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData("");
    setPosition("center");
    setTransparency(128);
    setScale(25);
    setWatermark(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
  };

  const positionOptions = [
    { value: "center", label: "Center", icon: "⊙" },
    { value: "top-left", label: "Top Left", icon: "↖" },
    { value: "top-right", label: "Top Right", icon: "↗" },
    { value: "bottom-left", label: "Bottom Left", icon: "↙" },
    { value: "bottom-right", label: "Bottom Right", icon: "↘" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              QR Watermarker
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            Create beautiful watermarked QR codes with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border-b border-red-500/30 p-4">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                {error}
              </div>
            </div>
          )}

          {!resultUrl ? (
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* QR Data Input */}
              <div className="space-y-3">
                <label className="text-white font-semibold text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  QR Code Data
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="Enter URL or text to encode"
                  required
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Watermark Upload */}
              <div className="space-y-3">
                <label className="text-white font-semibold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Watermark Image (Optional)
                </label>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    dragOver
                      ? "bg-white/20 border-white/60 scale-[1.02]"
                      : "bg-white/5 border-white/30 hover:bg-white/10"
                  } border-2 border-dashed rounded-2xl p-8`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="space-y-4 text-center">
                      <img
                        src={previewUrl}
                        alt="Watermark preview"
                        className="max-h-32 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-white/80 text-center">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <Upload className="w-12 h-12 text-white/60 mx-auto" />
                      <div>
                        <p className="text-white font-medium">
                          Drop your image here
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          or click to browse
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Position Selector */}
                <div className="space-y-3">
                  <label className="block text-white font-semibold text-lg">
                    Watermark Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {positionOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPosition(option.value)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          position === option.value
                            ? "bg-purple-500 border-purple-400 text-white shadow-lg scale-105"
                            : "bg-white/10 border-white/30 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        <div className="text-lg mb-1">{option.icon}</div>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-6">
                  {/* Transparency */}
                  <div className="space-y-3">
                    <label className="text-white font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Transparency
                      </span>
                      <span className="text-purple-300 font-bold">
                        {Math.round((transparency / 255) * 100)}%
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={transparency}
                        onChange={(e) => setTransparency(e.target.value)}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  {/* Scale */}
                  <div className="space-y-3">
                    <label className="text-white font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Size
                      </span>
                      <span className="text-purple-300 font-bold">
                        {scale}%
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || !data}
                className={`w-full p-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : !data
                    ? "bg-purple-500/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] hover:scale-[1.02]"
                } text-white shadow-lg flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate QR Code
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Result View */
            <div className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Eye className="w-6 h-6" />
                  Your QR Code is Ready!
                </h2>
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                  <img
                    src={resultUrl}
                    alt="Generated Watermarked QR Code"
                    className="w-64 h-64 rounded-lg object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = resultUrl;
                    link.download = "watermarked_qr.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default QRWatermarker;
