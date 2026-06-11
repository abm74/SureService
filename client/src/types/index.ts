export type UserRole = "customer" | "provider" | "admin";

export type VerificationStatus = "unverified" | "pending" | "approved" | "rejected";

export type BookingStatus = "pending" | "accepted" | "declined" | "cancelled" | "completed";

export type CancelledBy = "customer" | "provider" | null;

export interface TrustBreakdown {
  profileScore: number;
  verificationScore: number;
  completedJobsScore: number;
  repeatBonusScore: number;
  cancellationPenalty: number;
}

export interface UserLocation {
  city: string;
  subCity: string;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  location?: UserLocation;
  category?: string;
  hourlyRate?: number;
  experienceYears?: number;
  skills?: string[];
  verificationStatus?: VerificationStatus;
  verificationDocUrl?: string;
  verificationDocType?: string;
  verificationSubmittedAt?: string | null;
  verificationReviewedAt?: string | null;
  verificationRejectionReason?: string;
  trustScore?: number;
  trustBreakdown?: TrustBreakdown;
  completedJobsCount?: number;
  repeatCustomerCount?: number;
  providerCancelledCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProviderWithDetails extends User {
  averageRating: number;
  reviewCount: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  hasContactAccess?: boolean;
}

export interface Booking {
  id: string;
  customer: User | string;
  provider: User | string;
  category: string;
  serviceDate: string;
  timeSlot: string;
  address: string;
  city: string;
  subCity: string;
  notes?: string;
  status: BookingStatus;
  cancelledBy?: CancelledBy;
  cancellationReason?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  booking: string;
  customer: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  } | User | string;
  provider: string | User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export interface ProviderDetailsResponse {
  provider: ProviderWithDetails;
  reviews: Review[];
}

export interface ProviderFilters {
  category?: string;
  city?: string;
  subCity?: string;
  search?: string;
  minScore?: number;
  verificationStatus?: string;
  verifiedOnly?: boolean;
  sortBy?: "trustScore" | "completedJobs" | "rateAsc" | "rateDesc" | "newest";
}

export interface CreateBookingPayload {
  providerId: string;
  category?: string;
  serviceDate: string;
  timeSlot: string;
  address: string;
  city?: string;
  subCity?: string;
  notes?: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface UpdateProviderProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
  category?: string;
  hourlyRate?: number;
  experienceYears?: number;
  skills?: string[];
  avatar?: string;
  location?: Partial<UserLocation>;
}

export interface SignupPayload {
  name?: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  bio?: string;
  category?: string;
  hourlyRate?: number;
  experienceYears?: number;
  skills?: string[];
  location?: UserLocation;
}

export interface PlatformStats {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalBookings: number;
  completedBookings: number;
  pendingVerifications: number;
}

export type AsyncData<T> = {
  data: T;
  status: "initial" | "loading" | "success" | "error";
  error: null | string;
};

export interface City {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
}

export interface Country {
  countryName: string;
  emoji: string;
}

export type MapSelectedCity = {
  cityName: string;
  country: string;
  flagEmoji: string;
  position: { lat: number; lng: number } | null;
};