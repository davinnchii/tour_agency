import { CreateSubscriptionPayload } from '@/types';
import api from '@/utils/api';

export interface SubscriptionData {
    agency: string;
    operator: string;
}

export const createSubscription = (data: CreateSubscriptionPayload) => api.post('/api/subscriptions', data);
export const getSubscriptions = () => api.get('/api/subscriptions');
export const deleteSubscription = (id: string | number) => api.delete(`/api/subscriptions/${id}`);
