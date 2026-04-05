---
name: wechat-super-power
description: 当用户需要搜索微信公众号文章列表，或输入文章链接并提取正文转换为 Markdown 时使用。适用于“按关键词搜索文章”“返回文章候选列表”“下载文章内容”“把微信文章整理成 markdown”等场景。
---

# Wechat Super Power

## Overview

这个 skill 用于处理微信公众号文章的两类任务：

1. 调用既有搜索脚本获取文章列表
2. 输入文章链接并输出结构化 Markdown

## Core Capabilities

### 1. Search Article List

当用户提供关键词时，调用 `search_wechat.js` 获取文章列表，并返回适合后续选择的结构化结果。

推荐输出字段：

- `title`
- `summary`
- `account_name`
- `publish_time`
- `url`

### 2. Fetch Article As Markdown

当用户提供文章链接时，抓取文章页面，提取正文、标题、作者、发布时间等信息，并转换为 Markdown 返回。

推荐输出字段：

- `title`
- `author`
- `publish_time`
- `source_url`
- `markdown`

## Workflow

### 搜索流程

1. 接收关键词和可选分页参数
2. 调用 `search_whatch.js`
3. 标准化脚本输出
4. 返回文章列表

### 下载流程

1. 接收文章链接
2. 抓取页面内容
3. 解析正文和元数据
4. 转换为 Markdown
5. 返回结构化结果

## Implementation Notes

- `search_wechat.js` 提供搜索能力，输出需要标准化
- `fetch_wechat_article.js` 负责抓取文章内容并转换为 Markdown
- 下载文章时需要处理正文节点、图片、引用、分隔符、换行和异常内容
- Markdown 输出要尽量保留标题层级、段落、列表和图片链接
- 如果页面无法访问、正文为空或链接无效，需要返回明确错误信息

## References

- 详细实现方案见 `references/implementation-plan.md`
