#!/usr/bin/env node

const { searchWechatArticles, normalizeSearchResult } = require('./search_wechat');
const { fetchWechatArticle } = require('./fetch_wechat_article');

function parseArgs(argv) {
  const [, , action, ...rest] = argv;
  let keyword = '';
  let limit = 10;
  let url = '';

  for (let i = 0; i < rest.length; i += 1) {
    const value = rest[i];
    if (value === '--limit' || value === '-n') {
      limit = parseInt(rest[i + 1], 10) || 10;
      i += 1;
    } else if (!value.startsWith('-')) {
      if (action === 'search' && !keyword) keyword = value;
      if (action === 'fetch' && !url) url = value;
    }
  }

  return { action, keyword, limit, url };
}

async function main() {
  const { action, keyword, limit, url } = parseArgs(process.argv);

  if (action === 'search') {
    if (!keyword) {
      console.error('缺少搜索关键词');
      process.exit(1);
    }

    const articles = await searchWechatArticles(keyword, limit);
    console.log(JSON.stringify(normalizeSearchResult(keyword, articles), null, 2));
    return;
  }

  if (action === 'fetch') {
    if (!url) {
      console.error('缺少文章链接');
      process.exit(1);
    }

    const result = await fetchWechatArticle(url);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.error('当前支持的动作: search, fetch');
  process.exit(1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
