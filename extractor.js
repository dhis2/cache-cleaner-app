const { readFileSync, writeFileSync } = require('fs');
const { i18nextToPot } = require('i18next-conv');
const recursive = require("recursive-readdir");

const argv = require('minimist')(process.argv.slice(2));
const filename = argv['o'] || 'en.pot';

const getFileExtension = (filename) => {
  return filename.split('.').pop();
};

// save file to disk
const save = (target) => {
  return result => {
    writeFileSync(target, result);
  };
};

let translations = {};

const functionRegex = new RegExp("{{'(.*)' | i18next}}", 'g');
const addKeysFromFileContent = (fileContent) => {
  let matches;
  while (( matches = functionRegex.exec(fileContent))) {
    if (matches[1]) {
      translations[matches[1]] = '';
    }
  }
};

recursive('.', function (err, files) {
  for (let file of files) {
    if (getFileExtension(file) === 'html') {
      const fileContent = readFileSync(file, 'utf-8');
      addKeysFromFileContent(fileContent);
    }
  }

  i18nextToPot('en', JSON.stringify(translations)).then(save('i18n/' + filename));
});
