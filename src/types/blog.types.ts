// Blog Status Enum
export enum BlogStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Active = 'Active',
    Inactive = 'Inactive',
}

// Category Status Enum
export enum CategoryStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

// Blog Relation Type Enum
export enum BlogRelationType {
    Related = 'Related',
    Suggested = 'Suggested',
}

// Blog Category DTO
export interface BlogCategoryDto {
    id: number;
    categoryName: string;
    description?: string;
    imageUrl?: string;
    status: CategoryStatus;
    parentId?: number;
    createdAt: string;
    updatedAt: string;
    children?: BlogCategoryDto[];
}

// Blog Summary DTO (for list views)
export interface BlogSummaryDto {
    id: string;
    titleVi: string;
    thumbnailUrl?: string;
    tag?: string;
    source?: string;
    createdByName?: string;
    status: BlogStatus;
    featured: boolean;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: BlogCategoryDto;
}

// Blog Relation Item DTO
export interface BlogRelationItemDto {
    blogId: string;
    relationType: BlogRelationType;
    titleVi: string;
    thumbnailUrl?: string;
    tag?: string;
    source?: string;
    publishedAt?: string;
}

// Blog Detail DTO (for detail view)
export interface BlogDetailDto {
    id: string;
    titleVi: string;
    contentVi: string;
    titleEn?: string;
    contentEn?: string;
    thumbnailUrl?: string;
    heroImageUrl?: string;
    tag?: string;
    source?: string;
    createdByName?: string;
    status: BlogStatus;
    featured: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    category?: BlogCategoryDto;
    relations: BlogRelationItemDto[];
}

// Blog Filter Parameters
export interface BlogFilterParameters {
    tag?: string;
    source?: string;
    status?: BlogStatus;
    featured?: boolean;
    keyword?: string;
    page?: number;
    pageSize?: number;
    categoryId?: number;
}

// Paged Response
export interface PagedResponse<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
}

// Create Blog Request
export interface CreateBlogRequest {
    blogCategoryId?: number;
    titleVi: string;
    contentVi: string;
    titleEn?: string;
    contentEn?: string;
    thumbnailUrl?: string;
    heroImageUrl?: string;
    tag?: string;
    source?: string;
    status?: BlogStatus;
    featured?: boolean;
    publishedAt?: string;
}

// Update Blog Request
export type UpdateBlogRequest = CreateBlogRequest;

// Blog Relation Assignment
export interface BlogRelationAssignment {
    relationType: BlogRelationType;
    blogIds: string[];
}

// Update Blog Relations Request
export interface UpdateBlogRelationsRequest {
    relations: BlogRelationAssignment[];
}

// Create Blog Category Request
export interface CreateBlogCategoryRequest {
    categoryName: string;
    description?: string;
    imageUrl?: string;
    status?: CategoryStatus;
    parentId?: number;
}

// Update Blog Category Request
export type UpdateBlogCategoryRequest = CreateBlogCategoryRequest;
