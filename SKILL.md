---
name: wechat-super-power
description: 当用户需要搜索微信公众号文章列表，或输入文章链接并提取正文转换为 Markdown 时使用。适用于“按关键词搜索文章”“返回文章候选列表”“下载文章内容”“把微信文章整理成 markdown”等场景。
---

# Wechat Super Power

## Overview

这个 skill 用于处理微信公众号文章的两类任务，并且应直接通过本目录下的脚本执行：

1. 调用既有搜索脚本获取文章列表
2. 输入文章链接并输出结构化 Markdown

## When To Use

在这些场景下应该使用本 skill：

- 用户要按关键词搜索微信公众号文章
- 用户要先拿到文章候选列表，再决定抓哪一篇
- 用户给了微信文章链接，希望提取正文并转成 Markdown
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

## Error Handling

如果命令执行失败，优先保留脚本原始错误语义。当前常见错误包括：

- `缺少搜索关键词`
- `缺少文章链接`
- `Unsupported URL host, expected mp.weixin.qq.com or weixin.sogou.com`
- `Sogou antispider blocked URL resolution`
- `Article requires WeChat captcha verification`
- `Article content was empty after Markdown conversion`

遇到这些错误时，不要伪造正文内容，应明确告诉用户抓取失败原因。

## Notes For Agent

- 搜索能力由 `scripts/search_wechat.js` 提供，统一入口是 `scripts/skill-entry.js`
- 抓取能力由 `scripts/fetch_wechat_article.js` 提供，统一入口也是 `scripts/skill-entry.js`
- 优先调用统一入口，除非你是在调试底层脚本
- 微信文章抓取受访问限制影响较大，出现验证码、反爬或权限限制时应直接返回错误
- Markdown 输出是基础版，目标是可读和可复制，不保证完全保真

## File Map

- `scripts/skill-entry.js`: 统一入口
- `scripts/search_wechat.js`: 搜索实现
- `scripts/fetch_wechat_article.js`: 抓取与 Markdown 转换实现
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
