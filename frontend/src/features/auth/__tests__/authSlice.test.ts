import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, {
  loginAsync,
  registerAsync,
  logoutAsync,
  clearError,
  setUser,
} from '../authSlice';
import * as authService from '../../../api/authService';

// Define AuthState type locally for testing
interface AuthState {
  token: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'agent' | 'operator';
    subscriptions: string[];
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Mock the auth service
vi.mock('../../../api/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}));

describe('authSlice', () => {
  const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state when localStorage is empty', () => {
      localStorage.clear();
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    });

    it('should load state from localStorage if available', () => {
      const token = 'test-token';
      const user = { _id: '1', name: 'Test', email: 'test@test.com', role: 'agent' as const, subscriptions: [] };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const state = authReducer(undefined, { type: 'unknown' });
      expect(state.token).toBe(token);
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearError', () => {
    it('should clear error from state', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
      };

      const newState = authReducer(stateWithError, clearError());
      expect(newState.error).toBe(null);
    });
  });

  describe('setUser', () => {
    it('should set user in state and localStorage', () => {
      const user = {
        _id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'operator' as const,
        subscriptions: [],
      };

      const newState = authReducer(initialState, setUser(user));
      expect(newState.user).toEqual(user);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });
  });

  describe('loginAsync', () => {
    it('should handle pending state', () => {
      const action = { type: loginAsync.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          _id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'agent' as const,
          subscriptions: [],
        },
      };

      vi.mocked(authService.login).mockResolvedValue(mockResponse);

      const pendingAction = { type: loginAsync.pending.type };
      const fulfilledAction = {
        type: loginAsync.fulfilled.type,
        payload: mockResponse,
      };

      let state = authReducer(initialState, pendingAction);
      state = authReducer(state, fulfilledAction);

      expect(state.loading).toBe(false);
      expect(state.token).toBe(mockResponse.token);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Invalid credentials';
      const pendingAction = { type: loginAsync.pending.type };
      const rejectedAction = {
        type: loginAsync.rejected.type,
        payload: errorMessage,
      };

      let state = authReducer(initialState, pendingAction);
      state = authReducer(state, rejectedAction);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
    });
  });

  describe('registerAsync', () => {
    it('should handle pending state', () => {
      const action = { type: registerAsync.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const mockResponse = {
        token: 'new-token',
        user: {
          _id: '2',
          name: 'New User',
          email: 'new@test.com',
          role: 'operator' as const,
          subscriptions: [],
        },
      };

      const pendingAction = { type: registerAsync.pending.type };
      const fulfilledAction = {
        type: registerAsync.fulfilled.type,
        payload: mockResponse,
      };

      let state = authReducer(initialState, pendingAction);
      state = authReducer(state, fulfilledAction);

      expect(state.loading).toBe(false);
      expect(state.token).toBe(mockResponse.token);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Email already exists';
      const pendingAction = { type: registerAsync.pending.type };
      const rejectedAction = {
        type: registerAsync.rejected.type,
        payload: errorMessage,
      };

      let state = authReducer(initialState, pendingAction);
      state = authReducer(state, rejectedAction);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logoutAsync', () => {
    it('should handle pending state', () => {
      const loggedInState: AuthState = {
        token: 'test-token',
        user: {
          _id: '1',
          name: 'Test',
          email: 'test@test.com',
          role: 'agent' as const,
          subscriptions: [],
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const action = { type: logoutAsync.pending.type };
      const state = authReducer(loggedInState, action);
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state and clear everything', () => {
      const loggedInState: AuthState = {
        token: 'test-token',
        user: {
          _id: '1',
          name: 'Test',
          email: 'test@test.com',
          role: 'agent' as const,
          subscriptions: [],
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(loggedInState.user));

      const pendingAction = { type: logoutAsync.pending.type };
      const fulfilledAction = { type: logoutAsync.fulfilled.type };

      let state = authReducer(loggedInState, pendingAction);
      state = authReducer(state, fulfilledAction);

      expect(state.loading).toBe(false);
      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(null);
      expect(localStorage.getItem('token')).toBe(null);
      expect(localStorage.getItem('user')).toBe(null);
    });

    it('should clear state even on rejection', () => {
      const loggedInState: AuthState = {
        token: 'test-token',
        user: {
          _id: '1',
          name: 'Test',
          email: 'test@test.com',
          role: 'agent' as const,
          subscriptions: [],
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      };

      const rejectedAction = { type: logoutAsync.rejected.type };
      const state = authReducer(loggedInState, rejectedAction);

      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

