export function articleTitleFromKeyword(keyword: string): string {
  const value = keyword.trim();
  const [first = "", ...rest] = Array.from(value);

  return `${first.toLocaleUpperCase()}${rest.join("")}`;
}
