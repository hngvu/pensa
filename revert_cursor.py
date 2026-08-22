import re

with open('web/src/components/board/SortableItem.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the cursor logic
code = re.sub(r'cursor: isDraggingOverlay \? "[^"]+" : "[^"]+",', r"cursor: isDraggingOverlay ? 'grabbing' : 'grab',", code)

with open('web/src/components/board/SortableItem.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'document\.body\.style\.cursor = "[^"]+";', "document.body.style.cursor = 'grabbing';", code)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

