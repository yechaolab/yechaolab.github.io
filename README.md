# 叶超课题组 | Ye Chao's Lab

## 网站结构

```
yelab-site/
├── index.html                 ← 主页
├── style.css                  ← 样式（所有页面共用）
├── js/app.js                  ← 脚本（语言切换 + 论文自动加载）
├── data/publications.json     ← 论文数据库（唯一需要维护的数据文件）
├── team/                      ← 成员个人页面
│   ├── ye-chao.html
│   └── student-a.html         ← 模板，复制改名即可
├── research/                  ← 研究方向页面（含该方向所有论文）
│   ├── governance.html
│   ├── sustainability.html
│   └── geographic-thought.html
├── news/                      ← 新闻详情页面
│   └── 2026-launch.html       ← 模板，复制改名即可
└── images/                    ← 照片（头像、导师照片等）
```

## 论文管理（核心功能）

只需维护 `data/publications.json` 一个文件，网站会自动在以下位置显示：
- 主页「学术成果」→ 最新 5 篇
- 研究方向子页面 → 按 direction 筛选
- 成员个人页面 → 按 authors 筛选

### JSON 字段说明

```json
{
  "id": "ye-2026-governance",      ← 唯一标识，随意取名
  "title": "中文标题",              ← 中文论文标题
  "title_en": "English Title",     ← 英文标题
  "authors": ["ye-chao", "student-a"],  ← 作者 ID（对应 team/ 文件夹名）
  "authors_display": "叶超, 学生A",     ← 显示用的作者名（中文）
  "authors_display_en": "Ye Chao, Student A",  ← 显示用的作者名（英文）
  "journal": "Nature Cities",      ← 期刊名
  "year": 2026,                    ← 发表年份
  "direction": "governance",       ← 研究方向（governance / sustainability / geographic-thought）
  "language": "en",                ← 文章语言
  "doi": "10.1038/xxx",           ← DOI（可选）
  "pdf": "",                       ← PDF 链接（可选）
  "abstract": "",                  ← 摘要（可选）
  "abstract_en": ""               ← 英文摘要（可选）
}
```

### 从 Zotero 导入

1. 在 Zotero 中选中论文 → 右键 → 导出为 CSL JSON
2. 手动整理为上述格式（主要是添加 direction 和 authors ID 字段）
3. 后续可以提供 Excel 模板，我帮你写转换脚本

## 添加新成员

1. 复制 `team/student-a.html`，重命名为 `team/新成员拼音.html`
2. 编辑文件中的姓名、职称、介绍等
3. 在 `index.html` 的团队板块复制一个 `<a class="member-card">` 块
4. 头像放到 `images/` 文件夹

## 添加新动态

1. 复制 `news/2026-launch.html`，重命名
2. 编辑标题、日期、内容
3. 在 `index.html` 的动态板块添加一个 `<a class="news-row">` 链接

## 照片命名

- 导师全身照：`images/ye-chao.jpg`
- 学生头像：`images/student-a.jpg`（与 team/ 文件夹名一致）

## 提交更新

```bash
git add -A && git commit -m "更新说明" && git push
```
