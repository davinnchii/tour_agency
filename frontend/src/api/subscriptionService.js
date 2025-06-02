import api from "../utils/api";

export const createSubscription = (data) => api.post('/api/subscriptions', data);
export const getSubscriptions = () => api.get('/api/subscriptions');
export const deleteSubscription = (id) => api.delete(`/api/subscriptions/${id}`)
