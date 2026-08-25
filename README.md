# JACL Blog

基于 Astro 构建的个人技术博客。

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:4321`。

## 构建与预览

```bash
npm run build
npm run preview
```

也可以使用 Make：

```bash
make dev
make build
make preview
```

## 一键提交与部署

```bash
make deploy MSG="发布新文章"
```

该命令会先检查并构建站点，然后暂存、提交全部改动并推送到 `main` 分支。GitHub Actions 收到推送后会继续部署 GitHub Pages。

不传 `MSG` 时，默认提交信息为 `chore: update blog`：

```bash
make deploy
```

可以运行 `make help` 查看全部命令。文章位于 `src/content/blog/`。
