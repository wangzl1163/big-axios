const { copyFile } = require('fs/promises');

try {
   copyFile('./types/index.d.ts', './dist/index.d.ts').then(() => {
      console.log('copied successfully');
   });
} catch (e) {
   console.log('The file could not be copied, error info: ', e);
}
