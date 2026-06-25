# 叶超课题组 | Ye Chao's Lab

## 更新内容

编辑 `index.html`，每个板块都有中文注释。用 `Ctrl+F` 搜索关键词定位。

**添加成员：** 搜索 `复制此块添加新博士生`，复制整个 `<div class="member-card" ...>` 块，修改所有 `data-*` 属性。

**添加论文：** 搜索 `复制此块添加新论文`，复制 `<div class="pub">` 块。

**添加动态：** 在 `news-list` 里复制 `<div class="news-row">` 块。

**添加照片：** 把图片放到 `images/` 文件夹。成员头像替换 `<div class="member-avatar">姓</div>` 为 `<img class="member-avatar" src="images/xxx.jpg" alt="姓名">`。导师大照片替换 `<div class="photo-placeholder">` 为 `<img src="images/ye-chao.jpg" alt="叶超" class="hero-img">`。

## 提交更新

```bash
git add -A
git commit -m "更新说明"
git push
```
