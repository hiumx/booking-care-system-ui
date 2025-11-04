import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import '@/styles/bio-content.scss';

interface ExpandableTextProps {
    text?: string;
    limit?: number;
    className?: string;
}

/**
 * Reusable component for expandable HTML text with "Show more/Show less" functionality
 * Renders HTML content from CKEditor
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({ text = '', limit = 300, className }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) {
        return <p className={className}>Không có thông tin</p>;
    }

    // Decode HTML entities if text is escaped
    const decodeHtml = (html: string): string => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // Convert oembed to iframe for display (handles old data in DB that wasn't converted yet)
    const convertOembedToIframe = (html: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find all figure.media elements with oembed
        const mediaFigures = doc.querySelectorAll('figure.media');

        mediaFigures.forEach((figure) => {
            const oembed = figure.querySelector('oembed');

            if (oembed) {
                const url = oembed.getAttribute('url');

                if (url) {
                    // Convert YouTube watch URL to embed URL
                    let embedUrl = url;
                    if (url.includes('youtube.com/watch')) {
                        const videoId = new URL(url).searchParams.get('v');
                        if (videoId) {
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        }
                    } else if (url.includes('youtu.be/')) {
                        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                        if (videoId) {
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        }
                    } else if (url.includes('vimeo.com/')) {
                        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                        if (videoId) {
                            embedUrl = `https://player.vimeo.com/video/${videoId}`;
                        }
                    }

                    // Create iframe element with responsive sizing
                    const iframe = doc.createElement('iframe');
                    iframe.setAttribute('src', embedUrl);
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allowfullscreen', 'true');
                    iframe.setAttribute('class', 'video-embed');

                    // Replace figure with iframe
                    figure.replaceWith(iframe);
                }
            }
        });

        return doc.body.innerHTML;
    };

    // Strip HTML tags to calculate text length
    const stripHtml = (html: string): string => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Ensure we have proper HTML (decode if escaped)
    let decodedText = decodeHtml(text);

    // Convert oembed to iframe if present (for old data in DB)
    decodedText = convertOembedToIframe(decodedText);

    const textContent = stripHtml(decodedText);
    const isLongText = textContent.length > limit;

    // Truncate HTML while preserving structure
    const getTruncatedHtml = (html: string, maxLength: number): string => {
        const stripped = stripHtml(html);
        if (stripped.length <= maxLength) return html;

        // Simple truncation: just show the text content truncated
        const truncatedText = stripped.substring(0, maxLength) + '...';

        // Return as paragraph to maintain some structure
        return `<p>${truncatedText}</p>`;
    };

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
