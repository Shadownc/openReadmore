import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("请输入正确邮箱"),
  name: z.string().min(1, "请输入昵称").max(40),
  password: z.string().min(8, "密码至少 8 位"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  captcha: z.string().min(1, "请输入验证码"),
});

const articleRuleSchema = z.object({
  type: z.enum(["exact", "prefix", "contains"]),
  value: z.string().min(1).max(500),
});

export const blogSchema = z.object({
  type: z.enum(["website", "hexo"]),
  name: z.string().min(1, "请输入博客名称"),
  domain: z.string().url("请输入完整博客域名，例如 https://example.com"),
  officialAccountName: z.string().min(1, "请输入公众号名称"),
  replyKeyword: z.string().min(1, "请输入回复关键词"),
  qrcodeUrl: z.string().url("请输入公众号二维码图片地址"),
  unlockExpiresDays: z.coerce.number().int().min(1).max(3650),
  captchaExpiresSeconds: z.coerce.number().int().min(30).max(86400),
  randomPercent: z.coerce.number().int().min(1).max(100),
  allowMobile: z.coerce.boolean().default(false),
  previewHeight: z.coerce.number().int().min(120).max(3000).default(480),
  protectionMode: z.enum(["off", "all", "rules"]).default("all"),
  whitelistRules: z.array(articleRuleSchema).default([]),
  protectionRules: z.array(articleRuleSchema).default([]),
  enabled: z.coerce.boolean().default(true),
});
