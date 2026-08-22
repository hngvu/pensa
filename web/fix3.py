with open('src/components/modals/ItemDetailModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('width="300px"', 'width={300}')

with open('src/components/modals/ItemDetailModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
