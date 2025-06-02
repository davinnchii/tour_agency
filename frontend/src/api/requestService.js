import api from "../utils/api";

export const createRequest = (data) => api.post('/api/requests', data);
export const getRequests = () => api.get('/api/requests');
export const deleteRequest = (id) => api.delete(`/api/requests/${id}`)