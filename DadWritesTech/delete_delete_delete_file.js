const fs = require('fs');
const path = 'E:/MySite/Blog_Content/DadWritesTech/delete_delete_file.js';

fs.unlink(path, (err) => {
  if (err) {
    console.error(`Error deleting file ${path}:`, err);
    process.exit(1);
  } else {
    console.log(`Successfully deleted ${path}`);
    process.exit(0);
  }
});