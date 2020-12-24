export function getOSScrollbarSize(): number {
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return 0;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 16;
  } else if (/Linux/.test(platform)) {
    return 15;
  }
  return 0;
}
