// PIN Code API utility for Indian postal codes
// API Documentation: https://api.postalpincode.in/

export interface PostOffice {
  Name: string;
  Description: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
  PINCode?: string;
}

export interface PincodeApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

/**
 * Fetch post office details by PIN code
 * @param pincode - 6-digit Indian PIN code
 * @returns Promise with post office details
 */
export async function getPostOfficeByPincode(pincode: string): Promise<PincodeApiResponse> {
  try {
    // Validate PIN code format (6 digits)
    const cleanPincode = pincode.trim().replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      return {
        Message: 'Invalid PIN code format. Please enter a 6-digit PIN code.',
        Status: 'Error',
        PostOffice: null
      };
    }

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPincode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PincodeApiResponse[] = await response.json();
    
    // The API returns an array, get the first element
    if (data && data.length > 0) {
      return data[0];
    }

    return {
      Message: 'No data received from API',
      Status: 'Error',
      PostOffice: null
    };
  } catch (error) {
    console.error('Error fetching PIN code data:', error);
    return {
      Message: error instanceof Error ? error.message : 'Failed to fetch PIN code data',
      Status: 'Error',
      PostOffice: null
    };
  }
}

/**
 * Extract address details from post office data
 * @param postOffice - Post office data from API
 * @returns Address object with city, state, district, country
 */
export function extractAddressFromPostOffice(postOffice: PostOffice) {
  return {
    city: postOffice.District || postOffice.Name || '',
    state: postOffice.State || '',
    district: postOffice.District || '',
    country: postOffice.Country || 'India',
    region: postOffice.Region || '',
    division: postOffice.Division || ''
  };
}

