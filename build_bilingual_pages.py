from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parent

with zipfile.ZipFile(ROOT / "github_push_v3.zip") as archive:
    original = archive.read("index.html").decode("utf-8-sig")

# Preserve the app bundle unchanged on the Korean page; update only document metadata.
korean = re.sub(r'<html\s+lang="[^"]*"', '<html lang="ko"', original, count=1, flags=re.I)
korean = re.sub(r'<title>.*?</title>', '<title>NSW Question Bank - 한국어</title>', korean, count=1, flags=re.I)
korean = re.sub(r"(?m)^[ \t]+$", "", korean)
(ROOT / "index_kr.html").write_text(korean, encoding="utf-8")

# The English page keeps the application logic untouched and translates rendered UI text.
english = re.sub(r'<html\s+lang="[^"]*"', '<html lang="en"', original, count=1, flags=re.I)
english = re.sub(r'<title>.*?</title>', '<title>NSW Question Bank - Stage 1-6</title>', english, count=1, flags=re.I)
translator = (ROOT / "english_ui.js").read_text(encoding="utf-8")
english = english.replace("</body>", "<script>\n" + translator + "\n</script>\n</body>", 1)
english = re.sub(r"(?m)^[ \t]+$", "", english)
(ROOT / "index.html").write_text(english, encoding="utf-8")

readme = ROOT / "README.md"
text = readme.read_text(encoding="utf-8-sig")
text = re.sub(r"(?m)^2\. .*index\.html.*$", "2. Open `index.html` for English or `index_kr.html` for Korean.", text, count=1)
text = re.sub(r"(?m)^├── index\.html.*$", "├── index.html                      ← English version (default)\n├── index_kr.html                   ← Korean version", text, count=1)
lines = text.splitlines()
cleaned = []
for line in lines:
    if line.strip() == "├── index_kr.html                   ← Korean version" and line in cleaned:
        continue
    cleaned.append(line)
readme.write_text("\n".join(cleaned) + "\n", encoding="utf-8")
print("Built English default and Korean original pages.")
