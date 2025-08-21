import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './FeaturedVideos.module.scss';
import thumb1 from '@/assets/img/blog/article-01.jpg';
import thumb2 from '@/assets/img/blog/article-02.jpg';
import thumb3 from '@/assets/img/blog/article-03.jpg';

const FeaturedVideos: React.FC = () => {
    const initialVideo = {
        id: 'niC3fGeLyEQ',
        title: 'Saffron (Nhụy hoa nghệ tây) có thực sự tốt? - DS. Phan Tiểu Long',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };
    const [currentVideo, setCurrentVideo] = useState(initialVideo);

    const sideIds = useMemo(
        () => [
            { id: 'vid-1', ytId: 'niC3fGeLyEQ', fallback: thumb1 },
            { id: 'vid-2', ytId: 'D4Mx_ULS0TA', fallback: thumb2 },
            { id: 'vid-3', ytId: 'IbyM-YGn5C0', fallback: thumb3 },
            { id: 'vid-4', ytId: '8OjEa-a_eC8', fallback: thumb3 },
        ],
        []
    );

    type VideoMeta = { id: string; ytId: string; title: string; thumb: string; link: string };
    const [sideVideos, setSideVideos] = useState<VideoMeta[]>([]);

    useEffect(() => {
        const fetchMeta = async () => {
            const results: VideoMeta[] = await Promise.all(
                sideIds.map(async ({ id, ytId, fallback }) => {
                    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
                    try {
                        const res = await fetch(url);
                        if (!res.ok) throw new Error('oEmbed failed');
                        const data = await res.json();
                        const title: string = data?.title ?? 'Video';
                        const thumb: string = data?.thumbnail_url ?? fallback;
                        return {
                            id,
                            ytId,
                            title,
                            thumb,
                            link: `https://www.youtube.com/watch?v=${ytId}`,
                        };
                    } catch (_err) {
                        console.warn(`Failed to fetch oEmbed for ${ytId}, using fallback`, _err);
                        // Fallback to a default structure if oEmbed fails
                        return {
                            id,
                            ytId,
                            title: 'Video',
                            thumb: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                            link: `https://www.youtube.com/watch?v=${ytId}`,
                        };
                    }
                })
            );
            setSideVideos(results);
            // Ensure current video also uses accurate title/link if matching
            const found = results.find((v) => v.ytId === initialVideo.id);
            if (found) setCurrentVideo({ id: found.ytId, title: found.title, link: found.link });
        };
        fetchMeta();
    }, [sideIds]);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const [sideMaxHeight, setSideMaxHeight] = useState<number | undefined>(undefined);
    useEffect(() => {
        const update = () => {
            if (mainRef.current) setSideMaxHeight(mainRef.current.offsetHeight);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <section className={styles.featuredVideos}>
            <h2 className={styles.title}>Video Nổi Bật</h2>

            <div className={styles.grid}>
                <div className={styles.mainVideo} ref={mainRef}>
                    <div className={styles.videoFrame}>
                        <iframe
                            src={`https://www.youtube.com/embed/${currentVideo.id}`}
                            title={currentVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                    <a href={currentVideo.link} className={styles.videoHeading}>
                        {currentVideo.title}
                    </a>
                </div>

                <aside
                    className={styles.sideList}
                    style={sideMaxHeight ? { maxHeight: sideMaxHeight } : undefined}
                >
                    {sideVideos.map((v) => {
                        const isActive = currentVideo.id === v.ytId;
                        return (
                            <a
                                key={v.id}
                                href={v.link}
                                className={`${styles.sideCard} ${isActive ? styles.active : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentVideo({ id: v.ytId, title: v.title, link: v.link });
                                }}
                            >
                                <div className={styles.thumbBox}>
                                    <img src={v.thumb} alt={v.title} />
                                </div>
                                <h4 className={styles.sideTitle}>{v.title}</h4>
                            </a>
                        );
                    })}
                </aside>
            </div>
        </section>
    );
};

export default FeaturedVideos;
