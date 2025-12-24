// src/services/blog.service.ts

import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    BlogSummaryDto,
    BlogDetailDto,
    BlogFilterParameters,
    PagedResponse,
    CreateBlogRequest,
    UpdateBlogRequest,
    UpdateBlogRelationsRequest,
    BlogCategoryDto,
    CreateBlogCategoryRequest,
    UpdateBlogCategoryRequest,
    BlogRelationItemDto,
    BlogRelationType,
} from '@/types/blog.types';
import { BlogStatus } from '@/types/blog.types';

// Base API endpoint for blog service
const BLOG_ENDPOINTS = {
    BASE: '/blogs',
    HEALTH: '/blogs/health',
    GET_BLOGS: '/blogs',
    GET_BLOG: (id: string) => `/blogs/${id}`,
    CREATE_BLOG: '/blogs',
    UPDATE_BLOG: (id: string) => `/blogs/${id}`,
    DELETE_BLOG: (id: string) => `/blogs/${id}`,
    GET_BLOG_RELATIONS: (id: string) => `/blogs/${id}/relations`,
    UPDATE_BLOG_RELATIONS: (id: string) => `/blogs/${id}/relations`,
    // Categories
    GET_CATEGORIES: '/blog/categories',
    GET_CATEGORY: (id: number) => `/blog/categories/${id}`,
    CREATE_CATEGORY: '/blog/categories',
    UPDATE_CATEGORY: (id: number) => `/blog/categories/${id}`,
    DELETE_CATEGORY: (id: number) => `/blog/categories/${id}`,
} as const;

// Helper to build query params for getBlogs with reduced complexity
const buildBlogQueryParams = (params?: BlogFilterParameters): Record<string, any> => {
    if (!params) {
        return {};
    }

    const queryParams: Record<string, any> = {};

    const mappings: Array<[keyof BlogFilterParameters, string]> = [
        ['page', 'page'],
        ['pageSize', 'pageSize'],
        ['tag', 'tag'],
        ['source', 'source'],
        ['status', 'status'],
        ['keyword', 'keyword'],
        ['titleOnly', 'titleOnly'],
        ['categoryId', 'categoryId'],
    ];

    for (const [key, queryKey] of mappings) {
        const value = params[key];
        if (value !== undefined && value !== null) {
            queryParams[queryKey] = value;
        }
    }

    if (params.featured !== undefined) {
        queryParams.featured = params.featured;
    }

    return queryParams;
};

export class BlogService {
    /**
     * Health check for blog service
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog service is healthy',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Health check failed');
        }
    }

    /**
     * Get blogs with filtering and pagination
     */
    static async getBlogs(
        params?: BlogFilterParameters
    ): Promise<ApiResponse<PagedResponse<BlogSummaryDto>>> {
        try {
            const queryParams = buildBlogQueryParams(params);

            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.GET_BLOGS, {
                params: queryParams,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blogs retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve blogs');
        }
    }

    /**
     * Get blog by ID
     */
    static async getBlogById(id: string): Promise<ApiResponse<BlogDetailDto>> {
        try {
            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.GET_BLOG(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get blog');
        }
    }

    /**
     * Create a new blog
     */
    static async createBlog(request: CreateBlogRequest): Promise<ApiResponse<BlogDetailDto>> {
        try {
            // ensure newly created blogs default to Pending for moderation
            const payload = {
                ...request,
                status: (request as any).status ?? BlogStatus.Pending,
            };
            const response: any = await axiosInstance.post(BLOG_ENDPOINTS.CREATE_BLOG, payload);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create blog');
        }
    }

    /**
     * Update an existing blog
     */
    static async updateBlog(
        id: string,
        request: UpdateBlogRequest
    ): Promise<ApiResponse<BlogDetailDto>> {
        try {
            const response: any = await axiosInstance.put(BLOG_ENDPOINTS.UPDATE_BLOG(id), request);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update blog');
        }
    }

    /**
     * Delete a blog
     */
    static async deleteBlog(id: string): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.delete(BLOG_ENDPOINTS.DELETE_BLOG(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete blog');
        }
    }

    /**
     * Get blog relations
     */
    static async getBlogRelations(
        id: string,
        relationType?: BlogRelationType
    ): Promise<ApiResponse<BlogRelationItemDto[]>> {
        try {
            const params = relationType ? { relationType } : {};
            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.GET_BLOG_RELATIONS(id), {
                params,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog relations retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get blog relations');
        }
    }

    /**
     * Update blog relations
     */
    static async updateBlogRelations(
        id: string,
        request: UpdateBlogRelationsRequest
    ): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.put(
                BLOG_ENDPOINTS.UPDATE_BLOG_RELATIONS(id),
                request
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Blog relations updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update blog relations');
        }
    }

    // ========== Category Methods ==========

    /**
     * Get all blog categories
     */
    static async getCategories(
        includeChildren: boolean = true
    ): Promise<ApiResponse<BlogCategoryDto[]>> {
        try {
            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.GET_CATEGORIES, {
                params: { includeChildren },
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Categories retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve categories');
        }
    }

    /**
     * Get category by ID
     */
    static async getCategoryById(
        id: number,
        includeChildren: boolean = true
    ): Promise<ApiResponse<BlogCategoryDto>> {
        try {
            const response: any = await axiosInstance.get(BLOG_ENDPOINTS.GET_CATEGORY(id), {
                params: { includeChildren },
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Category retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get category');
        }
    }

    /**
     * Create a new category
     */
    static async createCategory(
        request: CreateBlogCategoryRequest
    ): Promise<ApiResponse<BlogCategoryDto>> {
        try {
            const response: any = await axiosInstance.post(BLOG_ENDPOINTS.CREATE_CATEGORY, request);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Category created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create category');
        }
    }

    /**
     * Update an existing category
     */
    static async updateCategory(
        id: number,
        request: UpdateBlogCategoryRequest
    ): Promise<ApiResponse<BlogCategoryDto>> {
        try {
            const response: any = await axiosInstance.put(
                BLOG_ENDPOINTS.UPDATE_CATEGORY(id),
                request
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Category updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update category');
        }
    }

    /**
     * Delete a category
     */
    static async deleteCategory(id: number): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.delete(BLOG_ENDPOINTS.DELETE_CATEGORY(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Category deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete category');
        }
    }
}

// Export individual methods for convenience
export const {
    healthCheck,
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogRelations,
    updateBlogRelations,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = BlogService;

// Default export
export default BlogService;
