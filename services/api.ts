import axios from 'axios';
import { EventsDto, MerchandiseDto, TrackDto } from '../types';

const DEFAULT_API_BASE_URL = 'https://music-0o1i.onrender.com/api';
const API_BASE_URL = String((import.meta as any).env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const AuthService = {
  login: async (username: string, password: string) => {
    const response = await api.post<{ accessToken: string; tokenType?: string }>('/auth/login', {
      username,
      password,
    });
    return response.data.accessToken;
  },
  register: async (username: string, password: string) => {
    const response = await api.post<string>('/auth/register', {
      username,
      password,
    });
    return response.data;
  },
};

export const MerchandiseService = {
  getAll: async () => {
    const response = await api.get<MerchandiseDto[]>('/merchandise/getAll');
    return response.data;
  },
  create: async (data: any, file: File | null, token: string) => {
    const formData = new FormData();
    formData.append('merchandiseName', data.merchandiseName);
    formData.append('merchandisePrice', data.merchandisePrice); 
    formData.append('merchandiseDetails', data.merchandiseDetails);
    
    if (file) {
      formData.append('merchandiseImg', file);
    }
    
    return api.post('/merchandise/upload', formData, { 
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      } 
    });
  },
  delete: async (id: number, token: string) => {
    return api.delete(`/merchandise/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
  },
};

export const EventService = {
  getAll: async () => {
    const response = await api.get<EventsDto[]>('/events/getAll');
    return response.data;
  },
  create: async (data: any, file: File | null, token: string) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('venueName', data.venueName);
    formData.append('location', data.location);
    formData.append('startDate', data.startDate);
    formData.append('ticketLink', data.ticketLink);
    formData.append('LocationLongitude', data.LocationLongitude);
    formData.append('LocationLatitude', data.LocationLatitude);
    formData.append('status', data.status);
    
    if (file) {
      formData.append('imageUrl', file);
    }

    return api.post('/events/create', formData, { 
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      } 
    });
  },
  delete: async (id: number, token: string) => {
    return api.delete(`/events/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
  },
};

export const TrackService = {
  getAll: async () => {
    const response = await api.get<TrackDto[]>('/track/getAll');
    return response.data;
  },
  create: async (track: TrackDto, token: string) => {
    return api.post('/track/upload', track, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  delete: async (id: number, token: string) => {
    return api.delete(`/track/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
  },
};