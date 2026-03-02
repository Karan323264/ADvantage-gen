import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import HistoryCard from "./HistoryCard";

function CampaignHistory() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCampaigns = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/api/campaign/my?page=${pageNumber}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const generated = res.data.campaigns.filter(
        (c) => c.status === "generated"
      );

      if (generated.length === 0 && pageNumber > 1) {
        setPage(pageNumber - 1);
        return;
      }

      setCampaigns(generated);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  const deleteCampaign = async (id) => {
    try {
      await axiosInstance.delete(`/api/campaign/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCampaigns(page);

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">

      {/* Grid (local override opacity) */}
            <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
                backgroundImage: `
                linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px"
            }}
            ></div>

      {/* Subtle AI Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_60%)]"></div>

      <div className="relative z-10 px-20 py-24 text-white">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-10 right-20 text-sm px-5 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition"
        >
          Close
        </button>

        <h1 className="text-4xl font-semibold mb-16">
          Campaign History
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="text-slate-300 text-lg">
            Loading campaigns...
          </div>
        )}

        {/* EMPTY */}
        {!loading && campaigns.length === 0 && (
          <div className="text-slate-400 text-lg">
            No campaigns found.
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-3 gap-12">
          {campaigns.map((campaign) => (
            <HistoryCard
              key={campaign._id}
              campaign={campaign}
              onDelete={deleteCampaign}
            />
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-3">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    page === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default CampaignHistory;