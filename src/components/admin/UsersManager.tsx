"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { formatDate } from "@/lib/format";

type UserItem = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  _count: { blogs: number; records: number };
};

export function UsersManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [keyword, setKeyword] = useState("");
  const [detail, setDetail] = useState<UserItem | null>(null);

  async function loadUsers() {
    const res = await fetch(`/api/admin/users?keyword=${encodeURIComponent(keyword)}`);
    const json = await res.json();
    setUsers(json.users || []);
  }


  async function toggle(user: UserItem) {
    const action = user.status === "ACTIVE" ? "disable" : "enable";
    await fetch(`/api/admin/users/${user.id}/${action}`, { method: "POST" });
    await loadUsers();
  }

  async function resetPassword(user: UserItem) {
    const password = prompt(`请输入 ${user.email} 的新密码，至少 8 位`);
    if (!password) return;
    const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) alert((await res.json()).error || "重置失败");
    else alert("密码已重置");
  }

  async function remove(user: UserItem) {
    if (!confirm(`确定删除用户 ${user.email}？该用户的博客和记录也会删除。`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) alert((await res.json()).error || "删除失败");
    await loadUsers();
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-blue-500">用户管理</div>
      <div className="bg-white p-4 shadow-sm">
        <div className="mb-4 flex gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="邮箱 / 昵称" className="h-9 w-64 rounded border border-slate-300 px-3 text-sm" />
          <button onClick={loadUsers} className="h-9 rounded border border-slate-300 px-5 text-sm">查询</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="border p-3">用户 ID</th>
                <th className="border p-3">邮箱</th>
                <th className="border p-3">昵称</th>
                <th className="border p-3">角色</th>
                <th className="border p-3">状态</th>
                <th className="border p-3">博客数量</th>
                <th className="border p-3">浏览记录数量</th>
                <th className="border p-3">最近登录时间</th>
                <th className="border p-3">注册时间</th>
                <th className="border p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center text-slate-700">
                  <td className="border p-3">{user.id}</td>
                  <td className="border p-3">{user.email}</td>
                  <td className="border p-3">{user.name}</td>
                  <td className="border p-3">{user.role === "SUPER_ADMIN" ? "超级管理员" : "普通用户"}</td>
                  <td className="border p-3">{user.status === "ACTIVE" ? "启用" : "禁用"}</td>
                  <td className="border p-3">{user._count.blogs}</td>
                  <td className="border p-3">{user._count.records}</td>
                  <td className="border p-3 whitespace-nowrap">{formatDate(user.lastLoginAt)}</td>
                  <td className="border p-3 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                  <td className="border p-3 whitespace-nowrap"><button onClick={() => setDetail(user)} className="mr-3 text-blue-500">明细</button><button onClick={() => toggle(user)} className="mr-3 text-blue-500">{user.status === "ACTIVE" ? "禁用" : "启用"}</button><button onClick={() => resetPassword(user)} className="mr-3 text-blue-500">重置密码</button><button onClick={() => remove(user)} className="text-blue-500">删除</button></td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={10} className="p-10 text-center text-slate-400">暂无数据</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {detail && (
        <AdminModal title="用户明细" size="md" onClose={() => setDetail(null)}>
            <div className="grid gap-4">
              <Detail label="用户 ID" value={detail.id} />
              <Detail label="邮箱" value={detail.email} />
              <Detail label="昵称" value={detail.name} />
              <Detail label="角色" value={detail.role === "SUPER_ADMIN" ? "超级管理员" : "普通用户"} />
              <Detail label="状态" value={detail.status === "ACTIVE" ? "启用" : "禁用"} />
              <Detail label="博客数量" value={String(detail._count.blogs)} />
              <Detail label="浏览记录数量" value={String(detail._count.records)} />
              <Detail label="最近登录时间" value={formatDate(detail.lastLoginAt)} />
              <Detail label="注册时间" value={formatDate(detail.createdAt)} />
            </div>
        </AdminModal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <label className="grid grid-cols-[130px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">{label}</span><input value={value} readOnly className="rounded border border-slate-300 px-3 py-2" /></label>;
}
