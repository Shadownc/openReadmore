# 公众号引流解锁博客平台

一个类似 Readmore 的公众号引流工具平台。用户可以在后台注册自己的博客配置，系统生成一段可嵌入博客页面的 JS/CSS 代码；访客访问博客文章时，会看到“扫码关注公众号，发送关键词获取验证码”的弹窗，输入验证码后解锁文章内容，并在后台记录访问/解锁日志。

> 当前项目不接入微信公众号官方 API，不校验 openid，也不判断用户是否真实关注公众号。它的核心逻辑是：把验证码页面链接放到公众号自动回复中，引导用户关注公众号后获取验证码。

## 功能概览

### 平台功能

- 用户注册、登录、退出
- 登录验证码
- 找回密码 / 重置密码
- 超级管理员和普通用户权限隔离
- 超级管理员查看用户列表、启用/禁用用户、重置用户密码
- 普通用户只能管理自己的博客配置和浏览记录

### 博客引流功能

- 注册博客配置
- 配置博客类型、博客名称、博客域名
- 配置微信公众号名称、回复关键词、二维码图片
- 配置验证码有效时间
- 配置解锁凭证有效天数
- 配置随机引流概率
- 生成普通 HTML 集成代码
- 生成 Hexo 配置内容
- 生成公众号自动回复内容
- 提供验证码生成页面
- 提供可嵌入第三方博客的 `readmore.js` / `readmore.css`
- 记录访问 IP、UA、文章链接、文章标题、解锁结果

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6
- MySQL
- bcryptjs
- zod

## 目录结构

```text
src/
  app/
    admin/                    后台页面
    api/                      API 接口
    forgot-password/          找回密码页
    login/                    登录页
    readmore/captcha/generate 公众号自动回复打开的验证码页
    register/                 注册页
    reset-password/           重置密码页
  components/                 React 组件
  lib/                        数据库、认证、验证码、token、工具函数
public/
  login-bg.svg                登录页背景图
  readmore/readmore.js        博客端嵌入插件脚本
  readmore/readmore.css       博客端嵌入插件样式
prisma/
  schema.prisma               Prisma 数据模型
  seed-super-admin.js         初始化超级管理员脚本
```

## 环境要求

推荐环境：

- Node.js 20.19+ 或 22.13+
- npm 9+
- MySQL 5.7+ / MySQL 8+

> 不建议使用过旧 Node 版本。Next.js 16 和部分依赖对 Node 版本有要求。

## 本地开发步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 创建 MySQL 数据库

登录 MySQL 后执行：

```sql
CREATE DATABASE wxgzh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量

复制环境变量示例：

```bash
cp .env.example .env
```

然后修改 `.env`：

```env
DATABASE_URL="mysql://root:你的密码@localhost:3306/wxgzh"
APP_URL="http://localhost:3000"
SESSION_SECRET="replace-with-a-long-random-session-secret"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="admin123456"
SUPER_ADMIN_NAME="超级管理员"
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `DATABASE_URL` | MySQL 连接地址 |
| `APP_URL` | 当前应用访问地址，用于生成公众号自动回复链接和重置密码链接 |
| `SESSION_SECRET` | 登录态、验证码、签名 token 使用的密钥，生产环境必须换成长随机字符串 |
| `SUPER_ADMIN_EMAIL` | 初始化超级管理员邮箱 |
| `SUPER_ADMIN_PASSWORD` | 初始化超级管理员密码 |
| `SUPER_ADMIN_NAME` | 初始化超级管理员名称 |

MySQL 连接串格式：

```text
mysql://用户名:密码@主机:端口/数据库名
```

例如：

```env
DATABASE_URL="mysql://root:123456@localhost:3306/wxgzh"
```

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. 创建数据库表

```bash
npm run prisma:migrate
```

执行时 Prisma 会提示输入迁移名称，可以输入：

```text
init
```

### 6. 初始化超级管理员

```bash
npm run seed:super-admin
```

成功后可以用 `.env` 中配置的超级管理员账号登录后台。

### 7. 启动开发服务

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

后台登录：

```text
http://localhost:3000/login
```

## 常用命令

```bash
# 启动开发服务
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm run start

# ESLint 检查
npm run lint

# TypeScript 类型检查
npm run typecheck

# 生成 Prisma Client
npm run prisma:generate

# 执行数据库迁移
npm run prisma:migrate

# 初始化或重置超级管理员
npm run seed:super-admin
```

## 使用说明

### 1. 登录后台

访问：

```text
/login
```

使用超级管理员账号登录，或注册普通用户。

### 2. 新增博客配置

进入后台：

```text
/admin/blogs
```

点击“新增”，填写：

- 博客类型：`website` 或 `hexo`
- 博客名称
- 博客域名
- 微信公众号名称
- 微信公众号回复关键词，例如：`验证码`
- 微信公众号二维码图片 URL
- 解锁后凭证有效天数
- 验证码有效时间，单位秒
- 随机引流概率
- 是否允许移动端

保存后会生成一个唯一的博客 ID。

### 3. 获取集成代码

在博客注册列表点击“使用”，系统会展示三段内容：

1. 普通博客 HTML 代码
2. Hexo 配置内容
3. 公众号自动回复内容

普通博客 HTML 代码类似：

```html
<link href="https://你的域名/readmore/readmore.css" type="text/css" rel="stylesheet">
<script src="https://你的域名/readmore/readmore.js" type="text/javascript"></script>
<script>
  var plugin = new ReadmorePlugin()
  plugin.init({
    id: "readmore-container",
    blogId: "你的博客ID",
    name: "公众号名称",
    keyword: "验证码",
    qrcode: "公众号二维码图片地址",
    type: "website",
    height: "auto",
    expires: "7",
    interval: "300",
    random: "100"
  })
</script>
```

把这段代码放到博客文章页面底部即可。

### 4. 配置公众号自动回复

公众号后台配置关键词自动回复，关键词例如：

```text
验证码
```

回复内容使用后台“使用”弹窗中生成的内容，格式类似：

```html
<a href="https://你的域名/readmore/captcha/generate?blogId=你的博客ID">点击链接，获取博客解锁验证码</a>
```

用户关注公众号并发送关键词后，点击这个链接即可看到验证码。

### 5. 访客解锁流程

1. 访客打开博客文章。
2. 博客页面加载 `readmore.js`。
3. 插件弹出公众号二维码和验证码输入框。
4. 访客关注公众号，发送关键词。
5. 公众号自动回复验证码页面链接。
6. 访客打开验证码页面，复制验证码。
7. 回到博客弹窗输入验证码。
8. 验证成功后关闭弹窗，并在本地保存解锁凭证。
9. 后台记录访问和解锁日志。

## 权限说明

### 超级管理员

超级管理员可以：

- 查看所有用户
- 启用 / 禁用用户
- 重置用户密码
- 删除用户
- 查看所有博客配置
- 查看所有浏览记录

超级管理员不能通过注册产生，只能通过：

```bash
npm run seed:super-admin
```

根据 `.env` 中的配置初始化。

### 普通用户

普通用户可以：

- 注册账号
- 登录后台
- 新增自己的博客配置
- 修改自己的博客配置
- 查看自己的使用说明
- 查看自己博客产生的浏览记录

普通用户不能查看或修改其他用户的数据。

## 验证码说明

### 登录验证码

登录页验证码由服务端生成 SVG 图片，并通过 HttpOnly Cookie 保存签名后的验证码结果。

相关文件：

- `src/app/api/auth/captcha/route.ts`
- `src/lib/login-captcha.ts`
- `src/app/api/auth/login/route.ts`

### 博客解锁验证码

博客解锁验证码根据博客 ID、博客密钥和时间窗口生成。

特点：

- 每个博客有独立验证码密钥
- 默认验证码有效时间由后台配置
- 校验时允许当前时间窗口和上一个时间窗口，避免刚刷新导致用户输入失败
- 验证成功后返回解锁 token，插件保存在访客浏览器 localStorage 中

相关文件：

- `src/lib/captcha.ts`
- `src/app/api/readmore/captcha/current/route.ts`
- `src/app/api/readmore/captcha/verify/route.ts`
- `src/app/readmore/captcha/generate/page.tsx`

## 找回密码说明

当前找回密码流程为开发可用版本：

1. 用户在 `/forgot-password` 输入邮箱。
2. 如果邮箱存在，系统生成一个 30 分钟有效的重置链接。
3. 开发环境会直接在页面展示重置链接。
4. 用户打开 `/reset-password?token=xxx` 设置新密码。

> 正式上线时，建议接入邮件服务，把重置链接发送到用户邮箱，而不是直接展示在页面上。

## 部署说明

### 1. 服务器准备

服务器需要安装：

- Node.js 20.19+ 或 22.13+
- MySQL
- npm
- 反向代理服务，例如 Nginx

### 2. 上传代码并安装依赖

```bash
npm install
```

### 3. 配置生产环境变量

生产环境 `.env` 示例：

```env
DATABASE_URL="mysql://用户名:密码@127.0.0.1:3306/wxgzh"
APP_URL="https://你的域名"
SESSION_SECRET="请换成至少32位以上的随机字符串"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="请换成强密码"
SUPER_ADMIN_NAME="超级管理员"
```

注意：

- `APP_URL` 必须是公网可访问域名。
- 如果要让公众号自动回复链接可用，必须使用公网域名。
- 生产环境建议使用 HTTPS。
- `SESSION_SECRET` 不要使用示例值。

### 4. 初始化数据库

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed:super-admin
```

### 5. 构建项目

```bash
npm run build
```

### 6. 启动项目

直接启动：

```bash
npm run start
```

默认监听：

```text
http://localhost:3000
```

生产环境建议用 PM2：

```bash
npm install -g pm2
pm2 start npm --name wxgzh -- start
pm2 save
```

### 7. Nginx 反向代理示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

如果使用 HTTPS，建议用 Certbot 或云厂商证书配置 SSL。

## 部署到 Vercel 的注意事项

理论上可以部署到 Vercel，但需要注意：

- MySQL 必须是公网可访问数据库。
- `DATABASE_URL` 要配置到 Vercel 环境变量中。
- `APP_URL` 要设置成 Vercel 分配的域名或自定义域名。
- 国内公众号用户访问 Vercel 可能不稳定，建议部署到国内服务器。

## 数据库迁移说明

开发过程中修改 `prisma/schema.prisma` 后，需要执行：

```bash
npm run prisma:migrate
npm run prisma:generate
```

如果只是重新生成 Prisma Client：

```bash
npm run prisma:generate
```

如果在 Windows 下遇到 Prisma 引擎 DLL 被占用，例如：

```text
EPERM: operation not permitted, rename query_engine-windows.dll.node.tmp -> query_engine-windows.dll.node
```

通常是 dev/build/node 进程占用了 Prisma 引擎。可以：

1. 停止 `npm run dev`。
2. 确认没有 node 进程占用。
3. 再执行：

```bash
npm run prisma:generate
```

必要时删除临时文件：

```bash
rm -f node_modules/.prisma/client/query_engine-windows.dll.node.tmp*
```

## 安全注意事项

当前项目适合公众号引流场景，不适合作为严格付费墙。

原因：

- 没有接入微信公众号 openid。
- 不能判断用户是否真实关注公众号。
- 验证码页面链接被分享后，其他人也可能访问。

生产环境建议：

- 使用 HTTPS。
- 使用强 `SESSION_SECRET`。
- 超级管理员密码必须足够复杂。
- MySQL 不要暴露到公网，或限制访问来源 IP。
- 生产环境找回密码应接入邮件服务。
- 对验证码接口增加更严格的频率限制。
- 定期清理过期 session 和历史浏览记录。

## 常见问题

### 1. 登录提示验证码错误

验证码每次刷新都会写入新的 HttpOnly Cookie。请确保：

- 浏览器允许 Cookie。
- 登录页验证码图片已经正常加载。
- 输入验证码时不区分大小写。
- 不要打开多个登录页交叉使用验证码。

### 2. 生成重置链接失败

先检查数据库连接是否正常：

```bash
npm run prisma:migrate
npm run prisma:generate
```

再重启开发服务：

```bash
npm run dev
```

### 3. 公众号自动回复链接打开 404

检查后台生成的链接是否使用了正确的 `APP_URL`。

如果 `.env` 中是：

```env
APP_URL="http://localhost:3000"
```

那么生成的链接也会是 localhost，公众号用户无法访问。

生产环境必须改成：

```env
APP_URL="https://你的域名"
```

### 4. 博客页面没有弹窗

检查：

- 是否正确引入 `readmore.css`。
- 是否正确引入 `readmore.js`。
- `blogId` 是否正确。
- 博客配置是否启用。
- 该浏览器是否已经解锁过，localStorage 中可能已有解锁凭证。
- 随机引流概率是否不是 100%。
- 是否设置了不允许移动端。

### 5. 输入博客解锁验证码失败

检查：

- 是否打开了正确 `blogId` 的验证码页面。
- 验证码是否已过期。
- 博客后台配置的验证码有效时间是否过短。
- 系统时间是否异常。

## 后续可扩展方向

- 接入邮件服务，正式发送找回密码邮件
- 接入微信公众号 OAuth / openid
- 增加真实关注状态校验
- 增加接口频率限制
- 增加操作审计日志
- 增加数据统计看板
- 增加多站点 / 多公众号支持
- 增加插件主题配置
- 增加 Docker Compose 一键启动 MySQL + 应用

## 重要声明

本项目的公众号引流方式依赖“公众号自动回复中提供验证码链接”，不等同于微信公众号官方关注校验。如果业务需要严格判断用户是否关注公众号，需要接入微信公众号开发者能力，包括 openid、扫码事件、网页授权或用户信息接口等。