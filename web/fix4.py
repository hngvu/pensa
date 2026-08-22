import re

# Header
with open('src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    header = f.read()
header = header.replace('useUser, ', '').replace(', useUser', '')
with open('src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(header)

# Sidebar
with open('src/components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
    sidebar = f.read()
sidebar = sidebar.replace('  createWorkspaceModalOpenAtom,\n', '')
sidebar = sidebar.replace('  createProjectModalOpenAtom,\n', '')
sidebar = re.sub(r'const \[activeWorkspaceHandle, setActiveWorkspaceHandle\] = useAtom\(activeWorkspaceHandleAtom\);\n', r'const [, setActiveWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);\n', sidebar)
with open('src/components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(sidebar)

# ItemDetailModal
with open('src/components/modals/ItemDetailModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('IconX, IconCreditCard, IconAlignJustified', 'IconX, IconAlignJustified')
code = re.sub(r'\s*const \[commentContent, setCommentContent\] = useState\(\'\'\);\n', '\n', code)
code = code.replace('onClick={(e) => {\n                          setPopoverState', 'onClick={() => {\n                          setPopoverState')

with open('src/components/modals/ItemDetailModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
