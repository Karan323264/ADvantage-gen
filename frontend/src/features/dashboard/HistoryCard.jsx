import { useState } from "react";

function HistoryCard({ campaign, onDelete }) {

  const imageUrl =
    campaign.finalImageUrl ||
    campaign.rawImageUrl ||
    null;

  // DOWNLOAD
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${campaign._id}.png`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  // Filter platforms that actually have non-empty arrays
  const validPlatforms = Object.entries(campaign.hashtags || {})
    .filter(([_, tags]) => tags && tags.length > 0)
    .map(([platform]) => platform);

  const hasMultiplePlatforms = validPlatforms.length > 1;

  const [selectedPlatform, setSelectedPlatform] =
    useState(validPlatforms[0] || null);

  const activePlatform = hasMultiplePlatforms
    ? selectedPlatform
    : validPlatforms[0];

  const tags =
    campaign.hashtags?.[activePlatform] || [];

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col min-h-[520px]">

      {/* IMAGE */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Campaign"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      {/* CAPTION */}
      {campaign.caption && (
        <p className="text-sm font-semibold text-slate-900 mb-4">
          {campaign.caption}
        </p>
      )}

        {/* PLATFORM SECTION */}
        <div className="mb-4 min-h-[36px]">
          {hasMultiplePlatforms ? (
            <div className="flex gap-3">
              {validPlatforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedPlatform === platform
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          ) : validPlatforms.length === 1 ? (
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs inline-block font-medium shadow-sm">
              {validPlatforms[0]}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              No platforms available
            </div>
          )}
        </div>

        {/* HASHTAGS */}
        <div className="flex flex-wrap gap-2 mb-5 min-h-[80px]">
        {tags.length > 0 ? (
            tags.slice(0, 8).map((tag, i) => (
            <span
                key={i}
                className="px-3 py-1 bg-slate-800 text-white border border-slate-500 rounded-full text-xs shadow-sm hover:bg-slate-700 transition"
            >
                {tag}
            </span>
            ))
        ) : (
            <span className="text-xs text-slate-300">
            No hashtags available
            </span>
        )}
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-3">
        {imageUrl && (
            <button
            onClick={handleDownload}
            className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm 
                        transition-all duration-200 
                        hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 
                        active:scale-95"
            >
            Download
            </button>
        )}

        <button
            onClick={() => onDelete(campaign._id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm 
                    transition-all duration-200 
                    hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 
                    active:scale-95"
        >
            Delete
        </button>
        </div>

    </div>
  );
}

export default HistoryCard;