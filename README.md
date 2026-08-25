# Jacl's Blog

基于 [Astro Nano](https://github.com/markhorn-dev/astro-nano) 构建的个人技术博客，内容主要涉及量化开发、交易系统与工程实践。

## 本地开发

```bash
make install
make dev
```

本地访问 `http://localhost:4321`。

## 构建与部署

```bash
make build
make deploy MSG="chore: update blog"
```

`make deploy` 会构建、提交并推送 `main` 分支，随后由 GitHub Actions 发布到 GitHub Pages。

## License

MIT
