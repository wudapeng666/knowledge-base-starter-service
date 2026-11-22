const corpus = [
  {
    title: "自生长知识库设计",
    date: "2026-11-22",
    source: "内部系统说明 · 公开示例",
    heading: "知识缺口闭环",
    text: "低命中查询会进入研究队列。研究结果必须保留来源、日期和限制，完成后重新入库并建立检索索引。"
  },
  {
    title: "Codex 网络配置研究",
    date: "2026-11-22",
    source: "公开文档与源码核验 · 公开示例",
    heading: "网络访问",
    text: "sandbox_workspace_write.network_access 控制 workspace-write 沙盒内命令的网络访问；审批策略与网络访问不是同一个开关。"
  },
  {
    title: "EIA 天然气库存",
    date: "2026-11-22",
    source: "U.S. EIA · 公开来源",
    heading: "能源基本面",
    text: "美国天然气库存结束注气季时高于正常水平。能源数据需要保留发布日期和统计口径。"
  },
  {
    title: "CFTC 预测市场与衍生品监管",
    date: "2026-11-22",
    source: "CFTC 新闻稿 · 公开来源",
    heading: "监管动态",
    text: "CFTC 围绕预测市场、结算和衍生品监管发布行动与解释。监管信息应以原始新闻稿和正式文件为准。"
  },
  {
    title: "SEC 审计追踪改革提案",
    date: "2026-11-22",
    source: "SEC 新闻稿 · 公开来源",
    heading: "证券监管",
    text: "SEC 提出重构合并审计追踪系统的建议。涉及证券监管的内容必须记录公告日期和提案状态。"
  }
];

const input = document.querySelector("#search");
const results = document.querySelector("#results");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    results.innerHTML = '<p class="empty">输入关键词开始检索。此页面只使用脱敏的公开示例资料。</p>';
    return;
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  const matches = corpus
    .map(item => {
      const haystack = `${item.title} ${item.heading} ${item.text}`.toLowerCase();
      const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));

  if (!matches.length) {
    results.innerHTML = '<p class="empty">公开示例中没有命中。正式系统会将此问题记录为知识缺口。</p>';
    return;
  }
  results.innerHTML = matches.map(({ item }) => `
    <article class="result">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <p class="meta">${escapeHtml(item.heading)} · ${escapeHtml(item.date)} · ${escapeHtml(item.source)}</p>
    </article>
  `).join("");
}

input.addEventListener("input", event => search(event.target.value));
document.querySelectorAll("[data-query]").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.query;
    search(input.value);
  });
});
