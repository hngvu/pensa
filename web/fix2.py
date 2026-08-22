import re

with open('src/components/modals/ItemDetailModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix Line 838
code = code.replace("setDateRange(prev => ({ ...prev, to: newTo }));", "setDateRange(prev => (prev ? { ...prev, to: newTo } : { from: undefined, to: newTo }));")

# Fix Line 857
code = code.replace("updateItemMutation.mutate({\n                handle: item.handle,", "if (!item) return;\n              updateItemMutation.mutate({\n                handle: item.handle,")

with open('src/components/modals/ItemDetailModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

