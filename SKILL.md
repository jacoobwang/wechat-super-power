---
name: wechat-super-power
description: 当用户需要搜索微信公众号文章列表，或输入文章链接并提取正文转换为 Markdown 时使用。适用于“按关键词搜索文章”“返回文章候选列表”“下载文章内容”“把文章整理成 markdown 并入库”等场景。
---

# Wechat Super Power

## Overview

这个 skill 用于处理文章搜索、抓取与入库的四类任务，并且应直接通过本目录下的脚本执行：

1. 调用既有搜索脚本获取文章列表
2. 输入文章链接并输出结构化 Markdown
3. 输入 topic，先搜索候选文章，再自动串行下载正文并生成知识库目录
4. 输入文章链接，将文章 Markdown 落盘到目录

## When To Use

在这些场景下应该使用本 skill：

- 用户要按关键词搜索微信公众号文章
- 用户要先拿到文章候选列表，再决定抓哪一篇
- 用户给了微信文章链接，希望提取正文并转成 Markdown
- 用户要围绕某个 topic 搭建文档知识库
- 用户已经拿到文章链接，希望批量入库
- 用户提到“微信公众号”“微信文章”“mp.weixin.qq.com”“搜狗微信搜索”“转 markdown”

## How To Execute

始终在 skill 根目录执行下面的命令。

### Search

当用户要搜索文章列表时，运行：

```bash
node scripts/skill-entry.js search "<关键词>" --limit <数量>
```

示例：

```bash
node scripts/skill-entry.js search "人工智能" --limit 5
```

### Fetch

当用户要抓取文章正文并转 Markdown 时，运行：

```bash
node scripts/skill-entry.js fetch "<文章链接>"
```

示例：

```bash
node scripts/skill-entry.js fetch "https://mp.weixin.qq.com/..."
```

### Build Knowledge Base

当用户要根据 topic 搭建知识库并自动下载文章时，运行：

```bash
node scripts/skill-entry.js build-kb "<topic>" --limit <数量> --delay 3000 --output-dir <目录>
```

示例：

```bash
node scripts/skill-entry.js build-kb "AI Agent" --limit 5 --delay 3000 --output-dir "./knowledge-base"
```

### Save Articles

当用户已经拿到文章链接并要保存到知识库时，运行：

```bash
node scripts/skill-entry.js save-articles "<topic>" "<链接1>" "<链接2>" --output-dir <目录>
```

示例：

```bash
node scripts/skill-entry.js save-articles "AI Agent" "https://mp.weixin.qq.com/s/xxx" --output-dir "./knowledge-base"
```

## Output Contract

### Search Output

搜索结果输出为 JSON，对外重点使用这些字段：

- `title`
- `summary`
- `account_name`
- `publish_time`
- `url`

实际顶层结构：

```json
{
  "action": "search",
  "keyword": "人工智能",
  "total": 5,
  "items": []
}
```

### Fetch Output

抓取结果输出为 JSON，对外重点使用这些字段：

- `title`
- `author`
- `publish_time`
- `source_url`
- `markdown`

实际顶层结构：

```json
{
  "action": "fetch",
  "title": "文章标题",
  "author": "公众号或作者",
  "publish_time": "2026-04-05 10:00:00",
  "source_url": "https://mp.weixin.qq.com/...",
  "markdown": "# 标题\\n\\n正文"
}
```

### Build Knowledge Base Output

知识库搭建输出为 JSON，对外重点使用这些字段：

- `topic`
- `output_dir`
- `saved_count`
- `failed_count`
- `saved_articles`
- `failed_articles`

### Save Articles Output

文章入库输出为 JSON，对外重点使用这些字段：

- `topic`
- `output_dir`
- `saved_count`
- `failed_count`
- `saved_articles`
- `failed_articles`

## Workflow

### 搜索流程

1. 接收用户关键词和结果数量
2. 运行 `node scripts/skill-entry.js search "<关键词>" --limit <数量>`
3. 读取 JSON 输出
4. 将 `items` 返回给用户，必要时保留原始 `url` 供后续抓取

### 下载流程

1. 接收文章链接
2. 运行 `node scripts/skill-entry.js fetch "<文章链接>"`
3. 读取 JSON 输出
4. 优先返回 `title`、`author`、`publish_time`、`markdown`

### 知识库搭建流程

1. 接收 topic、结果数量、输出目录
2. 运行 `node scripts/skill-entry.js build-kb "<topic>" --limit <数量> --delay 3000 --output-dir <目录>`
3. 先搜索候选列表并写入 `search-results.json`
4. 对每条候选结果调用 `fetch_wechat_article` 抓取正文
5. 每篇之间暂停约 3 秒，降低反爬风险
6. 将 Markdown 存入 topic 目录并返回结果摘要

### 文章入库流程

1. 接收 topic、一个或多个文章链接、输出目录
2. 运行 `node scripts/skill-entry.js save-articles "<topic>" "<链接1>" "<链接2>" --output-dir <目录>`
3. 微信文章通过 `fetch_wechat_article` 抓取，其他网站走通用正文提取
4. 将 Markdown 存入 topic 目录并返回结果摘要

## Error Handling

如果命令执行失败，优先保留脚本原始错误语义。当前常见错误包括：

- `缺少搜索关键词`
- `缺少文章链接`
- `Unsupported URL host, expected mp.weixin.qq.com or weixin.sogou.com`
- `Sogou antispider blocked URL resolution`
- `Article requires WeChat captcha verification`
- `Article content was empty after Markdown conversion`
- `知识库搭建失败: ...`
- `文章入库失败: ...`

遇到这些错误时，不要伪造正文内容，应明确告诉用户抓取失败原因。

## Notes For Agent

- 搜索能力由 `scripts/search_wechat.js` 提供，统一入口是 `scripts/skill-entry.js`
- 抓取能力由 `scripts/fetch_wechat_article.js` 提供，统一入口也是 `scripts/skill-entry.js`
- 知识库构建能力由 `scripts/build_wechat_knowledge_base.js` 提供，统一入口也是 `scripts/skill-entry.js`
- 文章入库能力由 `scripts/save_web_articles.js` 提供，微信文章内部调用 `fetch_wechat_article`
- 优先调用统一入口，除非你是在调试底层脚本
- 微信文章抓取受访问限制影响较大，出现验证码、反爬或权限限制时应直接返回错误
- Markdown 输出是基础版，目标是可读和可复制，不保证完全保真

## File Map

- `scripts/skill-entry.js`: 统一入口
- `scripts/search_wechat.js`: 搜索实现
- `scripts/fetch_wechat_article.js`: 抓取与 Markdown 转换实现
- `scripts/build_wechat_knowledge_base.js`: topic 搜索、串行抓取、写入知识库目录
- `scripts/save_web_articles.js`: 将网页文章抓取并写入 Markdown，兼容微信和常见博客页面
- `references/implementation-plan.md`: 更详细的实现方案

## Quick Response Pattern

### 搜索类请求

先运行搜索命令，再把结果按列表或 JSON 返回。

### 抓取类请求

先运行抓取命令，再优先返回这些字段：

- `title`
- `author`
- `publish_time`
- `source_url`
- `markdown`

### 知识库搭建请求

先运行 `build-kb` 命令，再优先返回这些字段：

- `topic`
- `output_dir`
- `saved_count`
- `failed_count`

### 文章入库请求

先运行 `save-articles` 命令，再优先返回这些字段：

- `topic`
- `output_dir`
- `saved_count`
- `failed_count`
