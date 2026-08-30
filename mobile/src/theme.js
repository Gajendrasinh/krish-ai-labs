// Same palette as the website (site/src/styles/tokens.css), translated to
// plain hex/rgba since React Native's StyleSheet doesn't support oklch().
export const theme = {
  bg: '#1c1c22',
  surface: '#26262e',
  border: '#3a3a44',
  borderStrong: '#44444f',

  text: '#f4f3f6',
  textSecondary: '#b7b6c0',
  textTertiary: '#a8a7b3',
  textMuted: '#8f8e99',
  textFaint: '#7e7d88',
  textLabel: '#77767f',

  violet: '#7c5cff',
  violetText: '#a48cff',
  cyan: '#22c3d6',
  cyanText: '#3fd1e0',

  gradient: ['#7c5cff', '#22c3d6'],
};

export default theme;
