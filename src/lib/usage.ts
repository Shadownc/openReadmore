export type UsageBlog = {
  blogId: string;
  name: string;
  type: string;
  officialAccountName: string;
  replyKeyword: string;
  qrcodeUrl: string;
  unlockExpiresDays: number;
  captchaExpiresSeconds: number;
  randomPercent: number;
  allowMobile: boolean;
  previewHeight?: number;
};

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.APP_URL || "http://localhost:3000";
}

export function getCaptchaLink(blogId: string) {
  return `${getBaseUrl()}/readmore/captcha/generate?blogId=${encodeURIComponent(blogId)}`;
}

export function getPublicAssetUrl(path: string) {
  return `${getBaseUrl()}${path}`;
}

export function buildHtmlUsage(blog: UsageBlog) {
  return `<link href="${getPublicAssetUrl("/readmore/readmore.css")}" type="text/css" rel="stylesheet">
<script src="${getPublicAssetUrl("/readmore/readmore.js")}" type="text/javascript"></script>
<script>
  var regex = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  var isMobile = navigator.userAgent.match(regex)
  if (${blog.allowMobile ? "true" : "!isMobile"}) {
    try {
      var plugin = new ReadmorePlugin()
      plugin.init({
        id: "readmore-container",
        selector: "article",
        blogId: "${blog.blogId}",
        name: "${blog.officialAccountName}",
        keyword: "${blog.replyKeyword}",
        qrcode: "${blog.qrcodeUrl}",
        type: "${blog.type}",
        articleOnly: true,
        articlePathPattern: "^/\\\\d{4}/\\\\d{2}/\\\\d{2}/",
        height: "${blog.previewHeight || 480}",
        expires: "${blog.unlockExpiresDays}",
        interval: "${blog.captchaExpiresSeconds}",
        random: "${blog.randomPercent}"
      })
    } catch (e) {
      console.warn("readmore plugin occurred error: " + e.name + " | " + e.message)
    }
  }
</script>`;
}

export function buildHexoUsage(blog: UsageBlog) {
  return `readmore:
  enable: true
  blogId: '${blog.blogId}'
  name: '${blog.officialAccountName}'
  keyword: '${blog.replyKeyword}'
  qrcode: '${blog.qrcodeUrl}'
  selector: 'article'
  articleOnly: true
  articlePathPattern: '^/\\d{4}/\\d{2}/\\d{2}/'
  height: ${blog.previewHeight || 480}
  expires: ${blog.unlockExpiresDays}
  interval: ${blog.captchaExpiresSeconds}
  random: ${blog.randomPercent}
  allowMobile: ${blog.allowMobile}`;
}

export function buildWechatReply(blogId: string) {
  return `<a href="${getCaptchaLink(blogId)}">点击链接，获取博客解锁验证码</a>`;
}
