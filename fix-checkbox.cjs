const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles('src/modules', filePath => filePath.endsWith('columns.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const searchPattern = /id:\s*'select',\s*header:\s*\(\{\s*table\s*\}\)\s*=>\s*\(\s*<DataTableCheckbox[\s\S]*?aria-label="Select all"\s*\/>\s*\),\s*cell:\s*\(\{\s*row\s*\}\)\s*=>\s*\(\s*<DataTableCheckbox[\s\S]*?aria-label="Select row"\s*\/>\s*\),/g;
  
  if (searchPattern.test(content)) {
    const newContent = content.replace(searchPattern, () => {
      return `id: 'select',\n    header: ({ table }) => (\n      <div className="flex justify-center w-full px-1">\n        <DataTableCheckbox\n          checked={table.getIsAllPageRowsSelected()}\n          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}\n          aria-label="Select all"\n        />\n      </div>\n    ),\n    cell: ({ row }) => (\n      <div className="flex justify-center w-full px-1">\n        <DataTableCheckbox\n          checked={row.getIsSelected()}\n          onCheckedChange={(value) => row.toggleSelected(!!value)}\n          aria-label="Select row"\n        />\n      </div>\n    ),`;
    });
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Skipped', file);
  }
});
