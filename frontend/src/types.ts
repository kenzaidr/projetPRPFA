export type Language = 'ar' | 'fr' | 'en';

export interface TranslationConfig {
    lang: string;
    dir: 'rtl' | 'ltr';
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