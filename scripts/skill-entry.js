#!/usr/bin/env node

const { searchWechatArticles, normalizeSearchResult } = require('./search_wechat');

function parseArgs(argv) {
  const [, , action, ...rest] = argv;
  let keyword = '';
  let limit = 10;

  for (let i = 0; i < rest.length; i += 1) {
    const value = rest[i];
    if (value === '--limit' || value === '-n') {
      limit = parseInt(rest[i + 1], 10) || 10;
      i += 1;
    } else if (!value.startsWith('-') && !keyword) {
      keyword = value;
    }
  }

  return { action, keyword, limit };
}

async function main() {
  const { action, keyword, limit } = parseArgs(process.argv);

  if (action !== 'search') {
    console.error('当前仅支持 search 动作');
    process.exit(1);
  }

  if (!keyword) {
    console.error('缺少搜索关键词');
    process.exit(1);
  }

  const articles = await searchWechatArticles(keyword, limit);
  console.log(JSON.stringify(normalizeSearchResult(keyword, articles), null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
