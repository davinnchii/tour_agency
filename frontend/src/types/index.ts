// Base MongoDB document interface
interface BaseDocument {
  _id: string
  createdAt: string
  updatedAt: string
}

// User types based on your schema
export interface User extends BaseDocument {
  name: string
  email: string
  password: string
  role: "agent" | "operator"
  subscriptions: string[] // ObjectId references
}

// Populated user (when subscriptions are populated)
export interface PopulatedUser extends Omit<User, "subscriptions"> {
  subscriptions: Subscription[]
}

// Tour types based on your schema
export interface Tour extends BaseDocument {
  title: string
  description?: string
  country: string
  price: number
  startDate?: string // ISO date string from database
  endDate?: string // ISO date string from database
  operator: string // ObjectId reference
}

// Populated tour (when operator is populated)
export interface PopulatedTour extends Omit<Tour, "operator"> {
  operator: User
}

// Request types based on your schema
export interface Request extends BaseDocument {
  tour: Tour // ObjectId reference
  customerName: string
  customerEmail: string
  status: "pending" | "approved" | "rejected"
  createdBy: string // ObjectId reference
  agency?: string // ObjectId reference (optional)
  operator?: string // ObjectId reference (optional)
}

// Populated request (when references are populated)
export interface PopulatedRequest extends Omit<Request, "tour" | "createdBy" | "agency" | "operator"> {
  tour: Tour
  createdBy: User
  agency?: User
  operator?: User
}

// Subscription types based on your schema
export interface Subscription extends BaseDocument {
  agency: User // ObjectId reference
  operator: User // ObjectId reference
  startDate: string // ISO date string
  endDate?: string // ISO date string (optional)
}

// Populated subscription (when references are populated)
export interface PopulatedSubscription extends Omit<Subscription, "agency" | "operator"> {
  agency: User
  operator: User
}

// Pagination types
export interface PaginatedResponse<T> {
  page: number
  totalPages: number
  total: number
  tours?: T[] // For tours endpoint
  data?: T[] // Generic data field
  items?: T[] // Alternative data field
}

// Specific paginated tour response
export interface PaginatedToursResponse {
  page: number
  totalPages: number
  total: number
  tours: Tour[]
}

// API Response wrapper - Updated to match your backend
export interface ApiResponse<T> {
  data?: T
  message?: string
  success?: boolean
  error?: string
  token?: string // For auth responses
  user?: User // For auth responses
}

// API payload types (what gets sent to the server - uses strings)
export interface CreateTourPayload {
  title: string
  description?: string
  country: string
  price: number
  startDate?: string // ISO string for API
  endDate?: string // ISO string for API
  operator: string
}

export interface CreateRequestPayload {
  tour: string
  customerName: string
  customerEmail: string
  createdBy: string
  agency?: string
  operator?: string
}

export interface CreateSubscriptionPayload {
  agency: string
  operator: string
  endDate?: string
}

// Update payload types
export interface UpdateTourPayload extends Partial<CreateTourPayload> {
  _id?: never // Prevent _id from being updated
}

export interface UpdateRequestPayload extends Partial<CreateRequestPayload> {
  _id?: never
  status?: "pending" | "approved" | "rejected"
}

// Auth types - Updated to match your backend response
export interface LoginPayload {
  token: string
  user: {
    _id: string // Note: backend uses 'id' not '_id'
    name: string
    email: string
    role: "agent" | "operator"
    subscriptions: string[]
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: "agent" | "operator"
}

// Search and filter types
export interface TourSearchParams {
  search?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: "price" | "title" | "country" | "startDate"
  sortOrder?: "asc" | "desc"
}
