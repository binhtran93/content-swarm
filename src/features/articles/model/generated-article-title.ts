export function isUsefulGeneratedArticleTitle(
  title: string,
  primaryKeyword: string,
): boolean {
  const normalizedTitle = title.trim().toLocaleLowerCase();
  const normalizedKeyword = primaryKeyword.trim().toLocaleLowerCase();

  return (
    Boolean(normalizedKeyword) &&
    normalizedTitle.includes(normalizedKeyword) &&
    normalizedTitle !== normalizedKeyword
  );
}
