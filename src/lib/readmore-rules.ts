export type ArticleRule = {
  type: "exact" | "prefix" | "contains";
  value: string;
};

export type ProtectionMode = "off" | "all" | "rules";

type RuleInput = unknown;

type RuleDecision = {
  protected: boolean;
  reason: "protected" | "whitelist" | "off" | "rules_bypass";
};

function normalizeRules(input: RuleInput): ArticleRule[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((rule) => {
      if (!rule || typeof rule !== "object") return null;
      const candidate = rule as { type?: unknown; value?: unknown };
      if (candidate.type !== "exact" && candidate.type !== "prefix" && candidate.type !== "contains") return null;
      if (typeof candidate.value !== "string") return null;
      const value = candidate.value.trim();
      if (!value) return null;
      return { type: candidate.type, value };
    })
    .filter((rule): rule is ArticleRule => Boolean(rule));
}

function normalizeUrlVariants(articleUrl: string) {
  const raw = articleUrl.trim();
  if (!raw) return [];
  try {
    const url = new URL(raw);
    url.hash = "";
    const full = url.toString();
    const path = `${url.pathname}${url.search}`;
    const withoutTrailingSlash = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    return Array.from(new Set([full, full.endsWith("/") ? full.slice(0, -1) : full, path, withoutTrailingSlash, raw]));
  } catch {
    return [raw, raw.endsWith("/") ? raw.slice(0, -1) : raw];
  }
}

function matchesRule(rule: ArticleRule, variants: string[]) {
  return variants.some((value) => {
    if (rule.type === "exact") return value === rule.value;
    if (rule.type === "prefix") return value.startsWith(rule.value);
    return value.includes(rule.value);
  });
}

function matchesAnyRule(rules: ArticleRule[], articleUrl: string) {
  const variants = normalizeUrlVariants(articleUrl);
  return rules.some((rule) => matchesRule(rule, variants));
}

export function evaluateReadmoreProtection(options: {
  protectionMode?: string | null;
  whitelistRules?: RuleInput;
  protectionRules?: RuleInput;
  articleUrl: string;
}): RuleDecision {
  const mode = options.protectionMode === "off" || options.protectionMode === "rules" ? options.protectionMode : "all";
  if (mode === "off") return { protected: false, reason: "off" };

  const whitelistRules = normalizeRules(options.whitelistRules);
  if (matchesAnyRule(whitelistRules, options.articleUrl)) return { protected: false, reason: "whitelist" };

  if (mode === "all") return { protected: true, reason: "protected" };

  const protectionRules = normalizeRules(options.protectionRules);
  if (matchesAnyRule(protectionRules, options.articleUrl)) return { protected: true, reason: "protected" };

  return { protected: false, reason: "rules_bypass" };
}
