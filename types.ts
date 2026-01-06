export enum EventStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TrackSource {
  YOUTUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY'
}

export interface EventsDto {
  id?: number;
  title: string;
  venueName: string;
  location: string;
  startDate: string; // ISO Date string
  ticketLink: string;
  imageUrl?: string;
  locationLongitude?: number;
  locationLatitude?: number;
  status: EventStatus;
}

export interface MerchandiseDto {
  id?: number;
  merchandiseName: string;
  merchandisePrice: string;
  merchandiseImg?: string;
  merchandiseDetails: string;
}

export interface TrackDto {
  id?: number;
  title: string;
  source: TrackSource; // Maps to 'type' in backend if needed, keeping 'source' for frontend consistency
  link: string; // This handles the 'storageUrl' or 'videoId' depending on implementation
}

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export interface User {
  username: string;
  role: UserRole;
}