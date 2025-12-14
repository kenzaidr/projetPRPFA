export type Language = 'ar' | 'fr' | 'en';

export interface TranslationConfig {
    lang: string;
    dir: 'rtl' | 'ltr';
    label?: string;
}

export interface RideRequest {
    id: string;
    passengerName: string;
    pickupLocation: string;
    dropoffLocation: string;
    price: number;
    distance: string;
    rating: number;
    time: string;
}

export interface DriverStats {
    todayEarnings: number;
    totalRides: number;
    onlineHours: number;
    acceptanceRate: number;
}

export type PartnerRegistrationData = {
    partnerType: 'driver' | 'restaurant';
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    vehicleModel?: string;
    licensePlate?: string;
    vehicleType?: string;
    restaurantName?: string;
    restaurantAddress?: string;
    cuisineType?: string;
    agreedToTerms: boolean;
};