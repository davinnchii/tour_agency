
import api from '../utils/api';

export const getTours = () => api.get('/api/tours');
export const searchTours = (query) => api.get(`/api/tours?search=${query}`);
export const createTour = (data) => api.post('/api/tours', data);
export const deleteTour = (id) => api.delete(`/api/tours/${id}`);