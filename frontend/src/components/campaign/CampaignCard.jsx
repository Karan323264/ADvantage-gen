import { useState } from "react";
import { Download, Edit } from "lucide-react";

function CampaignCard({ campaign, onEdit }) {
  const [activePlatform, setActivePlatform] = useState(
    campaign.platforms?.[0] || "Instagram"
  );

  const imageToShow =
    campaign.finalImageUrl || campaign.rawImageUrl;

  const hashtags =
    campaign.hashtags?.[activePlatform] || [];

  const handleDownload = async () => {
    try {
      const response = await fetch(imageToShow);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "advantage-gen-campaign.jpg";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleEdit = () => {
    if (!onEdit) return;

    onEdit({
      ...campaign,
      imageUrl: imageToShow,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-[520px]">

      {/* IMAGE */}
      <div className="w-full h-72 overflow-hidden rounded-xl">
        <img
          src={imageToShow}
          alt="Generated Campaign"
          className="w-full h-full object-cover"
        />
      </div>

      {/* CAPTION */}
      <p className="text-lg font-semibold text-slate-900 mt-6">
        {campaign.caption}
      </p>

      {/* PLATFORM TABS */}
      {campaign.platforms?.length > 1 && (
        <div className="flex gap-6 mt-6 border-b border-slate-200 pb-2">
          {campaign.platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`text-sm font-medium transition ${
                activePlatform === platform
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      )}

      {/* HASHTAGS */}
      <div className="mt-4 flex flex-wrap gap-2">
        {hashtags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm transition"
        >
          <Download size={16} />
          Download
        </button>

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 text-sm transition"
        >
          <Edit size={16} />
          Edit
        </button>

      </div>
    </div>
  );
}

export default CampaignCard;