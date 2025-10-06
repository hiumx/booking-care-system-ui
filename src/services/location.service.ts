// src/services/location.service.ts

import { ApiResponse } from '@/configs/axios.config';

// Location Types
export interface Province {
    id: string;
    name: string;
    code: string;
}

export interface District {
    id: string;
    name: string;
    code: string;
    provinceId: string;
}

export interface Ward {
    id: string;
    name: string;
    code: string;
    districtId: string;
}

// API Response Types
interface ProvinceApiResponse {
    code: number;
    name: string;
}

interface DistrictApiResponse {
    code: number;
    name: string;
}

interface WardApiResponse {
    code: number;
    name: string;
}

interface ProvinceWithDistrictsApiResponse {
    code: number;
    name: string;
    districts: DistrictApiResponse[];
}

interface DistrictWithWardsApiResponse {
    code: number;
    name: string;
    wards: WardApiResponse[];
}

export class LocationService {
    private static readonly PROVINCES_API_URL = 'https://provinces.open-api.vn/api/?depth=1';
    private static readonly DISTRICTS_API_URL = 'https://provinces.open-api.vn/api/?depth=2';
    private static readonly WARDS_API_URL = 'https://provinces.open-api.vn/api/?depth=3';

    /**
     * Get all provinces/cities
     */
    static async getProvinces(): Promise<ApiResponse<Province[]>> {
        try {
            const response = await fetch(this.PROVINCES_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProvinceApiResponse[] = await response.json();
            const provinces: Province[] = data.map((item) => ({
                id: item.code.toString(),
                name: item.name,
                code: item.code.toString(),
            }));

            return {
                success: true,
                data: provinces,
                message: 'Provinces retrieved successfully',
            };
        } catch (error: any) {
            console.error('Error fetching provinces:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch provinces',
            };
        }
    }

    /**
     * Get all districts by province ID
     */
    static async getDistrictsByProvinceId(provinceId: string): Promise<ApiResponse<District[]>> {
        try {
            const response = await fetch(this.DISTRICTS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProvinceWithDistrictsApiResponse[] = await response.json();
            const province = data.find((p) => p.code.toString() === provinceId);

            if (!province) {
                return {
                    success: false,
                    data: [],
                    message: 'Province not found',
                };
            }

            const districts: District[] = province.districts.map((district) => ({
                id: district.code.toString(),
                name: district.name,
                code: district.code.toString(),
                provinceId: provinceId,
            }));

            return {
                success: true,
                data: districts,
                message: 'Districts retrieved successfully',
            };
        } catch (error: any) {
            console.error('Error fetching districts:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch districts',
            };
        }
    }

    /**
     * Get all districts (for all provinces)
     */
    static async getAllDistricts(): Promise<ApiResponse<District[]>> {
        try {
            const response = await fetch(this.DISTRICTS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProvinceWithDistrictsApiResponse[] = await response.json();
            const districts: District[] = data.flatMap((province) =>
                province.districts.map((district) => ({
                    id: district.code.toString(),
                    name: district.name,
                    code: district.code.toString(),
                    provinceId: province.code.toString(),
                }))
            );

            return {
                success: true,
                data: districts,
                message: 'All districts retrieved successfully',
            };
        } catch (error: any) {
            console.error('Error fetching all districts:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch districts',
            };
        }
    }

    /**
     * Get all wards by district ID
     */
    static async getWardsByDistrictId(districtId: string): Promise<ApiResponse<Ward[]>> {
        try {
            const response = await fetch(this.WARDS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DistrictWithWardsApiResponse[] = await response.json();
            const district = data.find((d) => d.code.toString() === districtId);

            if (!district) {
                return {
                    success: false,
                    data: [],
                    message: 'District not found',
                };
            }

            const wards: Ward[] = district.wards.map((ward) => ({
                id: ward.code.toString(),
                name: ward.name,
                code: ward.code.toString(),
                districtId: districtId,
            }));

            return {
                success: true,
                data: wards,
                message: 'Wards retrieved successfully',
            };
        } catch (error: any) {
            console.error('Error fetching wards:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch wards',
            };
        }
    }

    /**
     * Get province name by ID
     */
    static async getProvinceNameById(provinceId: string): Promise<string | null> {
        try {
            const response = await this.getProvinces();
            if (response.success && response.data) {
                const province = response.data.find((p) => p.id === provinceId);
                return province?.name || null;
            }
            return null;
        } catch (error) {
            console.error('Error getting province name:', error);
            return null;
        }
    }

    /**
     * Get district name by ID
     */
    static async getDistrictNameById(districtId: string): Promise<string | null> {
        try {
            const response = await this.getAllDistricts();
            if (response.success && response.data) {
                const district = response.data.find((d) => d.id === districtId);
                return district?.name || null;
            }
            return null;
        } catch (error) {
            console.error('Error getting district name:', error);
            return null;
        }
    }

    /**
     * Search provinces by name
     */
    static async searchProvinces(searchTerm: string): Promise<ApiResponse<Province[]>> {
        try {
            const response = await this.getProvinces();
            if (response.success && response.data) {
                const filteredProvinces = response.data.filter((province) =>
                    province.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return {
                    success: true,
                    data: filteredProvinces,
                    message: 'Provinces filtered successfully',
                };
            }
            return response;
        } catch (error: any) {
            console.error('Error searching provinces:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to search provinces',
            };
        }
    }

    /**
     * Search districts by name within a province
     */
    static async searchDistricts(
        provinceId: string,
        searchTerm: string
    ): Promise<ApiResponse<District[]>> {
        try {
            const response = await this.getDistrictsByProvinceId(provinceId);
            if (response.success && response.data) {
                const filteredDistricts = response.data.filter((district) =>
                    district.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return {
                    success: true,
                    data: filteredDistricts,
                    message: 'Districts filtered successfully',
                };
            }
            return response;
        } catch (error: any) {
            console.error('Error searching districts:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to search districts',
            };
        }
    }
}

// Export individual methods for convenience
export const {
    getProvinces,
    getDistrictsByProvinceId,
    getAllDistricts,
    getWardsByDistrictId,
    getProvinceNameById,
    getDistrictNameById,
    searchProvinces,
    searchDistricts,
} = LocationService;

// Default export
export default LocationService;
