import React from 'react';
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

// (stripHtml removed — component renders full HTML so length checks/truncation are not used)

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

// (truncation removed — component now renders full HTML)

/**
 * Reusable component for expandable HTML text with "Show more/Show less" functionality
 * Renders HTML content from CKEditor
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({
    text = '',
    limit: _limit = 300,
    className,
}) => {
    if (!text) {
        return <p className={className}>Không có thông tin</p>;
    }

    let decodedText = decodeHtml(text);
    decodedText = convertOembedToIframe(decodedText);

    // Always render full decoded HTML (no truncation)
    const displayText = decodedText;

    return (
        <div>
            <div
                className={clsx('bio-content', className)}
                dangerouslySetInnerHTML={{ __html: displayText }}
            />
            {/* Always show full content — no "Xem thêm/Thu gọn" */}
        </div>
    );
};

export default ExpandableText;
