import json

with open('data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

existing = {p['id'] for p in pubs}

if 'wu-2023-yifu-place' not in existing:
    pubs.append({
        "id": "wu-2023-yifu-place",
        "title": "情景之间：段义孚的地方经验与书写艺术",
        "title_en": "Between Scenes: Yi-Fu Tuan's Place Experience and the Art of Writing",
        "authors": ["ye-chao"],
        "authors_display": "吴佩瑾, 叶超",
        "authors_display_en": "Wu P., Ye C.",
        "journal": "地理科学进展",
        "year": 2023, "month": 6,
        "direction": "geographic-thought",
        "language": "zh",
        "doi": "",
        "pdf": "papers/wu-2023-yifu-place.pdf"
    })
    print("已添加: 情景之间：段义孚的地方经验与书写艺术")

with open('data/publications.json', 'w', encoding='utf-8') as f:
    json.dump(pubs, f, ensure_ascii=False, indent=2)

print(f"Total: {len(pubs)}")
