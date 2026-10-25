"""将普通脚本和样式打进单文件试玩版；不需要 npm 或网络依赖。"""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text()
def embed(match):
    code = (root / match.group(1)).read_text()
    code = re.sub(r'</script', r'<\\/script', code, flags=re.I)
    return '<script>\n' + code + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', embed, html)
html = html.replace('<link rel="stylesheet" href="css/game.css">', '<style>\n' + (root / 'css/game.css').read_text() + '\n</style>')
(root / 'downloads').mkdir(exist_ok=True)
(root / 'downloads/Paint-Stick-Showdown-play.html').write_text(html)
print('Standalone HTML updated.')
