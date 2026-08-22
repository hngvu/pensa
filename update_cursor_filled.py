import urllib.parse
import re

open_hand_path = 'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7-14.3-32-32-32s-32 14.3-32 32V352c0 70.7 57.3 128 128 128h96c70.7 0 128-57.3 128-128V160c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V32z'
closed_hand_path = 'M288 128c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7-14.3-32-32-32s-32 14.3-32 32V352c0 70.7 57.3 128 128 128h96c70.7 0 128-57.3 128-128V224c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V128z' # Approx for closed hand

def make_svg(path, color='#0c66e4'):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="{path}" fill="{color}" stroke="white" stroke-width="24" /></svg>'
    return "url('data:image/svg+xml;charset=utf-8," + urllib.parse.quote(svg) + "')"


# Wait, closed_hand_path above is just a rock/fist, let's use standard FontAwesome hand-rock
fist_path = 'M256 16c-17.7 0-32 14.3-32 32v128h-32V48c0-17.7-14.3-32-32-32s-32 14.3-32 32v128h-32V112c0-17.7-14.3-32-32-32s-32 14.3-32 32v144 64c0 70.7 57.3 128 128 128h96c70.7 0 128-57.3 128-128V192c0-17.7-14.3-32-32-32s-32 14.3-32 32v16h-32V112c0-17.7-14.3-32-32-32s-32 14.3-32 32v32h-32V48z'
open_svg = make_svg(open_hand_path)
closed_svg = make_svg(fist_path)

# Actually, the user wants the IconHandStop to be filled. I can't fill IconHandStop properly because its paths are just lines.
# But I can generate a filled path of a hand. Let's use the ones I generated.

with open('web/src/components/board/SortableItem.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# The cursor logic is cursor: isDraggingOverlay ? 'grabbing' : '{old_url}',
code = re.sub(r'cursor: isDraggingOverlay \? \'grabbing\' : "url\([^"]+\)",', f'cursor: isDraggingOverlay ? "{closed_svg} 12 12, grabbing" : "{open_svg} 12 12, grab",', code)

with open('web/src/components/board/SortableItem.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'document\.body\.style\.cursor = "url\([^"]+\)";', f'document.body.style.cursor = "{closed_svg} 12 12, grabbing";', code)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

