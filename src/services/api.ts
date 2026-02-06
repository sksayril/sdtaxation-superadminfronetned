// API Configuration and Service
const API_BASE_URL = 'https://api.sdtaxation.com';

// Types for API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Company related types
export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CreateCompanyRequest {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: CompanyAddress;
  company_website?: string;
  company_logo?: File | string;
  gstNumber?: string;
  fiscalYear?: string; // Format: YYYY-YYYY
  industry?: string;
  constitution_of_business?: string; // Optional, max 500 characters
}

export interface Company {
  _id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: CompanyAddress;
  company_logo?: string;
  company_website?: string;
  gstNumber?: string;
  fiscalYear?: string;
  industry?: string;
  status: string;
  created_by: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
  count: number;
}

export interface CreateCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface GetCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface UpdateCompanyRequest {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: CompanyAddress;
  company_website?: string;
  company_logo?: string;
}

export interface UpdateCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface DeleteCompanyResponse {
  success: boolean;
  message: string;
}

// Admin related types
export interface CreateAdminRequest {
  fullname: string;
  username: string;
  email: string;
  role: string;
  password: string;
  originalPassword: string;
  phone: string;
  department: string;
  adminArea: string;
  company: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    role: string;
    phone: string;
    department: string;
    adminArea: string;
    company: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Admin {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  originalPassword: string;
  role: string;
  phone: string;
  department: string;
  adminArea: string;
  company: {
    _id: string;
    company_name: string;
    company_email: string;
  } | null;
  created_by: any;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminsResponse {
  success: boolean;
  message: string;
  data: Admin[];
}

export interface UpdateAdminRequest {
  fullname?: string;
  username?: string;
  email?: string;
  role?: string;
  phone?: string;
  department?: string;
  adminArea?: string;
  company?: string;
}

export interface UpdateAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface DeleteAdminResponse {
  success: boolean;
  message: string;
}

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
    // Also store token expiration time if available in token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        // Store expiration timestamp
        localStorage.setItem('auth_token_exp', payload.exp.toString());
      }
    } catch (error) {
      console.warn('Could not parse token expiration:', error);
    }
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_exp');
  },
  
  getUserData: (): { id: string; name: string; email: string } | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  setUserData: (userData: { id: string; name: string; email: string }): void => {
    localStorage.setItem('user_data', JSON.stringify(userData));
  },
  
  removeUserData: (): void => {
    localStorage.removeItem('user_data');
  },
  
  clearAuth: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_exp');
    localStorage.removeItem('user_data');
  },

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Check expiration from stored timestamp
      const expTimestamp = localStorage.getItem('auth_token_exp');
      if (expTimestamp) {
        const expTime = parseInt(expTimestamp, 10);
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= expTime;
      }

      // Fallback: decode token and check exp claim
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= payload.exp;
      }

      // If no expiration in token, assume it's valid (server will validate)
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      // If we can't parse the token, consider it expired
      return true;
    }
  },

  getTokenExpirationTime(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const expTimestamp = localStorage.getItem('auth_token_exp');
      if (expTimestamp) {
        return parseInt(expTimestamp, 10);
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload && payload.exp) || null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }
};

// API service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Generic request method
   *
   * NOTE: We extend RequestInit with a `skipAuth` flag so that
   * unauthenticated endpoints (like `/login`) can bypass the
   * token/expiration checks and Authorization header injection.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;
    const token = skipAuth ? null : tokenManager.getToken();

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
    };

    try {
      // Check if token is expired before making request (for auth-protected routes only)
      if (!skipAuth && token && tokenManager.isTokenExpired()) {
        // Create a custom error for token expiration
        const expiredError: any = new Error('Token expired');
        expiredError.isTokenExpired = true;
        throw expiredError;
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Check for 401 Unauthorized (token expired/invalid)
        if (response.status === 401) {
          const expiredError: any = new Error(data?.message || 'Unauthorized - Token expired');
          expiredError.isTokenExpired = true;
          // Trigger global token expiration handler if available
          if (typeof (window as any).__handleTokenExpiration === 'function') {
            (window as any).__handleTokenExpiration();
          }
          throw expiredError;
        }
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      // Re-throw with isTokenExpired flag if it's a token expiration error
      if (error.isTokenExpired) {
        throw error;
      }
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Login must NOT be blocked by an expired/invalid existing token.
    // We explicitly skip auth so the request always reaches the server.
    return this.request<LoginResponse>('/api/superadmin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
  }

  // Super admin specific endpoints
  async getSuperAdminProfile(): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/superadmin/profile');
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/superadmin/logout', {
      method: 'POST',
    });
  }

  // Company endpoints
  async getCompanies(): Promise<CompaniesResponse> {
    return this.request<CompaniesResponse>('/api/companies');
  }

  async createCompany(companyData: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    
    // Add required fields
    formData.append('company_name', companyData.company_name);
    formData.append('company_email', companyData.company_email);
    formData.append('company_phone', companyData.company_phone);
    
    // Add address as JSON string
    formData.append('company_address', JSON.stringify(companyData.company_address));
    
    // Add optional fields if they exist
    if (companyData.company_website) {
      formData.append('company_website', companyData.company_website);
    }
    
    if (companyData.gstNumber) {
      formData.append('gstNumber', companyData.gstNumber);
    }
    
    if (companyData.fiscalYear) {
      formData.append('fiscalYear', companyData.fiscalYear);
    }
    
    if (companyData.industry) {
      formData.append('industry', companyData.industry);
    }
    
    if (companyData.constitution_of_business) {
      formData.append('constitution_of_business', companyData.constitution_of_business);
    }
    
    // Use custom request for FormData (don't set Content-Type header)
    const url = `${this.baseURL}/api/companies/create`;
    const token = tokenManager.getToken();
    
    if (token && tokenManager.isTokenExpired()) {
      const expiredError: any = new Error('Token expired');
      expiredError.isTokenExpired = true;
      throw expiredError;
    }
    
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type - browser will set it with boundary for FormData
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        success: false,
        message: data.message || 'Failed to create company',
        error: data.error,
      };
      throw error;
    }
    
    return data;
  }

  async getCompanyById(companyId: string): Promise<GetCompanyResponse> {
    return this.request<GetCompanyResponse>(`/api/companies/${companyId}`);
  }

  async updateCompany(companyId: string, companyData: UpdateCompanyRequest): Promise<UpdateCompanyResponse> {
    return this.request<UpdateCompanyResponse>(`/api/companies/${companyId}`, {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(companyId: string): Promise<DeleteCompanyResponse> {
    return this.request<DeleteCompanyResponse>(`/api/companies/${companyId}/delete`, {
      method: 'POST',
    });
  }

  // Admin endpoints
  async createAdmin(adminData: CreateAdminRequest): Promise<CreateAdminResponse> {
    return this.request<CreateAdminResponse>('/api/superadmin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async getAdmins(): Promise<AdminsResponse> {
    return this.request<AdminsResponse>('/api/superadmin/admins', {
      method: 'GET',
    });
  }

  async updateAdmin(adminId: string, adminData: UpdateAdminRequest): Promise<UpdateAdminResponse> {
    return this.request<UpdateAdminResponse>(`/api/superadmin/update-admin/${adminId}`, {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async deleteAdmin(adminId: string): Promise<DeleteAdminResponse> {
    return this.request<DeleteAdminResponse>(`/api/superadmin/delete-admin/${adminId}`, {
      method: 'POST',
    });
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getToken();
  }

  // Subscription Plans endpoints
  async createSubscriptionPlan(data: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
    return this.request<SubscriptionPlanResponse>('/api/subscription-plans/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscriptionPlans(isActive?: boolean): Promise<SubscriptionPlansResponse> {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return this.request<SubscriptionPlansResponse>(`/api/subscription-plans${query}`, {
      method: 'GET',
    });
  }

  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlanResponse> {
    return this.request<SubscriptionPlanResponse>(`/api/subscription-plans/${id}`, {
      method: 'GET',
    });
  }

  async updateSubscriptionPlan(id: string, data: Partial<CreateSubscriptionPlanRequest>): Promise<SubscriptionPlanResponse> {
    return this.request<SubscriptionPlanResponse>(`/api/subscription-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscriptionPlan(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/subscription-plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Company Subscriptions endpoints
  async assignSubscription(data: AssignSubscriptionRequest): Promise<CompanySubscriptionResponse> {
    return this.request<CompanySubscriptionResponse>('/api/company-subscriptions/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanySubscriptions(status?: string, companyId?: string): Promise<CompanySubscriptionsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (companyId) params.append('company', companyId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<CompanySubscriptionsResponse>(`/api/company-subscriptions${query}`, {
      method: 'GET',
    });
  }

  async getCompanySubscriptionById(id: string): Promise<CompanySubscriptionResponse> {
    return this.request<CompanySubscriptionResponse>(`/api/company-subscriptions/${id}`, {
      method: 'GET',
    });
  }

  async getCompanySubscriptionByCompanyId(companyId: string): Promise<CompanySubscriptionResponse> {
    return this.request<CompanySubscriptionResponse>(`/api/company-subscriptions/company/${companyId}`, {
      method: 'GET',
    });
  }

  async updateCompanySubscription(id: string, data: UpdateSubscriptionRequest): Promise<CompanySubscriptionResponse> {
    return this.request<CompanySubscriptionResponse>(`/api/company-subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCompanySubscription(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/company-subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardData(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/api/superadmin/dashboard', {
      method: 'GET',
    });
  }
}

// Dashboard related types
export interface DashboardSummary {
  totalRevenue: number;
  activeRevenue: number;
  totalBalance: number;
  activeClients: number;
  totalCompanies: number;
  returnsFiled: number;
  taxSaved: number;
}

export interface DashboardKPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
  suspended: number;
  revenue: {
    total: number;
    active: number;
    expired: number;
  };
}

export interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  withSubscription: number;
  withoutSubscription: number;
}

export interface UserStats {
  admins: {
    total: number;
    active: number;
  };
  hr: {
    total: number;
    active: number;
  };
  employees: {
    total: number;
    active: number;
  };
  total: number;
}

export interface CompanyBalance {
  companyId: string;
  companyName: string;
  companyEmail: string;
  status: string;
  balance: number;
  ledgerCount: number;
  voucherCount: number;
  subscription: {
    planName: string;
    status: string;
    isActive: boolean;
    endDate: string;
  } | null;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
  subscriptions: number;
}

export interface ServiceDistribution {
  name: string;
  count: number;
  percentage: string;
}

export interface RecentTransaction {
  voucherNumber: string;
  type: string;
  date: string;
  amount: number;
  company: string;
}

export interface PlanSummary {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface PlansData {
  total: number;
  active: number;
  list: PlanSummary[];
}

export interface DashboardData {
  summary: DashboardSummary;
  kpis: DashboardKPI[];
  subscriptions: SubscriptionStats;
  companies: CompanyStats;
  users: UserStats;
  companyBalances: CompanyBalance[];
  revenueTrend: RevenueTrend[];
  serviceDistribution: ServiceDistribution[];
  recentTransactions: RecentTransaction[];
  plans: PlansData;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

// Subscription Plan related types
export interface CreateSubscriptionPlanRequest {
  planName: string;
  description?: string;
  price: number;
  currency?: string;
  duration: number;
  features?: string[];
  maxEmployees?: number | null;
  maxAdmins?: number;
  isActive?: boolean;
}

export interface SubscriptionPlan {
  _id: string;
  planName: string;
  description?: string;
  price: number;
  currency: string;
  duration: number;
  features?: string[];
  maxEmployees?: number | null;
  maxAdmins?: number;
  isActive: boolean;
  created_by?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
  count: number;
}

export interface SubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

// Company Subscription related types
export interface AssignSubscriptionRequest {
  company: string;
  plan: string;
  startDate?: string;
  endDate: string;
  autoRenew?: boolean;
  notes?: string;
}

export interface CompanySubscription {
  _id: string;
  company: {
    _id: string;
    company_name: string;
    company_email?: string;
  };
  plan: {
    _id: string;
    planName: string;
    price?: number;
    duration?: number;
  };
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'suspended';
  autoRenew: boolean;
  notes?: string;
  assigned_by?: {
    _id: string;
    name: string;
    email: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySubscriptionsResponse {
  success: boolean;
  message: string;
  data: CompanySubscription[];
  count: number;
}

export interface CompanySubscriptionResponse {
  success: boolean;
  message: string;
  data: CompanySubscription;
}

export interface UpdateSubscriptionRequest {
  endDate?: string;
  status?: 'active' | 'expired' | 'cancelled' | 'suspended';
  autoRenew?: boolean;
  notes?: string;
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
