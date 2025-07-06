// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

// The 'import.meta' syntax is not supported in Expo for web.
// To fix this, we can configure Metro to use the CJS (CommonJS) version of packages like Zustand
// instead of the ESM (ES Module) version by disabling package exports.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
