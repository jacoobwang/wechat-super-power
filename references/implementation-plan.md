# Wechat Super Power Implementation Plan

## 1. Scope

本项目聚焦两个核心能力：

1. 搜索微信公众号文章列表
2. 根据文章链接下载正文并输出 Markdown

当前阶段不写业务代码，只定义实现边界、模块职责和接口约定。

## 2. Product Goals

### Goal A: 搜索结果可直接消费

用户输入关键词后，应返回一组结构化文章列表，便于继续选择、下载或二次处理。

### Goal B: Markdown 输出稳定

用户输入文章链接后，应尽可能保留正文结构，输出可读、可复制、可存档的 Markdown。

## 3. Proposed Project Structure

```text
.
├── README.md
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   └── implementation-plan.md
└── scripts/
    ├── search_wechat.js          # 搜索脚本
    ├── skill-entry.js            # 后续统一入口
    ├── fetch_wechat_article.js   # 文章抓取与 Markdown 转换
    └── utils/
        ├── parser.js
        ├── normalizer.js
        └── errors.js
```

说明：

- 当前已经采用轻量脚本方式实现搜索和抓取
- 后续如果复杂度继续增加，可以再拆出 `utils/`

## 4. Functional Design

### 4.1 搜索列表功能

#### 输入

- `keyword`: 必填，搜索关键词
- `page`: 可选，页码
- `limit`: 可选，期望返回数量

#### 处理流程

1. 校验输入参数
2. 调用 `search_wechat.js`
3. 读取脚本输出
4. 将输出转换为统一的数据结构
5. 返回文章列表

#### 输出结构建议

```json
{
  "keyword": "AI",
  "page": 1,
  "items": [
    {
      "title": "文章标题",
      "summary": "文章摘要",
      "account_name": "公众号名",
      "publish_time": "2026-04-04",
      "url": "https://..."
    }
  ]
}
```

#### 风险点

- `search_wechat.js` 的输出可能因为页面结构变化而字段缺失
- 搜索结果字段可能缺失或命名不一致
- 结果可能包含广告、失效链接或重复项

### 4.2 下载文章内容并转 Markdown

#### 输入

- `url`: 必填，微信文章链接

#### 处理流程

1. 校验链接合法性
2. 请求文章页面
3. 解析标题、作者、发布时间、正文节点
4. 清洗无关内容
5. 转换为 Markdown
6. 返回结构化结果

#### 输出结构建议

```json
{
  "title": "文章标题",
  "author": "作者名",
  "publish_time": "2026-04-04",
  "source_url": "https://...",
  "markdown": "# 文章标题\n\n正文内容"
}
```

#### Markdown 转换规则建议

- 标题映射为 `#`、`##` 等层级
- 正文段落保留自然换行
- 列表转换为 `-` 或有序列表
- 图片优先保留原始 URL
- 引用块转换为 `>`
- 粗体、斜体尽量保留

#### 风险点

- 微信页面结构存在变体
- 动态内容或延迟加载节点可能导致正文缺失
- 图片、公式、卡片类内容不容易完整还原
- 某些文章可能存在访问限制

## 5. Module Responsibilities

### `skill-entry.js`

- 作为统一入口
- 解析命令参数或调用参数
- 根据模式路由到搜索或下载能力

### `search_wechat.js`

- 负责原始搜索
- 不建议在 skill 入口重复实现搜索逻辑
- 应通过适配层做结果标准化

### `fetch_wechat_article.js`

- 请求文章页面
- 兼容处理搜狗跳转链接
- 提取正文和元数据
- 将 HTML 转换为 Markdown

### `normalizer.js`

- 统一字段名
- 处理空值、时间格式和链接格式

### `errors.js`

- 定义统一错误类型
- 便于 skill 输出清晰的失败原因

## 6. Interface Contract

建议后续统一成两种调用模式：

### Mode A: Search

```json
{
  "action": "search",
  "keyword": "大模型",
  "page": 1,
  "limit": 10
}
```

### Mode B: Fetch

```json
{
  "action": "fetch",
  "url": "https://mp.weixin.qq.com/..."
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "The provided url is invalid."
  }
}
```

## 7. Development Milestones

### Milestone 1: 搜索能力接入

- 明确 `search_whatch.js` 的调用方式
- 跑通关键词搜索
- 统一输出结构

### Milestone 2: 文章抓取能力

- 跑通文章链接请求
- 提取正文和元数据

### Milestone 3: Markdown 转换

- 建立内容块模型
- 完成常见节点到 Markdown 的映射

### Milestone 4: 稳定性补强

- 异常处理
- 空内容兜底
- 重复内容清洗
- 基础测试样例

## 8. Open Questions

当前最需要确认的是：

1. 是否需要继续支持搜狗中转链接自动解析真实地址
2. 下载文章时是否允许依赖无头浏览器，还是保持纯 HTTP 抓取
3. Markdown 结果是否需要同时落盘为文件
4. 是否需要保留更多富文本样式，例如表格、代码块和音视频卡片

## 9. Recommended Next Step

下一步最适合先做的是增强文章页面兼容性，尤其是正文块提取、图片保留和访问受限场景的错误提示。
