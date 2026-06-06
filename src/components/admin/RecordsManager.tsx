"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminScrollbar } from "@/components/admin/AdminScrollArea";
import { formatDate, shortText } from "@/lib/format";

type RecordItem = {
  id: string;
  blogId: string;
  ip: string | null;
  userAgent: string | null;
  articleUrl: string | null;
  articleTitle: string | null;
  unlockMethod: string;
  randomPercent: number;
  success: boolean;
  createdAt: string;
  owner?: { name: string; email: string };
};

type CurrentUser = { role: "SUPER_ADMIN" | "USER" };

export function RecordsManager({ currentUser, initialRecords }: { currentUser: CurrentUser; initialRecords: RecordItem[] }) {
  const [records, setRecords] = useState<RecordItem[]>(initialRecords);
  const [keyword, setKeyword] = useState("");
  const [blogId, setBlogId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<RecordItem | null>(null);

  async function loadRecords() {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (blogId) params.set("blogId", blogId);
    const res = await fetch(`/api/admin/records?${params}`);
    const json = await res.json();
    setRecords(json.records || []);
  }


  async function remove(id: string) {
    if (!confirm("确定删除该记录？")) return;
    await fetch(`/api/admin/records/${id}`, { method: "DELETE" });
    await loadRecords();
  }

  async function batchDelete() {
    if (selected.length === 0) return;
    if (!confirm(`确定删除选中的 ${selected.length} 条记录？`)) return;
    await fetch("/api/admin/records/batch-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    await loadRecords();
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-blue-500">浏览记录</div>
      <div className="bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-3">
          <input value={blogId} onChange={(e) => setBlogId(e.target.value)} placeholder="博客 ID" className="h-9 w-64 rounded border border-slate-300 px-3 text-sm" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="文章标题" className="h-9 w-64 rounded border border-slate-300 px-3 text-sm" />
          <button onClick={loadRecords} className="h-9 rounded border border-slate-300 px-5 text-sm">查询</button>
          <button onClick={batchDelete} className="h-9 rounded bg-rose-400 px-5 text-sm text-white">批量删除</button>
        </div>
        <AdminScrollbar className="admin-table-scroll" scrollableNodeClassName="admin-table-scroll-viewport">
          <table className="min-w-full border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="border p-3"><input type="checkbox" checked={records.length > 0 && selected.length === records.length} onChange={(e) => setSelected(e.target.checked ? records.map((r) => r.id) : [])} /></th>
                {currentUser.role === "SUPER_ADMIN" && <th className="border p-3">所属用户</th>}
                <th className="border p-3">博客 ID</th>
                <th className="border p-3">访问 IP</th>
                <th className="border p-3">文章链接</th>
                <th className="border p-3">文章标题</th>
                <th className="border p-3">解锁方式</th>
                <th className="border p-3">随机引流概率</th>
                <th className="border p-3">结果</th>
                <th className="border p-3">创建时间</th>
                <th className="border p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="text-center text-slate-700">
                  <td className="border p-3"><input type="checkbox" checked={selected.includes(record.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, record.id] : selected.filter((id) => id !== record.id))} /></td>
                  {currentUser.role === "SUPER_ADMIN" && <td className="border p-3">{record.owner?.name || "-"}</td>}
                  <td className="border p-3 whitespace-nowrap">{record.blogId}</td>
                  <td className="border p-3">{record.ip || "-"}</td>
                  <td className="border p-3 text-blue-500">{shortText(record.articleUrl, 52)}</td>
                  <td className="border p-3">{shortText(record.articleTitle, 40)}</td>
                  <td className="border p-3">验证码解锁</td>
                  <td className="border p-3">{record.randomPercent}%</td>
                  <td className="border p-3">{record.success ? "成功" : "访问"}</td>
                  <td className="border p-3 whitespace-nowrap">{formatDate(record.createdAt)}</td>
                  <td className="border p-3 whitespace-nowrap"><button onClick={() => setDetail(record)} className="mr-3 text-blue-500">明细</button><button onClick={() => remove(record.id)} className="text-blue-500">删除</button></td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={11} className="p-10 text-center text-slate-400">暂无数据</td></tr>}
            </tbody>
          </table>
        </AdminScrollbar>
      </div>
      {detail && (
        <AdminModal title="明细" size="lg" onClose={() => setDetail(null)}>
            <div className="grid gap-4">
              <Detail label="博客 ID" value={detail.blogId} />
              {currentUser.role === "SUPER_ADMIN" && <Detail label="所属用户" value={`${detail.owner?.name || "-"} ${detail.owner?.email || ""}`} />}
              <Detail label="访问 IP" value={detail.ip || "-"} />
              <Detail label="浏览器 UA" value={detail.userAgent || "-"} />
              <Detail label="文章链接" value={detail.articleUrl || "-"} />
              <Detail label="文章标题" value={detail.articleTitle || "-"} />
              <Detail label="解锁方式" value="验证码解锁" />
              <Detail label="随机引流概率" value={`${detail.randomPercent}%`} />
              <Detail label="创建时间" value={formatDate(detail.createdAt)} />
            </div>
        </AdminModal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <label className="grid grid-cols-[140px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">{label}</span><input value={value} readOnly className="rounded border border-slate-300 px-3 py-2" /></label>;
}
