import json

with open('data/problem_bank.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== 최상위 키 ===")
print(list(data.keys()))

for k, v in data.items():
    if isinstance(v, list):
        print(f"{k}: 리스트, 길이 {len(v)}")
        if len(v) > 0 and isinstance(v[0], dict):
            print(f"  -> 첫 아이템 키: {list(v[0].keys())[:15]}")
    elif isinstance(v, dict):
        print(f"{k}: 딕셔너리, 키 {list(v.keys())[:10]}")
        # 2단계도 확인
        for k2, v2 in v.items():
            if isinstance(v2, list):
                print(f"  {k2}: 리스트 길이 {len(v2)}")