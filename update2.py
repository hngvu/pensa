import re

with open('web/src/pages/board/ProjectBoardPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix imports
code = code.replace(
    "import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';",
    "import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, defaultDropAnimationSideEffects } from '@dnd-kit/core';"
)

code = code.replace(
    "import { SortableItem } from '../../components/board/SortableItem';",
    "import { SortableItem, ItemCard } from '../../components/board/SortableItem';"
)

# Insert Drop Animation config
drop_config = """
  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
    duration: 250,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
  };
"""

code = code.replace(
    "const handleDragEnd = (event: any) => {",
    drop_config + "\n  const handleDragEnd = (event: any) => {"
)

# Insert DragOverlay before </DndContext>
overlay = """
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId ? (
              <ItemCard 
                item={boardItems.find(i => i.handle === activeId)!} 
                onItemClick={() => {}} 
                onToggleComplete={() => {}} 
                isDraggingOverlay={true} 
              />
            ) : null}
          </DragOverlay>
"""

code = code.replace(
    "        </div>\n      </div>\n\n        </DndContext>",
    "        </div>\n      </div>\n" + overlay + "        </DndContext>"
)

# Remove duplicate { /* Render Existing Sections */ }
code = code.replace(
    "          {/* Render Existing Sections */}\n          {/* Render Existing Sections */}",
    "          {/* Render Existing Sections */}"
)

with open('web/src/pages/board/ProjectBoardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
