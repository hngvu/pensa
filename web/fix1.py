import re

# Header.tsx
with open('src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    header = f.read()
header = re.sub(r'const \{ user, isLoaded \} = useUser\(\);\n', '', header)
with open('src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(header)

# Sidebar.tsx
with open('src/components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
    sidebar = f.read()
sidebar = sidebar.replace('  IconPlus,\n', '')
sidebar = sidebar.replace('  IconChevronRight,\n', '')
sidebar = re.sub(r"import \{ projectApi \} from '../../api/projectApi';\n", '', sidebar)
sidebar = re.sub(r"import type \{ Project \} from '../../types';\n", '', sidebar)
sidebar = re.sub(r"const \[, setCreateWorkspaceOpen\] = useAtom\(createWorkspaceModalOpenAtom\);\n", '', sidebar)
sidebar = re.sub(r"const \[, setCreateProjectOpen\] = useAtom\(createProjectModalOpenAtom\);\n", '', sidebar)
sidebar = re.sub(r"const currentWorkspaceHandle = activeWorkspaceHandle \|\| workspaces\[0\]\?\.handle;\n", '', sidebar)
with open('src/components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(sidebar)

# DashboardPage.tsx
with open('src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    dashboard = f.read()
dashboard = dashboard.replace('  IconPlus,\n', '')
with open('src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard)
