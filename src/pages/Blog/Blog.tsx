import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Blog.module.scss';
import BlogHeader from '@/pages/Blog/components/BlogHeader/BlogHeader';
import FeaturedArticles from '@/pages/Blog/components/FeaturedBlog/FeaturedBlog';
import BlogSlideComponent from '@/pages/Blog/components/BlogSlider/BlogSlider';
import MedcureServices from '@/pages/Blog/components/MedicalServices';
import MedicalDictionary from '@/pages/Blog/components/MedicalDictionary';
import TopicsOfInterest from '@/pages/Blog/components/TopicsOfInterest';
import FeaturedVideos from '@/pages/Blog/components/FeaturedVideos';
import ExpertTeam from '@/pages/Blog/components/ExpertTeam';
import CommitmentSection from '@/pages/Blog/components/CommitmentSection';
import { BlogService } from '@/services/blog.service';
import { BlogSummaryDto, BlogStatus } from '@/types/blog.types';
import { useApiCall } from '@/hooks/useApiCall';
import Spinner from '@/components/Spinner';

const Blog: React.FC = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState<BlogSummaryDto[]>([]);
    const [recentBlogs, setRecentBlogs] = useState<BlogSummaryDto[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const navigate = useNavigate();

    // Fetch featured blogs
    const {
        data: featuredData,
        isLoading: isLoadingFeatured,
        execute: fetchFeatured,
    } = useApiCall(async () => {
        const response = await BlogService.getBlogs({
            featured: true,
            status: BlogStatus.Active,
            page: 1,
            pageSize: 3,
            keyword: searchKeyword || undefined,
        });
        return response.data;
    });

    // Fetch recent blogs
    const {
        data: recentData,
        isLoading: isLoadingRecent,
        execute: fetchRecent,
    } = useApiCall(async () => {
        const response = await BlogService.getBlogs({
            status: BlogStatus.Active,
            page: 1,
            pageSize: 10,
            keyword: searchKeyword || undefined,
        });
        return response.data;
    });

    const getBlogTimestamp = (blog: BlogSummaryDto): number => {
        const dateString = blog.publishedAt || blog.createdAt;
        const timestamp = dateString ? new Date(dateString).getTime() : 0;
        return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    useEffect(() => {
        fetchFeatured();
        fetchRecent();
    }, [searchKeyword]);

    useEffect(() => {
        if (featuredData) {
            const sortedFeatured = [...(featuredData.items || [])].sort(
                (a, b) => getBlogTimestamp(b) - getBlogTimestamp(a)
            );
            setFeaturedBlogs(sortedFeatured);
        }
    }, [featuredData]);

    useEffect(() => {
        if (recentData) {
            const sortedRecent = [...(recentData.items || [])].sort(
                (a, b) => getBlogTimestamp(b) - getBlogTimestamp(a)
            );
            setRecentBlogs(sortedRecent);
        }
    }, [recentData]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `Ngày đăng: ${date.getDate()} Th${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        // Navigate to CategoryBlogs page to show search results
        if (!keyword || !keyword.trim()) {
            navigate('/category/all');
            return;
        }
        const params = new URLSearchParams({
            category: 'all',
            search: keyword.trim(),
            page: '1',
        });
        navigate(`/category/all?${params.toString()}`);
    };

    return (
        <>
            {/* Header Section: Logo, Search & Navigation */}
            <BlogHeader onSearch={handleSearch} />

            <div className={styles.blogContainer}>
                {/* Loading State */}
                {(isLoadingFeatured || isLoadingRecent) && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Spinner />
                    </div>
                )}

                {/* Featured Articles Section */}
                {!isLoadingFeatured && (
                    <FeaturedArticles featuredBlogs={featuredBlogs} formatDate={formatDate} />
                )}

                {/* Article Slider Section */}
                {!isLoadingRecent && (
                    <BlogSlideComponent recentBlogs={recentBlogs} formatDate={formatDate} />
                )}

                {/* Section 3 & 4: Main Content Area */}
                <div className={styles.mainContent}>
                    {/* Left Sidebar: Medcure Services */}
                    <aside className={styles.sidebar}>
                        <MedcureServices />
                    </aside>

                    {/* Right Content: Medical Dictionary */}
                    <main className={styles.content}>
                        <MedicalDictionary />
                    </main>
                </div>

                {/* Section 2: Topics of Interest */}
                <section className={styles.topicsSection}>
                    <TopicsOfInterest />
                </section>

                {/* Featured Videos Section */}
                <FeaturedVideos />

                {/* Expert Team Section */}
                <ExpertTeam />

                {/* Commitment Section */}
                <CommitmentSection />
            </div>
        </>
    );
};

export default Blog;
