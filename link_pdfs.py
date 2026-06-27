"""
智能 PDF 匹配脚本 v2
把 PDF 丢进 papers/ 文件夹，运行 python link_pdfs.py 自动匹配
"""
import json, os, re, shutil

papers_dir = 'papers'
json_path = 'data/publications.json'

with open(json_path, 'r', encoding='utf-8') as f:
    pubs = json.load(f)

if not os.path.exists(papers_dir):
    os.makedirs(papers_dir)
    print("已创建 papers/ 文件夹，请放入 PDF 后重新运行")
    exit()

pdf_files = [f for f in os.listdir(papers_dir) if f.lower().endswith('.pdf')]
if not pdf_files:
    print("papers/ 文件夹里没有 PDF 文件")
    exit()

def normalize(text):
    """去掉标点、空格、下划线，统一小写"""
    text = re.sub(r'[\s_\-\(\)\[\]（）【】,.:;，。：；"""\'\u200b]', '', text.lower())
    return text

def match_score(filename, pub):
    """用子串匹配计算分数"""
    fn = normalize(os.path.splitext(filename)[0])
    # Remove trailing author names like _叶超, _罗燊 etc
    fn = re.sub(r'[\u4e00-\u9fff]{2,4}$', '', fn)
    # Remove (1) etc
    fn = re.sub(r'\d+$', '', fn)
    
    score = 0
    title = normalize(pub['title'])
    title_en = normalize(pub.get('title_en', ''))
    
    # Check if filename is a substring of title or vice versa
    if len(fn) >= 4:
        if fn in title or fn in title_en:
            score += 100
        elif title in fn or title_en in fn:
            score += 100
        else:
            # Check overlapping substrings (sliding window)
            best = 0
            for wlen in range(min(len(fn), len(title), 8), 2, -1):
                for i in range(len(fn) - wlen + 1):
                    chunk = fn[i:i+wlen]
                    if chunk in title or chunk in title_en:
                        best = max(best, wlen)
                        break
                if best >= wlen:
                    break
            score += best * 3
    
    # Also check author match
    authors = normalize(pub['authors_display'])
    for i in range(len(fn) - 1):
        chunk = fn[i:i+2]
        if chunk in authors and re.match(r'[\u4e00-\u9fff]{2}', chunk):
            score += 2
            break
    
    return score

# Step 1: exact id match
already_matched = set()
for p in pubs:
    expected = p['id'] + '.pdf'
    if expected in pdf_files:
        p['pdf'] = f"papers/{expected}"
        already_matched.add(expected)

# Step 2: smart match
unmatched_pdfs = [f for f in pdf_files if f not in already_matched]
unmatched_pubs = [p for p in pubs if not p.get('pdf')]

auto_matched = []
failed = []

for pdf in sorted(unmatched_pdfs):
    scores = [(pub, match_score(pdf, pub)) for pub in unmatched_pubs]
    scores.sort(key=lambda x: x[1], reverse=True)
    
    if scores and scores[0][1] >= 10:
        best = scores[0][0]
        new_name = best['id'] + '.pdf'
        old_path = os.path.join(papers_dir, pdf)
        new_path = os.path.join(papers_dir, new_name)
        if not os.path.exists(new_path):
            shutil.move(old_path, new_path)
            best['pdf'] = f"papers/{new_name}"
            unmatched_pubs.remove(best)
            auto_matched.append((pdf, new_name, best['title'][:50]))
        else:
            failed.append(pdf)
    else:
        failed.append(pdf)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(pubs, f, ensure_ascii=False, indent=2)

linked = sum(1 for p in pubs if p.get('pdf'))
print(f"\n{'='*50}")
print(f"总计: {len(pubs)} 篇, 已关联 PDF: {linked} 篇")
print(f"{'='*50}")

if already_matched:
    print(f"\n直接匹配: {len(already_matched)} 篇")

if auto_matched:
    print(f"\n智能匹配并重命名: {len(auto_matched)} 篇")
    for old, new, title in auto_matched:
        print(f"  {old[:60]}")
        print(f"    -> {new}")

if failed:
    print(f"\n未能匹配: {len(failed)} 个")
    for f in failed:
        print(f"  {f}")

no_pdf = [p for p in pubs if not p.get('pdf')]
if no_pdf:
    print(f"\n尚未关联 PDF: {len(no_pdf)} 篇")
