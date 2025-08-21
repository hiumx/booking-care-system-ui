import React from 'react';
import styles from './Blog.module.scss';
import BlogHeader from '@/pages/Blog/components/BlogHeader/BlogHeader';
import FeaturedArticles from '~/pages/Blog/components/FeaturedBlog/FeaturedBlog';
import BlogSlider from '@/pages/Blog/components/BlogSlider/BlogSlider';
import FeaturedCategories from '@/pages/Blog/components/FeaturedCategories';
import YouMedServices from '@/pages/Blog/components/MedicalServices';
import MedicalDictionary from '@/pages/Blog/components/MedicalDictionary';
import TopicsOfInterest from '@/pages/Blog/components/TopicsOfInterest';
import FeaturedVideos from '@/pages/Blog/components/FeaturedVideos';
import ExpertTeam from '@/pages/Blog/components/ExpertTeam';
import CommitmentSection from '@/pages/Blog/components/CommitmentSection';

const Blog: React.FC = () => {
    return (
        <>
            {/* Header Section: Logo, Search & Navigation */}
            <BlogHeader />

            <div className={styles.blogContainer}>
                {/* Featured Articles Section */}
                <FeaturedArticles />

                {/* Article Slider Section */}
                <BlogSlider />

                {/* Section 1: Featured Categories */}
                <section className={styles.featuredCategories}>
                    <FeaturedCategories />
                </section>

                {/* Section 3 & 4: Main Content Area */}
                <div className={styles.mainContent}>
                    {/* Left Sidebar: YouMed Services */}
                    <aside className={styles.sidebar}>
                        <YouMedServices />
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
