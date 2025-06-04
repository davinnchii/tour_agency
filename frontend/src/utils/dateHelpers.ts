export const dateToISOString = (date: Date): string => {
    return date.toISOString()
  }
  
  export const stringToDate = (dateString: string): Date => {
    return new Date(dateString)
  }
  
  export const formatDateForInput = (dateString: string): string => {
    return dateString.split("T")[0]
  }
  
  export const formatDateForDisplay = (dateString: string, locale = "en-US"): string => {
    return new Date(dateString).toLocaleDateString(locale)
  }
  
  export const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime())
  }
  
  export const isValidDateString = (dateString: string): boolean => {
    const date = new Date(dateString)
    return isValidDate(date)
  }
  