
import api from '../utils/api';

export const fetchTours = () => api.get('/api/tours');
export const searchTours = (query) => api.get(`/api/tours?search=${query}`);
export const createSubscription = (data) => api.post('/api/subscriptions', data);
export const createTour = (data) => api.post('/api/tours', data);
export const deleteTour = (id) => api.delete(`/api/tours/${id}`);
export const fetchSubscriptions = () => api.get('/api/subscriptions');
export const getSubscriptions = () => api.get('/api/subscriptions');