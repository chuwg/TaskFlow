import { useWindowDimensions } from 'react-native';
import { fontConfig } from '@/constants/fonts';

type FontStyle = keyof typeof fontConfig;

export const useFontScaling = () => {
  const { width, height } = useWindowDimensions();
  const baseWidth = 360; // 기준 화면 너비
  const scale = Math.min(width / baseWidth, 1.2); // 최대 120%까지 확대

  const getScaledFontSize = (fontSize: number) => {
    return Math.round(fontSize * scale);
  };

  const getScaledLineHeight = (lineHeight: number) => {
    return Math.round(lineHeight * scale);
  };

  const getScaledFontStyle = (style: FontStyle) => {
    const baseStyle = fontConfig[style];
    return {
      ...baseStyle,
      fontSize: getScaledFontSize(baseStyle.fontSize),
      lineHeight: getScaledLineHeight(baseStyle.lineHeight),
    };
  };

  const scaledFontConfig = Object.entries(fontConfig).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        ...value,
        fontSize: getScaledFontSize(value.fontSize),
        lineHeight: getScaledLineHeight(value.lineHeight),
      },
    }),
    {} as typeof fontConfig
  );

  return {
    scale,
    getScaledFontSize,
    getScaledLineHeight,
    getScaledFontStyle,
    scaledFontConfig,
  };
};
