export type Keyword = {
  keywordId: string;
  keyword: string;
  normalizedKeyword: string;
  countryCode: string;
  languageCode: string;
  searchVolume: number | null;
  difficulty: number | null;
  sourceDiscoveryId: string | null;
  groupId: string | null;
  articleId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KeywordGroup = {
  groupId: string;
  name: string | null;
  primaryKeywordId: string;
  memberKeywordIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ArticleTopic = {
  id: string;
  kind: "keyword" | "group";
  primary: Keyword;
  supporting: Keyword[];
};
