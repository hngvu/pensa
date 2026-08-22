import re

with open('web/src/pages/board/ProjectBoardPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "  const handleDragStart = (event: any) => {\n    setActiveId(event.active.id);\n  };",
    "  const handleDragStart = (event: any) => {\n    setActiveId(event.active.id);\n    document.body.style.cursor = 'grabbing';\n  };"
)

code = code.replace(
    "  const handleDragEnd = (event: any) => {\n    setActiveId(null);",
    "  const handleDragEnd = (event: any) => {\n    setActiveId(null);\n    document.body.style.cursor = '';"
)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
