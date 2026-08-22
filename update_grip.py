import re

with open('web/src/components/board/SortableItem.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Update interface
code = code.replace(
    "  isDraggingOverlay?: boolean;\n}",
    "  isDraggingOverlay?: boolean;\n  dragHandleProps?: any;\n}"
)

# Update ItemCard params
code = code.replace(
    "  ({ item, onItemClick, onToggleComplete, isDraggingOverlay, style, ...props }, ref) => {",
    "  ({ item, onItemClick, onToggleComplete, isDraggingOverlay, dragHandleProps, style, ...props }, ref) => {"
)

# Remove attributes and listeners from ItemCard usage in SortableItem
code = code.replace(
    "      style={style}\n      {...attributes}\n      {...listeners}\n    />",
    "      style={style}\n      dragHandleProps={{ ...attributes, ...listeners }}\n    />"
)

# Replace the edit/grip button
old_button = """        {/* Edit Icon (Absolute Right) */}
        <button
          className="item-action-icon item-edit-btn"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#f4f5f7',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: '#44546f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(9, 30, 66, 0.15)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onItemClick(item);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <IconGripVertical size={16} />
        </button>"""

new_button = """        {/* Grip Icon (Centered Vertically Right) */}
        <button
          className="item-action-icon item-edit-btn"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '6px',
            background: '#f4f5f7',
            border: 'none',
            padding: '4px',
            cursor: isDraggingOverlay ? 'grabbing' : 'grab',
            color: '#44546f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
          {...dragHandleProps}
        >
          <IconGripVertical size={16} />
        </button>"""

code = code.replace(old_button, new_button)

with open('web/src/components/board/SortableItem.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
