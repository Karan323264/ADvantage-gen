import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import axiosInstance from "../../services/axiosInstance";

function CampaignEditorModal({ campaign, onClose, onSaved }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const wrapperRef = useRef(null);
  const originalSizeRef = useRef({ width: 0, height: 0 });

  const [selectedObject, setSelectedObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(40);

  useEffect(() => {
    if (!campaign?.imageUrl) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
    });

    // reset viewport
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);

    fabricRef.current = canvas;

    fabric.Image.fromURL(
      campaign.imageUrl,
      { crossOrigin: "anonymous" }
    ).then((img) => {
      if (!img) return;

      const width = img.width;
      const height = img.height;

      originalSizeRef.current = { width, height };
      canvas.setDimensions({ width, height });

      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      img.moveTo(0); 
      canvas.requestRenderAll();

      fitCanvasToContainer();
    });

    canvas.on("selection:created", (e) =>
      setSelectedObject(e.selected?.[0])
    );
    canvas.on("selection:updated", (e) =>
      setSelectedObject(e.selected?.[0])
    );
    canvas.on("selection:cleared", () =>
      setSelectedObject(null)
    );

    window.addEventListener("resize", fitCanvasToContainer);

    return () => {
      window.removeEventListener("resize", fitCanvasToContainer);
      canvas.dispose();
    };
  }, [campaign]);

  const fitCanvasToContainer = () => {
    const canvas = fabricRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const { width, height } = originalSizeRef.current;
    if (!width || !height) return;

    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    const scale = Math.min(
      wrapperWidth / width,
      wrapperHeight / height
    );

    const offsetX = (wrapperWidth - width * scale) / 2;
    const offsetY = (wrapperHeight - height * scale) / 2;

    canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
    canvas.requestRenderAll();
  };

  const addText = () => {
    const text = new fabric.IText("Edit me", {
      left: 200,
      top: 200,
      fill: "#ffffff",
      fontSize,
      fontWeight: "bold",
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  };

  const updateColor = (color) => {
    if (!selectedObject) return;
    selectedObject.set("fill", color);
    fabricRef.current.renderAll();
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    if (!selectedObject) return;
    selectedObject.set("fontSize", size);
    fabricRef.current.renderAll();
  };

  const deleteObject = () => {
    if (!selectedObject) return;
    fabricRef.current.remove(selectedObject);
  };

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result).then((img) => {
        img.scaleToWidth(200);
        img.set({ left: 100, top: 100 });
        fabricRef.current.add(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const exportImage = () => {
    const canvas = fabricRef.current;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 1,
      withoutTransform: true,
    });

    fitCanvasToContainer();

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "campaign.png";
    a.click();
  };

  const saveImage = async () => {
    setLoading(true);

    const canvas = fabricRef.current;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 1,
      withoutTransform: true,
    });

    fitCanvasToContainer();

    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append("image", blob);

    const token = localStorage.getItem("token");

    const response = await axiosInstance.post(
      `/api/campaign/${campaign._id}/finalize`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onSaved(response.data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
      <div className="h-14 border-b bg-white flex items-center justify-between px-8 shadow-sm">
        <div className="font-semibold text-slate-800">
          Campaign Editor
        </div>

        <div className="flex items-center gap-4">
          <button onClick={exportImage}>Download</button>
          <button
            onClick={saveImage}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 bg-white border-r p-6 flex flex-col gap-6">
          <button
            onClick={addText}
            className="bg-black text-white py-2 rounded-md"
          >
            Add Text
          </button>

          <div>
            <label className="text-xs">Text Color</label>
            <input
              type="color"
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs">Font Size</label>
            <input
              type="range"
              min="10"
              max="150"
              value={fontSize}
              onChange={(e) =>
                updateFontSize(parseInt(e.target.value))
              }
            />
          </div>

          <input type="file" onChange={uploadLogo} />

          <button
            onClick={deleteObject}
            className="text-red-500 text-sm"
          >
            Delete Selected
          </button>
        </div>

        <div
          ref={wrapperRef}
          className="flex-1 bg-slate-100"
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default CampaignEditorModal;