const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const iconBase = path.resolve(__dirname, 'src/shims/iconBase.tsx');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath ?? '';
  const fromIconLib = origin.includes(`${path.sep}react-icons${path.sep}lib${path.sep}`);
  if (fromIconLib && /^\.\/iconBase(\.[cm]?js)?$/.test(moduleName)) {
    return { filePath: iconBase, type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
