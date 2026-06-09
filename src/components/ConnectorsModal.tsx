"use client";

import { useState } from "react";
import { 
  DollarSign, 
  MessageSquare, 
  BarChart, 
  Mail, 
  CheckSquare, 
  Link2, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Copy,
  ChevronRight
} from "lucide-react";
import { useProjectStore } from "@/lib/store/projectStore";

interface ConnectorsModalProps {
  projectId: string;
}

export default function ConnectorsModal({ projectId }: ConnectorsModalProps) {
  const { projects, toggleConnector, runSQLQuery } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>("stripe");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!project) return null;

  const categories = ["All", "Sales", "Messaging", "Marketing", "Google", "Productivity"];

  const filteredConnectors = activeCategory === "All" 
    ? project.connectors 
    : project.connectors.filter(c => c.category === activeCategory);

  const selectedConnector = project.connectors.find(c => c.id === selectedConnectorId);

  const getConnectorIcon = (name: string) => {
    switch (name) {
      case "Stripe Webhooks": return <DollarSign className="h-4.5 w-4.5" />;
      case "Slack Alerts": return <MessageSquare className="h-4.5 w-4.5" />;
      case "HubSpot Leads": return <BarChart className="h-4.5 w-4.5" />;
      case "Gmail Email Client": return <Mail className="h-4.5 w-4.5" />;
      case "Linear Tracker": return <CheckSquare className="h-4.5 w-4.5" />;
      default: return <Link2 className="h-4.5 w-4.5" />;
    }
  };

  const getConnectorColor = (name: string) => {
    switch (name) {
      case "Stripe Webhooks": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Slack Alerts": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "HubSpot Leads": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Gmail Email Client": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "Linear Tracker": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  // Simulates sending a webhook event to the database
  const handleSendTestWebhook = async () => {
    if (!selectedConnector || selectedConnector.status === "disconnected") return;

    setIsTesting(true);
    setTestResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    let query = "";
    if (selectedConnector.id === "stripe") {
      query = `INSERT INTO leads (name, email, company, message) VALUES ('Stripe Customer', 'stripe_${Math.floor(Math.random()*1000)}@stripe.com', 'Stripe Inc', 'Simulated invoice payment of $49.00 completed successfully.');`;
    } else if (selectedConnector.id === "hubspot") {
      query = `INSERT INTO leads (name, email, company, message) VALUES ('HubSpot Lead', 'hubspot_${Math.floor(Math.random()*1000)}@hubspot.com', 'HubSpot Org', 'Lead auto-synced from HubSpot forms CRM.');`;
    } else {
      query = `INSERT INTO leads (name, email, company, message) VALUES ('General Webhook', 'webhook_${Math.floor(Math.random()*1000)}@example.com', 'Webhook Corp', 'Simulated event payload delivered.');`;
    }

    const res = runSQLQuery(projectId, query);
    setIsTesting(false);

    if (res.success) {
      setTestResult("Success: Webhook JSON delivered. Inserted 1 lead into table 'leads'. App preview hot-updated.");
    } else {
      setTestResult(`Failed: Table 'leads' not found. Make sure you build a database table named 'leads' first.`);
    }
  };

  const webhookUrl = `http://localhost:3000/api/webhooks?projectId=${project.id}&connector=${selectedConnectorId}`;

  return (
    <div className="flex-1 flex h-full bg-[#070709] overflow-hidden">
      
      {/* Left List Pane */}
      <div className="w-[300px] border-r border-white/5 bg-[#0b0b0f]/60 flex flex-col h-full shrink-0">
        
        {/* Category filtering */}
        <div className="p-4 border-b border-white/5 space-y-2">
          <h3 className="text-xs font-bold text-white font-outfit">API Webhooks Connectors</h3>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white" 
                    : "bg-white/5 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Connectors selection */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredConnectors.map((c) => {
            const isSelected = selectedConnectorId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConnectorId(c.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-blue-600/10 border-blue-500/30 text-white"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getConnectorColor(c.name)}`}>
                    {getConnectorIcon(c.name)}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">{c.name}</p>
                    <p className="text-[9px] text-zinc-500 capitalize">{c.category}</p>
                  </div>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Details Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8 bg-black/10 select-text">
        {selectedConnector ? (
          <div className="max-w-xl w-full mx-auto space-y-6 text-left">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white font-outfit">{selectedConnector.name}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Automatically sync third party events directly into your database.
                </p>
              </div>

              <button
                onClick={() => toggleConnector(projectId, selectedConnector.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedConnector.status === "connected"
                    ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                    : "glow-btn-blue text-white border-transparent"
                }`}
              >
                {selectedConnector.status === "connected" ? "Connected" : "Connect Now"}
              </button>
            </div>

            {/* Connection configuration details */}
            {selectedConnector.status === "connected" ? (
              <div className="space-y-6 border-t border-white/5 pt-6">
                
                {/* Webhook endpoint URL box */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                    Your Webhook Endpoint URL
                  </span>
                  <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300">
                    <span className="truncate">{webhookUrl}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(webhookUrl)}
                      className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                      title="Copy URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-relaxed font-sans">
                    Configure your Stripe, Slack, or webhook dashboards to send POST requests here.
                  </p>
                </div>

                {/* Simulated testing panel */}
                <div className="bg-[#0f0f15]/50 border border-white/5 rounded-xl p-5 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-zinc-200">Send Test Event Payload</h5>
                    <p className="text-[10px] text-zinc-500">
                      Simulate a live webhook event delivery to test database insertion rules.
                    </p>
                  </div>

                  <button
                    onClick={handleSendTestWebhook}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold border border-white/5 cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    <span>Send Test Webhook</span>
                  </button>

                  {testResult && (
                    <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 font-sans ${
                      testResult.includes("Success")
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                      {testResult.includes("Success") ? (
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4.5 w-4.5 shrink-0" />
                      )}
                      <span className="leading-normal">{testResult}</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="border-t border-white/5 pt-8 text-center text-zinc-500 text-xs py-10 bg-black/5 rounded-xl border border-dashed border-white/5 select-none">
                <Link2 className="h-8 w-8 text-zinc-700 mx-auto mb-2.5" />
                <span>Integration is disconnected. Click Connect to enable.</span>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center text-zinc-500 text-xs">
            Select an integration connector to configure.
          </div>
        )}
      </div>

    </div>
  );
}
