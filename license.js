// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');
const date = new Date();
let dd = date.getDate();
let mm = date.getMonth() + 1; // January is 0!
const yyyy = date.getFullYear();

if (dd < 10) {
   dd = '0' + dd;
}

if (mm < 10) {
   mm = '0' + mm;
}

const today = dd + '/' + mm + '/' + yyyy;

exports.banner = `@license :${packageJson.name} - V${packageJson.version} - ${today}
https://github.com/wangzl1163/${packageJson.name}
Copyright (c) ${yyyy} @wangzl1163; Licensed ${packageJson.license}`;
