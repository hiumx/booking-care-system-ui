import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import '@/styles/bio-content.scss';

interface ExpandableTextProps {
    text?: string;
    limit?: number;
    className?: string;
}

// Decode HTML entities if text is escaped
const decodeHtml = (html: string): string => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

// Strip HTML tags to calculate text length
const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

// Convert YouTube watch URL to embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
    if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return null;
};

// Convert Vimeo URL to embed URL
const getVimeoEmbedUrl = (url: string): string | null => {
    if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
};

// Convert video URL to embed URL
const getEmbedUrl = (url: string): string => {
    const youtubeEmbedUrl = getYouTubeEmbedUrl(url);
    if (youtubeEmbedUrl) return youtubeEmbedUrl;

    const vimeoEmbedUrl = getVimeoEmbedUrl(url);
    if (vimeoEmbedUrl) return vimeoEmbedUrl;

    return url;
};

// Create iframe element with responsive sizing
const createVideoIframe = (doc: Document, embedUrl: string): HTMLIFrameElement => {
    const iframe = doc.createElement('iframe');
    iframe.setAttribute('src', embedUrl);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('class', 'video-embed');
    return iframe;
};

// Process a single media figure element
const processMediaFigure = (figure: Element, doc: Document): void => {
    const oembed = figure.querySelector('oembed');
    if (!oembed) return;

    const url = oembed.getAttribute('url');
    if (!url) return;

    const embedUrl = getEmbedUrl(url);
    const iframe = createVideoIframe(doc, embedUrl);
    figure.replaceWith(iframe);
};

// Convert oembed to iframe for display (handles old data in DB that wasn't converted yet)
const convertOembedToIframe = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mediaFigures = doc.querySelectorAll('figure.media');

    mediaFigures.forEach((figure) => processMediaFigure(figure, doc));

    return doc.body.innerHTML;
};

// Truncate HTML while preserving structure
const getTruncatedHtml = (html: string, maxLength: number): string => {
    const stripped = stripHtml(html);
    if (stripped.length <= maxLength) return html;

    const truncatedText = stripped.substring(0, maxLength) + '...';
    return `<p>${truncatedText}</p>`;
};

/**
 * Reusable component for expandable HTML text with "Show more/Show less" functionality
 * Renders HTML content from CKEditor
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({ text = '', limit = 300, className }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) {
        return <p className={className}>Không có thông tin</p>;
    }

    let decodedText = decodeHtml(text);
    decodedText = convertOembedToIframe(decodedText);

    const textContent = stripHtml(decodedText);
    const isLongText = textContent.length > limit;

    const displayText =
        expanded || !isLongText ? decodedText : getTruncatedHtml(decodedText, limit);

    return (
        <div>
            <div
                className={clsx('bio-content', className)}
                dangerouslySetInnerHTML={{ __html: displayText }}
            />
            {isLongText && (
                <Link
                    to="#"
                    className="show-more d-flex align-items-center"
                    onClick={(e) => {
                        e.preventDefault();
                        setExpanded((prev) => !prev);
                    }}
                >
                    {expanded ? 'Thu gọn' : 'Xem thêm'}
                    <i
                        className={clsx('fa-solid', 'ms-2', {
                            'fa-chevron-up': expanded,
                            'fa-chevron-down': !expanded,
                        })}
                    ></i>
                </Link>
            )}
        </div>
    );
};

export default ExpandableText;
