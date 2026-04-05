# Wechat Super Power

一个面向 Codex/Codex Skills 的微信公众号文章处理 skill 项目骨架。

当前阶段只完成项目初始化、需求收敛和实现方案设计，暂不包含业务代码。

目前已实现第一个核心能力：搜索微信公众号文章列表。
目前已实现第二个核心能力的基础版：输入文章链接并输出 Markdown。

## 目标

这个 skill 的核心能力分为两部分：

1. 搜索列表功能
通过 `search_wechat.js` 执行搜索，返回文章列表。

2. 下载文章内容
输入文章链接，抓取正文并转换为 Markdown 返回。

## 当前目录结构

```text
.
├── README.md
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   └── implementation-plan.md
└── scripts/
    ├── .gitkeep
    ├── fetch_wechat_article.js
    ├── search_wechat.js
    └── skill-entry.js
```

## 建议的后续开发顺序

1. 已接入搜索能力并统一输出结构。
2. 已补上文章抓取与 Markdown 转换的基础版本。
3. 接下来继续增强页面兼容性和格式保真度。
4. 最后增加更多异常处理和测试样例。

## 预期输入输出

### 能力 1: 搜索文章列表

输入建议：

- `keyword`: 搜索关键词
- `page`: 页码，可选
- `limit`: 返回数量，可选

输出建议：

- 文章标题
- 摘要
- 作者或公众号名
- 发布时间
- 原始链接

命令行示例：

```bash
node scripts/skill-entry.js search "人工智能" --limit 5
node scripts/search_wechat.js "人工智能" -n 5
```

### 能力 2: 下载文章为 Markdown

输入建议：

- `url`: 文章链接

输出建议：

- `title`
- `author`
- `publish_time`
- `source_url`
- `markdown`

命令行示例：

```bash
node scripts/skill-entry.js fetch "https://mp.weixin.qq.com/..."
node scripts/fetch_wechat_article.js "https://mp.weixin.qq.com/..."
```

## 文档说明

- `SKILL.md`: skill 本体说明，供 agent 触发和执行时使用
- `references/implementation-plan.md`: 面向实现的详细方案
