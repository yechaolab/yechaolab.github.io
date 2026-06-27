import json

with open('data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

existing = {p['id'] for p in pubs}

new = [
    {"id":"ye-2022-writing-place","title":"书写地方：地理学者的使命与精神","title_en":"Writing Place: The Mission and Spirit of Geographers","authors":["ye-chao"],"authors_display":"叶超","authors_display_en":"Ye C.","journal":"中学地理教学参考","year":2022,"month":9,"direction":"geographic-thought","language":"zh","doi":"","pdf":"papers/ye-2022-writing-place.pdf"},
    {"id":"ye-2023-inheritance","title":"地理学的传承与超越","title_en":"Inheritance and Transcendence of Geography","authors":["ye-chao"],"authors_display":"叶超","authors_display_en":"Ye C.","journal":"中学地理教学参考","year":2023,"month":2,"direction":"geographic-thought","language":"zh","doi":"","pdf":"papers/ye-2023-inheritance.pdf"},
    {"id":"liu-2022-geo-teaching","title":"地理思想教学的主要路径探索","title_en":"Exploring Main Pathways of Geographic Thought Teaching","authors":["ye-chao"],"authors_display":"刘欢, 叶超","authors_display_en":"Liu H., Ye C.","journal":"中学地理教学参考","year":2022,"month":7,"direction":"geographic-thought","language":"zh","doi":"","pdf":"papers/liu-2022-geo-teaching.pdf"},
    {"id":"ye-2023-wang-enyong","title":"恩泽学林，涌泉相报：纪念王恩涌先生","title_en":"In Memory of Professor Wang Enyong","authors":["ye-chao"],"authors_display":"叶超","authors_display_en":"Ye C.","journal":"热带地理","year":2023,"month":2,"direction":"geographic-thought","language":"zh","doi":"","pdf":"papers/ye-2023-wang-enyong.pdf"},
    {"id":"ye-2021-reunderstand","title":"重识人文地理学","title_en":"Re-understanding Human Geography","authors":["ye-chao"],"authors_display":"叶超","authors_display_en":"Ye C.","journal":"中学地理教学参考","year":2021,"month":12,"direction":"geographic-thought","language":"zh","doi":"","pdf":"papers/ye-2021-reunderstand.pdf"},
]

added = 0
for p in new:
    if p['id'] not in existing:
        pubs.append(p)
        added += 1

# Fix the 2 manually renamed PDFs
for p in pubs:
    if p['id'] == 'ye-2020-co-governance' and not p.get('pdf'):
        p['pdf'] = 'papers/ye-2020-co-governance.pdf'
    if p['id'] == 'ye-2023-yifu-tuan' and not p.get('pdf'):
        p['pdf'] = 'papers/ye-2023-yifu-tuan.pdf'

with open('data/publications.json', 'w', encoding='utf-8') as f:
    json.dump(pubs, f, ensure_ascii=False, indent=2)

linked = sum(1 for p in pubs if p.get('pdf'))
print(f"新增 {added} 篇，总计 {len(pubs)} 篇，已关联 PDF: {linked} 篇")
