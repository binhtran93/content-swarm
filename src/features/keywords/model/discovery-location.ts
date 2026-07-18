export type DiscoveryLanguage = {
  languageCode: string;
  languageName: string;
};

export type DiscoveryLocation = {
  locationCode: number;
  locationName: string;
  countryCode: string;
  languages: DiscoveryLanguage[];
};
