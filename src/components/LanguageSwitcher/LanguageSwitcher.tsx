import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import './LanguageSwitcher.scss';

interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

const languages: LanguageOption[] = [
    {
        code: 'vi',
        name: 'Tiếng Việt',
        flag: 'https://flagcdn.com/w40/vn.png',
    },
    {
        code: 'en',
        name: 'English',
        flag: 'https://flagcdn.com/w40/us.png',
    },
];

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation('common');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="language-switcher-dropdown" ref={dropdownRef}>
            <button
                className="language-switcher"
                onClick={toggleDropdown}
                aria-label={t('language.switchLanguage')}
                aria-expanded={isOpen}
            >
                <img src={currentLang.flag} alt={currentLang.name} className="flag-icon" />
                <span className="language-text">{currentLang.name}</span>
                <i className={clsx('fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
            </button>

            {isOpen && (
                <div className="language-options">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={clsx('language-option', {
                                active: i18n.language === lang.code,
                            })}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <img src={lang.flag} alt={lang.name} className="flag-icon" />
                            <span>{lang.name}</span>
                            {i18n.language === lang.code && (
                                <i
                                    className="fas fa-check ms-auto"
                                    style={{ color: '#0a58ca' }}
                                ></i>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
