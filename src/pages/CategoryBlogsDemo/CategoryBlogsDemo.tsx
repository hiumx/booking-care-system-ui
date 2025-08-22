import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryBlogsDemo.module.scss';

const CategoryBlogsDemo: React.FC = () => {
    return (
        <div className={styles.demo}>
            <h1>Category Blogs Demo</h1>
            <p>Click the link below to test the CategoryBlogs component:</p>
            <Link to="/category/co-xuong-khop" className={styles.demoLink}>
                View Cơ Xương Khớp Blogs
            </Link>
        </div>
    );
};

export default CategoryBlogsDemo;
