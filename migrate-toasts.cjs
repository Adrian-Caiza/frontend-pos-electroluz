const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

function migrate() {
  walk('d:\\Proyectos\\frontend-pos-elctroluz\\src', (filePath) => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // toast.success('Texto') -> toast.success('Operación exitosa', { description: 'Texto' })
    content = content.replace(/toast\.success\('([^']+)'\);/g, "toast.success('Operación exitosa', {\n        description: '$1'\n      });");
    content = content.replace(/toast\.success\("([^"]+)"\);/g, "toast.success('Operación exitosa', {\n        description: \"$1\"\n      });");
    
    // toast.error('Texto') -> toast.error('Ocurrió un error', { description: 'Texto' })
    content = content.replace(/toast\.error\('([^']+)'\);/g, "toast.error('Ocurrió un error', {\n        description: '$1'\n      });");
    
    // toast.warning('Texto')
    content = content.replace(/toast\.warning\('([^']+)'\);/g, "toast.warning('Atención', {\n        description: '$1'\n      });");

    // toast.error(Array.isArray(message) ? message[0] : message);
    content = content.replace(/toast\.error\(Array\.isArray\(message\) \? message\[0\] : message\);/g, "toast.error('Ocurrió un error', {\n        description: Array.isArray(message) ? message[0] : message\n      });");

    // toast.error(message);
    content = content.replace(/toast\.error\(message\);/g, "toast.error('Ocurrió un error', {\n        description: message\n      });");

    // toast.error(errorMessage);
    content = content.replace(/toast\.error\(errorMessage\);/g, "toast.error('Ocurrió un error', {\n        description: errorMessage\n      });");

    // toast.error(displayMessage);
    content = content.replace(/toast\.error\(displayMessage\);/g, "toast.error('Ocurrió un error', {\n        description: displayMessage\n      });");

    // toast.error(typeof errorMessage === 'string' ? errorMessage : 'Error de validación');
    content = content.replace(/toast\.error\(typeof errorMessage === 'string' \? errorMessage : 'Error de validación'\);/g, "toast.error('Error de validación', {\n        description: typeof errorMessage === 'string' ? errorMessage : 'Revise los campos e intente de nuevo'\n      });");

    // toast.success(editId ? '¡Proforma actualizada con éxito!' : '¡Proforma generada con éxito!');
    content = content.replace(/toast\.success\(editId \? '¡Proforma actualizada con éxito!' : '¡Proforma generada con éxito!'\);/g, "toast.success('Operación exitosa', {\n        description: editId ? '¡Proforma actualizada con éxito!' : '¡Proforma generada con éxito!'\n      });");

    // toast.error(`Ocurrió un error al procesar la operación. Detalle: ${backendError}`);
    content = content.replace(/toast\.error\(`Ocurrió un error al procesar la operación\. Detalle: \$\{backendError\}`\);/g, "toast.error('Ocurrió un error', {\n        description: `No se pudo procesar la operación. Detalle: ${backendError}`\n      });");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Migrated:', filePath);
    }
  });
}

migrate();
