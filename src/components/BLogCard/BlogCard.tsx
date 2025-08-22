import React from 'react';
import defaultStyles from './BlogCard.module.scss';

export type BlogCardProps = {
    image: string;
    title: string;
    link: string;
    tag?: string;
    source?: string;
    date?: string;
    name?: string; // optional subtitle line (e.g., medicine name)

    // Class name mappings to reuse parent module styles without duplicating CSS
    containerClassName?: string;
    imageLinkClassName?: string;
    imageClassName?: string;
    contentClassName?: string;
    tagClassName?: string;
    titleLinkClassName?: string;
    nameClassName?: string;
    metaClassName?: string;
    metaTextClassName?: string;
    sourceClassName?: string;
    metaSeparatorClassName?: string;
    dateClassName?: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    title,
    link,
    tag,
    source,
    date,
    name,
    containerClassName,
    imageLinkClassName,
    imageClassName,
    contentClassName,
    tagClassName,
    titleLinkClassName,
    nameClassName,
    metaClassName,
    metaTextClassName,
    sourceClassName,
    metaSeparatorClassName,
    dateClassName,
}) => {
    return (
        <div className={containerClassName || defaultStyles.container}>
            <a href={link} className={imageLinkClassName || defaultStyles.imageLink}>
                <img src={image} alt={title} className={imageClassName || defaultStyles.image} />
            </a>
            <div className={contentClassName || defaultStyles.content}>
                {tag && (
                    <a href={link} className={tagClassName || defaultStyles.tag}>
                        {tag}
                    </a>
                )}
                <h3>
                    <a href={link} className={titleLinkClassName || defaultStyles.titleLink}>
                        {title}
                    </a>
                </h3>
                {name && <h4 className={nameClassName || defaultStyles.name}>{name}</h4>}
                {(source || date) && (
                    <div className={metaClassName || defaultStyles.meta}>
                        <span className={metaTextClassName || defaultStyles.metaText}>
                            {source && (
                                <a href={link} className={sourceClassName || defaultStyles.source}>
                                    {source}
                                </a>
                            )}
                            {source && date && (
                                <span className={metaSeparatorClassName || defaultStyles.separator}>
                                    ·
                                </span>
                            )}
                            {date && (
                                <span className={dateClassName || defaultStyles.date}>{date}</span>
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCard;
