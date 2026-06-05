"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { buildHexoUsage, buildHtmlUsage, buildWechatReply, type UsageBlog } from "@/lib/usage";
import { shortText } from "@/lib/format";

type ArticleRule = { type: "exact" | "prefix" | "contains"; value: string };
type ProtectionMode = "off" | "all" | "rules";

type Blog = UsageBlog & {
  id: string;
  domain: string;
  enabled: boolean;
  protectionMode?: string;
  whitelistRules?: unknown;
  protectionRules?: unknown;
  createdAt: string;
  owner?: { id: string; email: string; name: string };
};

type BlogForm = {
  type: string;
  name: string;
  domain: string;
  officialAccountName: string;
  replyKeyword: string;
  qrcodeUrl: string;
  unlockExpiresDays: number;
  captchaExpiresSeconds: number;
  randomPercent: number;
  allowMobile: boolean;
  previewHeight: number;
  protectionMode: ProtectionMode;
  whitelistRulesText: string;
  protectionRulesText: string;
  enabled: boolean;
};

type CurrentUser = { role: "SUPER_ADMIN" | "USER" };

const emptyForm: BlogForm = {
  type: "website",
  name: "",
  domain: "",
  officialAccountName: "",
  replyKeyword: "验证码",
  qrcodeUrl: "",
  unlockExpiresDays: 7,
  captchaExpiresSeconds: 300,
  randomPercent: 100,
  allowMobile: false,
  previewHeight: 480,
  protectionMode: "all",
  whitelistRulesText: "",
  protectionRulesText: "",
  enabled: true,
};

function parseRuleLines(value: string): ArticleRule[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map<ArticleRule>((line) => {
      const match = line.match(/^(exact|prefix|contains):(.*)$/);
      if (!match) return { type: "contains", value: line };
      return { type: match[1] as ArticleRule["type"], value: match[2].trim() };
    })
    .filter((rule) => rule.value.length > 0);
}

function formatRuleLines(rules: unknown) {
  if (!Array.isArray(rules)) return "";
  return rules
    .map((rule) => {
      if (!rule || typeof rule !== "object") return null;
      const candidate = rule as { type?: unknown; value?: unknown };
      if (candidate.type !== "exact" && candidate.type !== "prefix" && candidate.type !== "contains") return null;
      if (typeof candidate.value !== "string" || !candidate.value.trim()) return null;
      return `${candidate.type}:${candidate.value.trim()}`;
    })
    .filter(Boolean)
    .join("\n");
}

function normalizeProtectionMode(mode: unknown): ProtectionMode {
  return mode === "off" || mode === "rules" ? mode : "all";
}

function protectionModeText(mode: unknown) {
  const normalized = normalizeProtectionMode(mode);
  if (normalized === "off") return "关闭保护";
  if (normalized === "rules") return "按规则保护";
  return "全部保护";
}

export function BlogsManager({ currentUser, initialBlogs }: { currentUser: CurrentUser; initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [usageBlog, setUsageBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");

  async function loadBlogs() {
    const res = await fetch(`/api/admin/blogs?keyword=${encodeURIComponent(keyword)}`);
    const json = await res.json();
    setBlogs(json.blogs || []);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  function openEdit(blog: Blog) {
    setEditing(blog);
    setForm({
      type: blog.type,
      name: blog.name,
      domain: blog.domain,
      officialAccountName: blog.officialAccountName,
      replyKeyword: blog.replyKeyword,
      qrcodeUrl: blog.qrcodeUrl,
      unlockExpiresDays: blog.unlockExpiresDays,
      captchaExpiresSeconds: blog.captchaExpiresSeconds,
      randomPercent: blog.randomPercent,
      allowMobile: blog.allowMobile,
      previewHeight: blog.previewHeight || 480,
      protectionMode: normalizeProtectionMode(blog.protectionMode),
      whitelistRulesText: formatRuleLines(blog.whitelistRules),
      protectionRulesText: formatRuleLines(blog.protectionRules),
      enabled: blog.enabled,
    });
    setShowForm(true);
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...form,
      whitelistRules: parseRuleLines(form.whitelistRulesText),
      protectionRules: parseRuleLines(form.protectionRulesText),
    };
    const res = await fetch(editing ? `/api/admin/blogs/${editing.id}` : "/api/admin/blogs", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "保存失败");
      return;
    }
    setShowForm(false);
    await loadBlogs();
  }

  async function remove(id: string) {
    if (!confirm("确定删除该博客配置？")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    await loadBlogs();
  }

  async function batchDelete() {
    if (selected.length === 0) return;
    if (!confirm(`确定删除选中的 ${selected.length} 条配置？`)) return;
    await fetch("/api/admin/blogs/batch-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    await loadBlogs();
  }

  const usage = useMemo(() => {
    if (!usageBlog) return null;
    return {
      html: buildHtmlUsage(usageBlog),
      hexo: buildHexoUsage(usageBlog),
      reply: buildWechatReply(usageBlog.blogId),
    };
  }, [usageBlog]);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    alert("已复制");
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-blue-500">博客注册</div>
      <div className="bg-white p-4 shadow-sm">
        <div className="mb-4 flex gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="博客名称" className="h-9 w-60 rounded border border-slate-300 px-3 text-sm" />
          <button onClick={loadBlogs} className="h-9 rounded border border-slate-300 px-5 text-sm">查询</button>
          <button onClick={openCreate} className="h-9 rounded bg-blue-500 px-5 text-sm text-white">新增</button>
          <button onClick={batchDelete} className="h-9 rounded bg-rose-400 px-5 text-sm text-white">批量删除</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="border p-3"><input type="checkbox" checked={blogs.length > 0 && selected.length === blogs.length} onChange={(e) => setSelected(e.target.checked ? blogs.map((b) => b.id) : [])} /></th>
                {currentUser.role === "SUPER_ADMIN" && <th className="border p-3">所属用户</th>}
                <th className="border p-3">博客 ID</th>
                <th className="border p-3">博客类型</th>
                <th className="border p-3">博客名称</th>
                <th className="border p-3">博客域名</th>
                <th className="border p-3">微信公众号名称</th>
                <th className="border p-3">回复关键词</th>
                <th className="border p-3">二维码图片</th>
                <th className="border p-3">解锁有效天数</th>
                <th className="border p-3">验证码有效时间</th>
                <th className="border p-3">保护模式</th>
                <th className="border p-3">状态</th>
                <th className="border p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="text-center text-slate-700">
                  <td className="border p-3"><input type="checkbox" checked={selected.includes(blog.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, blog.id] : selected.filter((id) => id !== blog.id))} /></td>
                  {currentUser.role === "SUPER_ADMIN" && <td className="border p-3">{blog.owner?.name || "-"}</td>}
                  <td className="border p-3 whitespace-nowrap">{blog.blogId}</td>
                  <td className="border p-3"><span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-500">{blog.type}</span></td>
                  <td className="border p-3">{blog.name}</td>
                  <td className="border p-3 text-blue-500">{shortText(blog.domain, 36)}</td>
                  <td className="border p-3">{blog.officialAccountName}</td>
                  <td className="border p-3">{blog.replyKeyword}</td>
                  <td className="border p-3 text-blue-500">{shortText(blog.qrcodeUrl, 36)}</td>
                  <td className="border p-3">{blog.unlockExpiresDays} 天</td>
                  <td className="border p-3">{Math.floor(blog.captchaExpiresSeconds / 60)} 分钟</td>
                  <td className="border p-3">{protectionModeText(blog.protectionMode || "all")}</td>
                  <td className="border p-3">{blog.enabled ? "启用" : "禁用"}</td>
                  <td className="border p-3 whitespace-nowrap">
                    <button onClick={() => setUsageBlog(blog)} className="mr-3 text-blue-500">使用</button>
                    <button onClick={() => openEdit(blog)} className="mr-3 text-blue-500">修改</button>
                    <button onClick={() => remove(blog.id)} className="text-blue-500">删除</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={14} className="p-10 text-center text-slate-400">暂无数据</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <AdminModal
          as="form"
          title={editing ? "修改" : "新增"}
          size="wide"
          onClose={() => setShowForm(false)}
          onSubmit={save}
          footer={
            <>
              <button type="button" onClick={() => setShowForm(false)} className="rounded border px-5 py-2">取消</button>
              <button className="rounded bg-blue-500 px-5 py-2 text-white">确定</button>
            </>
          }
        >
            <div className="grid gap-4">
              <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">* 博客类型</span><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded border px-3 py-2"><option value="website">website</option><option value="hexo">hexo</option></select></label>
              {editing && <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">* 博客 ID</span><input value={editing.blogId} disabled className="rounded border bg-slate-50 px-3 py-2" /></label>}
              <Field label="* 博客名称" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <Field label="* 博客域名" value={form.domain} placeholder="https://www.example.com" onChange={(value) => setForm({ ...form, domain: value })} />
              <Field label="* 微信公众号名称" value={form.officialAccountName} onChange={(value) => setForm({ ...form, officialAccountName: value })} />
              <Field label="* 微信公众号回复关键词" value={form.replyKeyword} onChange={(value) => setForm({ ...form, replyKeyword: value })} />
              <Field label="* 微信公众号二维码图片" value={form.qrcodeUrl} placeholder="https://www.example.com/wx/qrcode.png" onChange={(value) => setForm({ ...form, qrcodeUrl: value })} />
              <NumberField label="* 解锁后凭证的有效天数" value={form.unlockExpiresDays} onChange={(value) => setForm({ ...form, unlockExpiresDays: value })} />
              <NumberField label="* 验证码的有效时间（秒）" value={form.captchaExpiresSeconds} onChange={(value) => setForm({ ...form, captchaExpiresSeconds: value })} />
              <NumberField label="* 随机引流概率" value={form.randomPercent} onChange={(value) => setForm({ ...form, randomPercent: value })} />
              <NumberField label="* 预览高度（px）" value={form.previewHeight} onChange={(value) => setForm({ ...form, previewHeight: value })} />
              <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">保护模式</span><select value={form.protectionMode} onChange={(e) => setForm({ ...form, protectionMode: e.target.value as ProtectionMode })} className="rounded border px-3 py-2"><option value="all">全部保护</option><option value="rules">按规则保护</option><option value="off">关闭保护</option></select></label>
              <TextareaField label="白名单规则" value={form.whitelistRulesText} placeholder={"/about/\nprefix:/public/\nexact:https://example.com/about/"} onChange={(value) => setForm({ ...form, whitelistRulesText: value })} />
              <TextareaField label="保护规则" value={form.protectionRulesText} placeholder={"/posts/private/\nprefix:/vip/\ncontains:?locked=true"} onChange={(value) => setForm({ ...form, protectionRulesText: value })} />
              <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">允许移动端</span><input type="checkbox" checked={form.allowMobile} onChange={(e) => setForm({ ...form, allowMobile: e.target.checked })} className="h-4 w-4" /></label>
            </div>
            <p className="mt-4 rounded bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-500">规则每行一条；不写前缀时默认按 contains 匹配。支持 exact:、prefix:、contains:。白名单命中后直接看；按规则保护模式下，保护规则命中才需要校验。</p>
            {error && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        </AdminModal>
      )}

      {usageBlog && usage && (
        <AdminModal
          title="使用"
          size="xl"
          onClose={() => setUsageBlog(null)}
          footer={
            <>
              <button onClick={() => setUsageBlog(null)} className="rounded border px-5 py-2">取消</button>
              <button onClick={() => copy(usage.html)} className="rounded bg-blue-500 px-5 py-2 text-white">复制 HTML 代码</button>
              <button onClick={() => copy(usage.hexo)} className="rounded bg-blue-500 px-5 py-2 text-white">复制 Hexo 配置内容</button>
              <button onClick={() => copy(usage.reply)} className="rounded bg-blue-500 px-5 py-2 text-white">复制公众号消息内容</button>
            </>
          }
        >
            <Alert text="以下 HTML 代码用于博客手动整合微信公众号的引流工具，你可以将 HTML 代码添加到博客文章页面的底部。不同主题可按需修改 selector 为正文容器。" />
            <CodeBlock code={usage.html} />
            <Alert text="Hexo 静态博客可参考以下 YAML 配置内容。不同主题正文容器不同，如果默认 article 不生效，请改成主题的正文选择器。" />
            <CodeBlock code={usage.hexo} />
            <Alert text="以下文本是微信公众号自动回复的消息内容，关注公众号的人就是靠它来获取博客解锁的验证码。" />
            <CodeBlock code={usage.reply} />
        </AdminModal>
      )}
    </div>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">{label}</span><input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="rounded border border-slate-300 px-3 py-2" /></label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="grid grid-cols-[170px_1fr] items-center gap-3 text-sm"><span className="text-right text-slate-600">{label}</span><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded border border-slate-300 px-3 py-2" /></label>;
}

function TextareaField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <label className="grid grid-cols-[170px_1fr] items-start gap-3 text-sm"><span className="pt-2 text-right text-slate-600">{label}</span><textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="min-h-24 rounded border border-slate-300 px-3 py-2 font-mono text-sm" /></label>;
}

function Alert({ text }: { text: string }) {
  return <div className="mb-3 rounded bg-green-50 px-4 py-3 text-sm text-green-600">提示：{text}</div>;
}

function CodeBlock({ code }: { code: string }) {
  return <pre className="admin-clean-scrollbar mb-4 max-h-[360px] overflow-auto whitespace-pre-wrap rounded bg-[#282828] p-4 text-sm leading-7 text-emerald-200">{code}</pre>;
}
