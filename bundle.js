const packager = require('electron-packager')

async function bundleElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

bundleElectronApp({
  dir: '.',
  out: './packages',
  asar: true,
  ignore: [
    '.editorconfig',
    '.gitignore',
    '.idea',
    '__mocks__',
    'bundle.js',
    'coverage',
    'jest.config.js',
    'README.md',
    'tests',
    'tsconfig.json',
    'tsconfig.prod.json',
    'tslint.json',
  ]
})
