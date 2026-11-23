"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchInquiries, updateInquiryStatus } from "@/lib/supabase";
import type { Inquiry } from "@/types";
import { Mail, RefreshCw, Search, CheckCircle, Clock, Inbox } from "lucide-react";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Inquiry["status"]>("all");

  const loadInquiries = async () => {
    setLoading(true);
    const result = await fetchInquiries();
    setInquiries(result.data);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const updateStatus = async (id: number, status: Inquiry["status"]) => {
    await updateInquiryStatus(id, status);
    setInquiries((current) =>
      current.map((inquiry) => inquiry.id === id ? { ...inquiry, status } : inquiry)
    );
  };

  const displayed = inquiries.filter((inquiry) => {
    if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return [
      inquiry.name,
      inquiry.email,
      inquiry.phone,
      inquiry.subject,
      inquiry.product_name,
      inquiry.message,
    ].some((value) => value?.toLowerCase().includes(query));
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-red-600" />
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Website Inquiries
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Contact form submissions from the website
            </p>
          </div>
          <button
            onClick={loadInquiries}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold uppercase flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, product..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | Inquiry["status"])}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-red-600" />
              Loading inquiries...
            </div>
          ) : displayed.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              No inquiries found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayed.map((inquiry) => (
                <div key={inquiry.id} className="p-5 hover:bg-slate-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{inquiry.name}</h3>
                        {inquiry.status === "new" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                        <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-red-600">
                          <Mail className="w-3.5 h-3.5" />
                          {inquiry.email}
                        </a>
                        {inquiry.phone && <span>Phone: {inquiry.phone}</span>}
                        {inquiry.product_name && (
                          <span className="font-bold text-slate-800">Product: {inquiry.product_name}</span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-500">
                        {inquiry.subject} • {new Date(inquiry.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{inquiry.message}</p>
                    </div>

                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value as Inquiry["status"])}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono shrink-0"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
