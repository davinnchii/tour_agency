// Utility functions for handling query parameters
export const buildQueryString = (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams()
  
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "number") {
          queryParams.append(key, value.toString())
        } else if (typeof value === "string") {
          queryParams.append(key, value)
        } else if (typeof value === "boolean") {
          queryParams.append(key, value.toString())
        }
      }
    })
  
    return queryParams.toString()
  }
  
  export const buildApiUrl = (baseUrl: string, params?: Record<string, any>): string => {
    if (!params) return baseUrl
  
    const queryString = buildQueryString(params)
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
  
  // Type-safe query parameter builder
  export const createQueryParams = <T extends Record<string, string | number | boolean | undefined>>(
    params: T,
  ): URLSearchParams => {
    const queryParams = new URLSearchParams();
    (Object.keys(params) as Array<keyof T>).forEach((key) => {
      const value = params[key]
      if (value !== undefined && value !== null) {
        queryParams.append(String(key), String(value))
      }
    })
  
    return queryParams
  }
  