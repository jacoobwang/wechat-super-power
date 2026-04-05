# Wechat Super Power

一个面向 OpenClaw Skills 的微信公众号文章处理 skill 项目。

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

## 在 OpenClaw 中使用

如果 OpenClaw 支持目录式 skills，推荐把这个目录安装到以下任一位置：

1. 用户级目录：`~/.agents/skills/wechat-super-power`
2. 工作区目录：`<workspace>/.agents/skills/wechat-super-power`

示例：

```bash
mkdir -p ~/.agents/skills
cp -R /Users/link/App/wechat-super-power ~/.agents/skills/wechat-super-power
```

或者：

```bash
mkdir -p /your/workspace/.agents/skills
cp -R /Users/link/App/wechat-super-power /your/workspace/.agents/skills/wechat-super-power
```

安装后，OpenClaw 侧应能发现名为 `$wechat-super-power` 的 skill。

推荐调用方式：

```text
使用 $wechat-super-power 搜索“人工智能”相关文章，返回 5 条结果
```

```text
使用 $wechat-super-power 抓取这个微信文章链接并输出 markdown：
https://mp.weixin.qq.com/...
```

说明：

- 真正决定 skill 行为的是 `SKILL.md`
- `agents/openai.yaml` 主要是界面元数据，不一定被 OpenClaw 使用
- 本项目已经把 `SKILL.md` 调整为操作型说明，agent 看到后应直接执行脚本命令

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
