"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AnalyticsPage() {
  const router = useRouter();

  const [stats, setStats] = useState({ total_tokens: 0, total_cost: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch stats
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/analytics/`, {
        headers,
      });

      if (statsRes.status === 401) {
        router.push("/login");
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          total_tokens: statsData?.total_tokens || 0,
          total_cost: statsData?.total_cost || 0,
        });
      }

      // Fetch logs
      const logsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/analytics/logs`,
        { headers }
      );

      if (logsRes.status === 401) {
        router.push("/login");
        return;
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(Array.isArray(logsData) ? logsData : []);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-zinc-950 px-4 sm:px-8 py-8 md:py-12">

      {/* Background glow */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/chat")}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            >
              ←
            </button>

            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Usage Analytics
            </h1>
          </div>

          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
            Current Billing Cycle
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Tokens */}
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 shadow-xl">
            <p className="text-white/50 text-sm mb-2">Total Tokens</p>

            <h2 className="text-5xl font-bold text-white">
              {loading
                ? "..."
                : Number(stats.total_tokens).toLocaleString()}
            </h2>
          </div>

          {/* Cost */}
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 shadow-xl">
            <p className="text-white/50 text-sm mb-2">Estimated Cost</p>

            <h2 className="text-5xl font-bold text-green-400">
              {loading
                ? "..."
                : `$${Number(stats.total_cost).toFixed(5)}`}
            </h2>
          </div>
        </div>

        {/* Logs */}
        <div className="rounded-3xl bg-black/40 border border-white/10 shadow-xl overflow-hidden">

          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl text-white">Recent Logs</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/70">

              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tokens</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-white/40">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">#{log.id}</td>
                      <td className="px-6 py-4">
                        {Number(log.tokens).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-green-400">
                        ${Number(log.cost).toFixed(6)}
                      </td>
                      <td className="px-6 py-4">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}