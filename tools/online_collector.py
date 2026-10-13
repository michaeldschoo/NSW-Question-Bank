
"""
NSW 온라인 수집기 - 로컬 실행용
Perplexity API 없이 Python requests + BeautifulSoup로 NESA/NSW DoE 최신 자료 수집

사용법:
pip install requests beautifulsoup4 pandas openpyxl
python tools/online_collector.py

수집 결과는 data/collected/ 폴더에 json으로 저장되고,
problem_bank.json의 meta.latest_news에 자동 병합됨.
"""

import requests
import json
import re
from pathlib import Path
from datetime import datetime

BASE = Path(__file__).parent.parent
COLLECT_DIR = BASE / "data" / "collected"
COLLECT_DIR.mkdir(exist_ok=True)

HEADERS = {"User-Agent":"Mozilla/5.0 NSW-Education-Research-Bot"}

def fetch_nesa_updates():
    """NESA NSW Syllabus 최신 업데이트 수집 (공개 페이지)"""
    results = []
    urls = [
        "https://educationstandards.nsw.edu.au/wps/portal/nesa/home",
        "https://education.nsw.gov.au/about/strategies-and-reports",
    ]
    for url in urls:
        try:
            r = requests.get(url, headers=HEADERS, timeout=10)
            if r.status_code == 200:
                # 간단 파싱 - 제목, 날짜 추출 (실제로는 더 정교하게 가능)
                text = r.text[:5000]
                results.append({
                    "source": url,
                    "fetched_at": datetime.now().isoformat(),
                    "snippet": re.sub(r"<[^>]+>", "", text)[:500],
                    "type": "NESA Update"
                })
                print(f"[수집] {url} OK")
        except Exception as e:
            print(f"[실패] {url}: {e}")
    return results

def fetch_selective_info():
    """NSW Selective 시험 정보 수집"""
    url = "https://education.nsw.gov.au/public-schools/selective-high-schools-and-opportunity-classes/year-7"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            return [{"source": url, "type":"Selective Info","fetched_at":datetime.now().isoformat(),"note":"Selective placement test info page checked"}]
    except Exception as e:
        print(e)
    return []

def save_and_merge(all_data):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = COLLECT_DIR / f"nsw_collect_{timestamp}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    print(f"수집 결과 저장: {out_path}")

    # problem_bank.json meta에 병합
    pb_path = BASE / "data" / "problem_bank.json"
    if pb_path.exists():
        with open(pb_path, "r", encoding="utf-8") as f:
            pb = json.load(f)
        pb["meta"]["last_online_collect"] = timestamp
        pb["meta"]["latest_news"] = all_data[:5]
        with open(pb_path, "w", encoding="utf-8") as f:
            json.dump(pb, f, ensure_ascii=False, indent=2)
        print(f"problem_bank.json meta 업데이트 완료")

if __name__ == "__main__":
    print("=== NSW 온라인 수집 시작 (로컬) ===")
    data = []
    data += fetch_nesa_updates()
    data += fetch_selective_info()
    # 여기에 추가로 선생님이 원하는 사이트 추가 가능
    # 예: https://www.acara.edu.au/ 등
    save_and_merge(data)
    print("=== 완료 ===")
    print("결과: data/collected/ 폴더 확인")
    print("다음: index.html 새로고침하면 오른쪽 '최신 동향'에 반영됩니다 (수동 메모 또는 자동 병합)")
