// C.f. https://stackoverflow.com/a/34064434/385997
export function decode(str: string) {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent || str;
}
