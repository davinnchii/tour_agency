import api from "../utils/api";

export const fetchOperators = () => api.get('/api/users/operators');
