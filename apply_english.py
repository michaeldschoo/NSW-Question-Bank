from pathlib import Path
import runpy

root = Path(__file__).resolve().parent
runpy.run_path(str(root / "build_bilingual_pages.py"), run_name="__main__")
