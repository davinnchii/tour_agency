export const getCountryTranslationKey = (englishCountryName: string): string => {
    const countryMap: Record<string, string> = {
      Ukraine: "countries.ukraine",
      Poland: "countries.poland",
      Italy: "countries.italy",
      Spain: "countries.spain",
      Egypt: "countries.egypt",
      Turkey: "countries.turkey",
      France: "countries.france",
      Germany: "countries.germany",
      Greece: "countries.greece",
      Tunisia: "countries.tunisia",
    }
  
    return countryMap[englishCountryName] || englishCountryName
  }
  
  export const getCountryOptions = (t: (key: string) => string) => [
    { value: "Ukraine", label: t("countries.ukraine") },
    { value: "Poland", label: t("countries.poland") },
    { value: "Italy", label: t("countries.italy") },
    { value: "Spain", label: t("countries.spain") },
    { value: "Egypt", label: t("countries.egypt") },
    { value: "Turkey", label: t("countries.turkey") },
    { value: "France", label: t("countries.france") },
    { value: "Germany", label: t("countries.germany") },
    { value: "Greece", label: t("countries.greece") },
    { value: "Tunisia", label: t("countries.tunisia") },
  ]