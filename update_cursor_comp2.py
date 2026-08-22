import re

with open('web/src/components/board/SortableItem.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_url = "url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cg%20stroke%3D%22white%22%20stroke-width%3D%226%22%3E%3Cpath%20d%3D%22M8%2013v-7.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M11%205.5v-2a1.5%201.5%200%201%201%203%200v8.5%22/%3E%3Cpath%20d%3D%22M14%205.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M17%207.5a1.5%201.5%200%200%201%203%200v8.5a6%206%200%200%201%20-6%206h-2h.208a6%206%200%200%201%20-5.012%20-2.7a69.74%2069.74%200%200%201%20-.196%20-.3c-.312%20-.479%20-1.407%20-2.388%20-3.286%20-5.728a1.5%201.5%200%200%201%20.536%20-2.022a1.867%201.867%200%200%201%202.28%20.28l1.47%201.47%22/%3E%3C/g%3E%3Cg%20stroke%3D%22%230c66e4%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M8%2013v-7.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M11%205.5v-2a1.5%201.5%200%201%201%203%200v8.5%22/%3E%3Cpath%20d%3D%22M14%205.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M17%207.5a1.5%201.5%200%200%201%203%200v8.5a6%206%200%200%201%20-6%206h-2h.208a6%206%200%200%201%20-5.012%20-2.7a69.74%2069.74%200%200%201%20-.196%20-.3c-.312%20-.479%20-1.407%20-2.388%20-3.286%20-5.728a1.5%201.5%200%200%201%20.536%20-2.022a1.867%201.867%200%200%201%202.28%20.28l1.47%201.47%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E') 14 14, grab"

# we need to regex match the old url
code = re.sub(r'cursor: isDraggingOverlay \? \'grabbing\' : "[^"]+",', f'cursor: isDraggingOverlay ? \'grabbing\' : "{new_url}",', code)

with open('web/src/components/board/SortableItem.tsx', 'w', encoding='utf-8') as f:
    f.write(code)


with open('web/src/pages/board/ProjectBoardPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_url_body = "url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cg%20stroke%3D%22white%22%20stroke-width%3D%226%22%3E%3Cpath%20d%3D%22M8%2013v-7.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M11%205.5v-2a1.5%201.5%200%201%201%203%200v8.5%22/%3E%3Cpath%20d%3D%22M14%205.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M17%207.5a1.5%201.5%200%200%201%203%200v8.5a6%206%200%200%201%20-6%206h-2h.208a6%206%200%200%201%20-5.012%20-2.7a69.74%2069.74%200%200%201%20-.196%20-.3c-.312%20-.479%20-1.407%20-2.388%20-3.286%20-5.728a1.5%201.5%200%200%201%20.536%20-2.022a1.867%201.867%200%200%201%202.28%20.28l1.47%201.47%22/%3E%3C/g%3E%3Cg%20stroke%3D%22%230c66e4%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M8%2013v-7.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M11%205.5v-2a1.5%201.5%200%201%201%203%200v8.5%22/%3E%3Cpath%20d%3D%22M14%205.5a1.5%201.5%200%200%201%203%200v6.5%22/%3E%3Cpath%20d%3D%22M17%207.5a1.5%201.5%200%200%201%203%200v8.5a6%206%200%200%201%20-6%206h-2h.208a6%206%200%200%201%20-5.012%20-2.7a69.74%2069.74%200%200%201%20-.196%20-.3c-.312%20-.479%20-1.407%20-2.388%20-3.286%20-5.728a1.5%201.5%200%200%201%20.536%20-2.022a1.867%201.867%200%200%201%202.28%20.28l1.47%201.47%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E') 14 14, grabbing"

code = re.sub(r'document\.body\.style\.cursor = "[^"]+";', f'document.body.style.cursor = "{new_url_body}";', code)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
