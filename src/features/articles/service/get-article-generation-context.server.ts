import "server-only";

import { getArticle } from "@/features/articles/service/get-article.server";
import { listKeywordGroups } from "@/features/keywords/service/list-keyword-groups.server";
import { listKeywords } from "@/features/keywords/service/list-keywords.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

export async function getArticleGenerationContext(
  projectId: string,
  articleId: string,
) {
  const [article, project, keywords, groups] = await Promise.all([
    getArticle(projectId, articleId),
    getProjectContext(projectId),
    listKeywords(projectId),
    listKeywordGroups(projectId),
  ]);
  const primary = keywords.find(
    (keyword) => keyword.keywordId === article.keywordId,
  );
  const group = primary?.groupId
    ? groups.find((item) => item.groupId === primary.groupId)
    : undefined;
  const supporting = group
    ? group.memberKeywordIds
        .filter((id) => id !== article.keywordId)
        .map(
          (id) => keywords.find((keyword) => keyword.keywordId === id)?.keyword,
        )
        .filter((value): value is string => Boolean(value))
    : [];
  return {
    article,
    project,
    market: primary
      ? {
          countryCode: primary.countryCode,
          languageCode: primary.languageCode,
        }
      : null,
    primaryKeyword: primary?.keyword ?? "",
    supportingKeywords: supporting,
  };
}
