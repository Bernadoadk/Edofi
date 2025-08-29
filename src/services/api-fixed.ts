const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

// Interface pour la réponse du backend
interface BackendUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User | BackendUser;
    token: string;
  };
}

interface ProfileResponse {
  success: boolean;
  data: {
    user: User & {
      createdAt: string;
      updatedAt?: string;
    };
  };
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Helper method to handle fetch errors
  private async handleFetchError(error: any): Promise<never> {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }

  // Helper method to adapt backend user to frontend user
  private adaptBackendUser(backendUser: BackendUser): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      role: 'user' // Valeur par défaut
    };
  }

  // Auth endpoints
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      // Adapter les données pour le backend
      const backendData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName
      };

      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      const data = await this.handleResponse<AuthResponse>(response);
      
      // Adapter la réponse pour le frontend
      if (data.data?.token) {
        const backendUser = data.data.user as BackendUser;
        const adaptedUser = this.adaptBackendUser(backendUser);
        
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(adaptedUser));
        
        // Retourner la réponse adaptée
        return {
          ...data,
          data: {
            ...data.data,
            user: adaptedUser
          }
        };
      }
      
      return data;
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async signin(credentials: SigninData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await this.handleResponse<AuthResponse>(response);
      
      // Adapter la réponse pour le frontend
      if (data.data?.token) {
        const backendUser = data.data.user as BackendUser;
        const adaptedUser = this.adaptBackendUser(backendUser);
        
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(adaptedUser));
        
        // Retourner la réponse adaptée
        return {
          ...data,
          data: {
            ...data.data,
            user: adaptedUser
          }
        };
      }
      
      return data;
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return await this.handleResponse<ProfileResponse>(response);
  }

  async updateProfile(profileData: ProfileData): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await this.handleResponse<ProfileResponse>(response);
    
    // Update stored user data
    if (data.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async changePassword(passwordData: PasswordData): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseURL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });

    return await this.handleResponse<{ success: boolean; message: string }>(response);
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    const response = await fetch('http://localhost:5000/health');
    return await this.handleResponse<{ success: boolean; message: string; timestamp: string }>(response);
  }

  // Generic HTTP methods for other services
  async get(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async post(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async postFormData(endpoint: string, formData: FormData): Promise<any> {
    try {
      const headers = this.getAuthHeaders();
      // Ne pas inclure Content-Type pour FormData, le navigateur le définira automatiquement
      delete headers['Content-Type'];
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      const responseText = await response.text();
      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async put(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async patch(endpoint: string, data?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        ...(data && { body: JSON.stringify(data) })
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  async delete(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleFetchError(error);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export { apiService };
export default apiService;
