import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import PromptInput from "../generator/PromptInput";
import ToneSelector from "../generator/ToneSelector";
import PlatformSelector from "../generator/PlatformSelector";
import CampaignCard from "../../components/campaign/CampaignCard";
import CampaignEditorModal from "../../features/editor/CampaignEditorModal";

function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [platforms, setPlatforms] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prevent background scroll when editor is open
  useEffect(() => {
    if (editingCampaign) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [editingCampaign]);

  const handleGenerate = async () => {
    if (!prompt.trim() || platforms.length === 0) {
      alert("Please enter a prompt and select at least one platform.");
      return;
    }

    try {
      setLoading(true);
      setCampaign(null);

      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/api/campaign/generate",
        {
          prompt,
          tone,
          platforms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCampaign(response.data);
    } catch (error) {
      if (error.response?.status === 429) {
        alert(error.response.data.message);
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert("Campaign generation failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (campaignData) => {
    setEditingCampaign(campaignData);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-24 px-6 relative">

      {/* HERO / RESULT AREA */}
      <div className="w-full max-w-5xl">

        {!campaign && !loading && (
          <div className="flex flex-col justify-center items-center text-center py-24">
            <h1 className="text-5xl font-semibold leading-tight text-slate-900">
              Generate AI-Powered
              <br />
              Social Media Campaigns
            </h1>

            <p className="text-lg text-slate-500 mt-6">
              Describe your idea, choose tone and platform,
              and generate campaigns instantly.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-start items-start">
            <div className="w-[520px] bg-white rounded-2xl shadow-xl p-8">
              <div className="w-full h-72 bg-slate-200 animate-pulse rounded-xl mb-6" />
              <div className="h-5 bg-slate-200 animate-pulse rounded w-3/4 mb-4" />
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-full" />
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-full" />
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-full" />
              </div>
              <div className="mt-6 text-sm text-slate-500">
                Generating AI campaign... This may take 20–30 seconds.
              </div>
            </div>
          </div>
        )}

        {campaign && !loading && (
          <div className="flex justify-start items-start">
            <CampaignCard
              campaign={campaign}
              onEdit={openEditModal}
            />
          </div>
        )}

      </div>

      {/* INPUT + CONTROLS */}
      <div className="w-full max-w-5xl mt-16 flex items-start gap-12">

        <div className="flex-1">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSend={handleGenerate}
            loading={loading}
          />
        </div>

        <div className="w-[320px] flex flex-col gap-6">
          <ToneSelector value={tone} onChange={setTone} />
          <PlatformSelector value={platforms} onChange={setPlatforms} />
        </div>

      </div>

      {/* FULL SCREEN EDITOR */}
      {editingCampaign && (
        <CampaignEditorModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSaved={(updatedCampaign) => {
            setCampaign(updatedCampaign);
            setEditingCampaign(null);
          }}
        />
      )}

    </div>
  );
}

export default DashboardPage;