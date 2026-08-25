SHELL := /bin/bash
.DEFAULT_GOAL := help

BRANCH ?= source
MSG ?= chore: update blog

.PHONY: help install dev build preview clean status commit deploy

help:
	@printf '%s\n' \
		'make install                 安装锁定版本的依赖' \
		'make dev                     启动本地开发服务器' \
		'make build                   检查并构建生产版本' \
		'make preview                 构建并预览生产版本' \
		'make clean                   删除 Astro 缓存和构建结果' \
		'make status                  查看 Git 状态' \
		'make commit MSG="提交说明"   构建并提交全部改动' \
		'make deploy MSG="提交说明"   构建、提交并推送部署'

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

clean:
	rm -rf -- dist .astro

status:
	git status --short --branch

commit: build
	@current_branch="$$(git branch --show-current)"; \
	if [[ "$$current_branch" != "$(BRANCH)" ]]; then \
		echo "当前分支是 $$current_branch，请先切换到 $(BRANCH) 分支。"; \
		exit 1; \
	fi
	git add -A
	@if git diff --cached --quiet; then \
		echo '没有需要提交的改动。'; \
	else \
		git commit -m "$(MSG)"; \
	fi

deploy: commit
	git push origin "$(BRANCH)"
	@echo '已推送到 $(BRANCH)，GitHub Actions 将继续完成部署。'
