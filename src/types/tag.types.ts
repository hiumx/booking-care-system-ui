/**
 * Tag/Label types for conversation management
 * Allows users to organize and filter their conversations
 */

/**
 * Enum for conversation tag types
 */
export enum ConversationTagType {
    CUSTOM = 0,
    SYSTEM = 1,
    IMPORTANT = 2,
    WORK = 3,
    PERSONAL = 4,
    SHOPPING = 5,
    TRAVEL = 6,
    FAMILY = 7,
    VIP = 8,
    ARCHIVED = 9,
}

/**
 * Tag entity
 */
export interface Tag {
    id: string;
    userId: string;
    name: string;
    color: string;
    icon?: string;
    type: ConversationTagType;
    conversationCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * DTO for creating a new tag
 */
export interface CreateTagDto {
    name: string;
    color: string;
    icon?: string;
    type: ConversationTagType;
}

/**
 * DTO for updating a tag
 */
export interface UpdateTagDto {
    name?: string;
    color?: string;
    icon?: string;
    type?: ConversationTagType;
}

/**
 * DTO for filtering conversations by tags
 */
export interface FilterConversationsByTagDto {
    tagIds: string[];
    matchAll?: boolean; // true = AND, false = OR (default)
}

/**
 * DTO for bulk tag operations
 */
export interface BulkTagOperationDto {
    conversationIds: string[];
}

/**
 * Tag statistics
 */
export interface TagStatistics {
    tagId: string;
    tagName: string;
    conversationCount: number;
    lastUsed?: string;
}

/**
 * Grouped conversations by tag
 */
export interface GroupedConversations {
    tagId: string;
    tagName: string;
    conversationIds: string[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
