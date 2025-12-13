import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

/**
 * Botpress Webchat Component
 * Tích hợp AI chatbot Botpress vào MedCure
 * Welcome message và quick options được cấu hình trong Botpress Studio
 */

const BOTPRESS_INJECT_URL = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js';
const BOTPRESS_CONFIG_URL =
    'https://files.bpcontent.cloud/2025/12/12/09/20251212094734-GD26TOAE.js';

// Vietnamese translations for Botpress UI
const VI_TRANSLATIONS: Record<string, string> = {
    'Create New Conversation': 'Tạo cuộc trò chuyện mới',
    'New conversation': 'Cuộc trò chuyện mới',
    Cancel: 'Hủy bỏ',
    Send: 'Gửi',
    'Type a message...': 'Nhập tin nhắn...',
    'Start a new conversation': 'Bắt đầu cuộc trò chuyện mới',
    'This will clear the current conversation and start a new one.':
        'Thao tác này sẽ xóa cuộc trò chuyện hiện tại và bắt đầu cuộc trò chuyện mới.',
    Today: 'Hôm nay',
    Yesterday: 'Hôm qua',
    'Type your message': 'Nhập tin nhắn của bạn',
    'Ask a question...': 'Đặt câu hỏi...',
    Close: 'Đóng',
    Minimize: 'Thu nhỏ',
    'Reset conversation': 'Đặt lại cuộc trò chuyện',
    'Sound on': 'Bật âm thanh',
    'Sound off': 'Tắt âm thanh',
    Delivered: 'Đã gửi',
    Sending: 'Đang gửi',
    Sent: 'Đã gửi',
    Read: 'Đã đọc',
    Failed: 'Thất bại',
    Retry: 'Thử lại',
};

interface BotpressInstance {
    on: (event: string, callback: (data: BotpressEventData) => void) => void;
    sendPayload: (payload: BotpressPayload) => void;
}

declare global {
    var botpress: BotpressInstance | undefined;
}

interface BotpressEventData {
    type: string;
    payload?: {
        action?: string;
        specialtyId?: string;
        specialtyName?: string;
        doctorId?: string;
        doctorName?: string;
        [key: string]: unknown;
    };
}

interface BotpressPayload {
    type: string;
    text?: string;
    payload?: Record<string, unknown>;
}

interface BotpressChatProps {
    configUrl?: string;
}

const BotpressChat: React.FC<BotpressChatProps> = ({ configUrl = BOTPRESS_CONFIG_URL }) => {
    const navigate = useNavigate();
    const observerRef = useRef<MutationObserver | null>(null);

    // Recursively find all shadow roots
    const getAllShadowRoots = useCallback((root: Document | ShadowRoot): ShadowRoot[] => {
        const shadowRoots: ShadowRoot[] = [];
        const elements = root.querySelectorAll('*');
        elements.forEach((el) => {
            if (el.shadowRoot) {
                shadowRoots.push(el.shadowRoot, ...getAllShadowRoots(el.shadowRoot));
            }
        });
        return shadowRoots;
    }, []);

    // Translate text in Botpress webchat using Shadow DOM approach
    const translateBotpressUI = useCallback(() => {
        const allShadowRoots = getAllShadowRoots(document);

        allShadowRoots.forEach((shadowRoot) => {
            // Use TreeWalker to find all text nodes
            const walker = document.createTreeWalker(shadowRoot, NodeFilter.SHOW_TEXT, null);
            let node;
            while ((node = walker.nextNode())) {
                const text = node.textContent?.trim();
                if (text && VI_TRANSLATIONS[text]) {
                    node.textContent = VI_TRANSLATIONS[text];
                }
            }

            // Also translate placeholder attributes
            const inputs = shadowRoot.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                const placeholder = input.getAttribute('placeholder');
                if (placeholder && VI_TRANSLATIONS[placeholder]) {
                    input.setAttribute('placeholder', VI_TRANSLATIONS[placeholder]);
                }
            });

            // Translate aria-label and title attributes
            const elementsWithLabels = shadowRoot.querySelectorAll('[aria-label], [title]');
            elementsWithLabels.forEach((el) => {
                const ariaLabel = el.getAttribute('aria-label');
                const title = el.getAttribute('title');
                if (ariaLabel && VI_TRANSLATIONS[ariaLabel]) {
                    el.setAttribute('aria-label', VI_TRANSLATIONS[ariaLabel]);
                }
                if (title && VI_TRANSLATIONS[title]) {
                    el.setAttribute('title', VI_TRANSLATIONS[title]);
                }
            });
        });
    }, [getAllShadowRoots]);

    // Setup translation with interval and observer
    const setupTranslationObserver = useCallback(() => {
        // Run translation periodically
        const interval = setInterval(() => {
            translateBotpressUI();
        }, 500);

        // Also observe for changes
        const observer = new MutationObserver(() => {
            translateBotpressUI();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        observerRef.current = observer;

        // Initial translation
        translateBotpressUI();

        // Stop interval after 30s but keep observer
        setTimeout(() => clearInterval(interval), 30000);
    }, [translateBotpressUI]);

    // Inject branding CSS into shadow root
    const injectBrandingCss = useCallback((shadowRoot: ShadowRoot) => {
        if (shadowRoot.getElementById('mc-branding-css')) return;

        const style = document.createElement('style');
        style.id = 'mc-branding-css';
        style.textContent = `
            /* Đẩy FAB icon lên trên để có chỗ cho label */
            .bpFab,
            [class*="bpFab"] {
                margin-bottom: 10px !important;
            }
            .bpComposerFooter a,
            [class*="bpComposerFooter"] a,
            [class*="ComposerFooter"] a {
                display: none !important;
            }
            .mc-brand {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 4px !important;
                color: #0d9488 !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                width: 100% !important;
            }
            /* Override Delivered status text via CSS ::after */
            [class*="bpMessageDeliveryStatus"]::after,
            [class*="DeliveryStatus"]::after,
            .bpMessageDeliveryStatus::after {
                content: "Đã gửi" !important;
            }
            /* Override other status texts */
            [class*="Sending"]::after {
                content: "Đang gửi" !important;
            }
            [class*="Failed"]::after {
                content: "Thất bại" !important;
            }
        `;
        shadowRoot.appendChild(style);
    }, []);

    // Replace footer branding in shadow root
    const replaceFooterBranding = useCallback((shadowRoot: ShadowRoot): boolean => {
        let found = false;
        const footers = shadowRoot.querySelectorAll(
            '.bpComposerFooter, [class*="bpComposerFooter"], [class*="ComposerFooter"]'
        );

        footers.forEach((footer) => {
            found = true;
            const link = footer.querySelector('a');
            if (link) link.style.display = 'none';
            const p = footer.querySelector('p');
            if (p) p.style.display = 'none';

            if (!footer.querySelector('.mc-brand')) {
                const brand = document.createElement('div');
                brand.className = 'mc-brand';
                brand.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0d9488">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Powered by MedCure</span>
                `;
                footer.appendChild(brand);
            }
        });

        // Hide "by Botpress" text
        const walker = document.createTreeWalker(shadowRoot, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
            if (node.textContent?.includes('by Botpress')) {
                const parent = node.parentElement;
                if (parent) {
                    parent.style.display = 'none';
                    found = true;
                }
            }
        }

        return found;
    }, []);

    // Replace branding in all shadow roots
    const replaceBranding = useCallback(() => {
        const allShadowRoots = getAllShadowRoots(document);
        allShadowRoots.forEach((shadowRoot) => {
            injectBrandingCss(shadowRoot);
            replaceFooterBranding(shadowRoot);
        });
    }, [getAllShadowRoots, injectBrandingCss, replaceFooterBranding]);

    // Hide Botpress branding and replace with MedCure branding
    const customizeBotpressBranding = useCallback(() => {
        const interval = setInterval(replaceBranding, 1000);

        const observer = new MutationObserver(replaceBranding);
        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => clearInterval(interval), 30000);
    }, [replaceBranding]);

    const handleBotpressAction = useCallback(
        (data: BotpressEventData) => {
            const { payload } = data;
            if (!payload?.action) return;

            switch (payload.action) {
                case 'navigate_to_doctors':
                    if (payload.specialtyId) {
                        navigate(`${PATHS.DOCTOR.ROOT}?specialtyId=${payload.specialtyId}`);
                    } else {
                        navigate(PATHS.DOCTOR.ROOT);
                    }
                    break;

                case 'navigate_to_specialties':
                    navigate(PATHS.SPECIALTIES.ROOT);
                    break;

                case 'navigate_to_booking':
                    if (payload.doctorId) {
                        navigate(`/booking/${payload.doctorId}`);
                    }
                    break;

                case 'navigate_to_appointments':
                    navigate(`${PATHS.USER.ROOT}/appointments`);
                    break;

                case 'navigate_to_contact':
                    navigate(PATHS.CONTACT_US);
                    break;

                case 'open_ai_booking':
                    navigate(PATHS.AI_SUPPORT_BOOKING);
                    break;

                default:
                    console.log('Unknown Botpress action:', payload.action);
            }
        },
        [navigate]
    );

    useEffect(() => {
        const existingInject = document.querySelector(`script[src="${BOTPRESS_INJECT_URL}"]`);
        const existingConfig = document.querySelector(`script[src="${configUrl}"]`);

        const setupBotpressListeners = () => {
            const checkBotpress = setInterval(() => {
                if (globalThis.botpress) {
                    clearInterval(checkBotpress);
                    globalThis.botpress.on('customAction', handleBotpressAction);

                    // Setup translation and branding after botpress is ready
                    setupTranslationObserver();
                    customizeBotpressBranding();
                }
            }, 500);

            setTimeout(() => clearInterval(checkBotpress), 10000);
        };

        if (existingInject && existingConfig) {
            setupBotpressListeners();
            return;
        }

        const injectScript = document.createElement('script');
        injectScript.src = BOTPRESS_INJECT_URL;
        injectScript.async = true;
        document.body.appendChild(injectScript);

        injectScript.onload = () => {
            const configScript = document.createElement('script');
            configScript.src = configUrl;
            configScript.async = true;
            document.body.appendChild(configScript);
            configScript.onload = () => setupBotpressListeners();
        };

        // Cleanup - don't remove label to prevent flickering
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [configUrl, handleBotpressAction, setupTranslationObserver, customizeBotpressBranding]);

    return null;
};

export default BotpressChat;
