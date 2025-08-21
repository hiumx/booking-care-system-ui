import React from 'react';
import BlogCard, { BlogCardProps } from '~/components/BLogCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import defaultStyles from './BlogSlider.module.scss';

export type BlogSliderClasses = Partial<{
    sectionClassName: string;
    containerClassName: string;
    headerClassName: string;
    titleClassName: string;
    swiperClassName: string;
    slideClassName: string;
    navigationClassName: string; // used for both prev/next
    paginationClassName: string;
}>;

export type BlogSliderProps = {
    title?: string;
    items: BlogCardProps[];
    classes?: BlogSliderClasses;
    cardClassNames?: Omit<
        BlogCardProps,
        'image' | 'title' | 'link' | 'tag' | 'source' | 'date' | 'name'
    >;
    autoplayDelayMs?: number;
    loop?: boolean;
    breakpoints?: any; // Swiper ResponsiveOptions
};

const BlogSlider: React.FC<BlogSliderProps> = ({
    title,
    items,
    classes,
    cardClassNames,
    autoplayDelayMs = 3000,
    loop = true,
    breakpoints,
}) => {
    return (
        <section className={classes?.sectionClassName || defaultStyles.section}>
            <div className={classes?.containerClassName || defaultStyles.container}>
                {title && (
                    <div className={classes?.headerClassName || defaultStyles.header}>
                        <h2 className={classes?.titleClassName || defaultStyles.title}>{title}</h2>
                    </div>
                )}

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                    pagination={{ clickable: true, el: '.swiper-pagination', type: 'bullets' }}
                    autoplay={{ delay: autoplayDelayMs, disableOnInteraction: false }}
                    loop={loop}
                    breakpoints={breakpoints}
                    className={classes?.swiperClassName || defaultStyles.swiper}
                >
                    {items.map((item, idx) => (
                        <SwiperSlide
                            key={idx}
                            className={classes?.slideClassName || defaultStyles.slide}
                        >
                            <BlogCard
                                image={item.image}
                                title={item.title}
                                link={item.link}
                                tag={item.tag}
                                source={item.source}
                                date={item.date}
                                name={item.name}
                                containerClassName={
                                    cardClassNames?.containerClassName ||
                                    defaultStyles.cardContainer
                                }
                                imageLinkClassName={
                                    cardClassNames?.imageLinkClassName || defaultStyles.imageLink
                                }
                                imageClassName={
                                    cardClassNames?.imageClassName || defaultStyles.image
                                }
                                contentClassName={
                                    cardClassNames?.contentClassName || defaultStyles.content
                                }
                                tagClassName={cardClassNames?.tagClassName || defaultStyles.tag}
                                titleLinkClassName={
                                    cardClassNames?.titleLinkClassName || defaultStyles.titleLink
                                }
                                nameClassName={cardClassNames?.nameClassName}
                                metaClassName={cardClassNames?.metaClassName || defaultStyles.meta}
                                metaTextClassName={
                                    cardClassNames?.metaTextClassName || defaultStyles.metaText
                                }
                                sourceClassName={
                                    cardClassNames?.sourceClassName || defaultStyles.source
                                }
                                metaSeparatorClassName={
                                    cardClassNames?.metaSeparatorClassName ||
                                    defaultStyles.separator
                                }
                                dateClassName={cardClassNames?.dateClassName || defaultStyles.date}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div
                    className={`swiper-button-prev ${classes?.navigationClassName || defaultStyles.nav}`}
                ></div>
                <div
                    className={`swiper-button-next ${classes?.navigationClassName || defaultStyles.nav}`}
                ></div>
                <div
                    className={`swiper-pagination ${classes?.paginationClassName || defaultStyles.pagination}`}
                ></div>
            </div>
        </section>
    );
};

export default BlogSlider;
