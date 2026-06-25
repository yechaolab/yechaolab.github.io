# 叶超课题组网站

纯静态 HTML 网站，无需任何构建工具，推送到 GitHub 即可自动上线。

## 网站地址

https://yechaolab.github.io

## 如何更新内容

直接编辑 `index.html` 文件。每个板块都有中文注释标记，找到对应位置修改即可。

### 添加新成员

在 `index.html` 中找到 `<!-- === 复制下面这个块来添加新的博士生 === -->`，复制整个 `<div class="member-card">...</div>` 块，修改姓名、角色、研究兴趣。

如需添加头像照片：把照片放到 `images/` 文件夹，然后把 `<div class="avatar-placeholder">姓</div>` 替换为 `<img src="images/照片文件名.jpg" alt="姓名">`。

### 添加新论文

找到 `<!-- === 复制下面这个块来添加新论文 === -->`，复制 `<div class="pub-item">...</div>` 块，修改标题、作者、期刊信息。

### 发布新动态

找到 `<!-- === 复制下面这个块来添加新动态 === -->`，复制 `<div class="news-item">...</div>` 块，修改日期和内容。

### 中英文内容

每个需要双语的元素都有 `data-zh="中文"` 和 `data-en="English"` 两个属性，修改对应内容即可。

## 提交更新

```bash
git add .
git commit -m "更新说明"
git push
```

或者直接在 GitHub 网页上编辑文件。
