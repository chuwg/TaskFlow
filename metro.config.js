const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// TurboModule 호환성을 위한 설정
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// New Architecture 비활성화에 따른 설정
config.resolver.unstable_enablePackageExports = false;

// Hermes 엔진 설정
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// TurboModule 에러 방지를 위한 추가 설정
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.alias = {
  'react-native': 'react-native',
  '@': './src',
  '@components': './src/components',
  '@hooks': './src/hooks',
  '@store': './src/store',
  '@services': './src/services',
  '@utils': './src/utils',
  '@types': './src/types',
};

module.exports = config;
