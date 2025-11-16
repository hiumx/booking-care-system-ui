import { RefObject } from 'react';

interface AuthContactMethodFormTranslations {
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneToggleLabel: string;
    emailToggleLabel: string;
    notRobotLabel: string;
}

interface CreateAuthContactMethodFormPropsConfig {
    // State
    method: 'phone' | 'email';
    phone: string;
    email: string;
    showCaptcha: boolean;
    isHuman: boolean;

    // Handlers
    setMethod: (method: 'phone' | 'email') => void;
    handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setEmail: (email: string) => void;
    handlePhoneKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handlePhonePaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    setShowCaptcha: (show: boolean) => void;
    setIsHuman: (isHuman: boolean) => void;

    // Configuration
    translations: AuthContactMethodFormTranslations;
    captchaId: string;
    siteKey?: string;
    recaptchaRef?: RefObject<any>;
}

export const createAuthContactMethodFormProps = (
    config: CreateAuthContactMethodFormPropsConfig
) => {
    return {
        method: config.method,
        onMethodChange: config.setMethod,
        phone: config.phone,
        email: config.email,
        onPhoneChange: config.handlePhoneChange,
        onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            config.setEmail(event.target.value),
        onPhoneKeyDown: config.handlePhoneKeyDown,
        onPhonePaste: config.handlePhonePaste,
        onFocus: () => config.setShowCaptcha(true),
        showCaptcha: config.showCaptcha,
        siteKey: config.siteKey,
        isHuman: config.isHuman,
        onVerifyHuman: (value: string | null) => config.setIsHuman(Boolean(value)),
        onExpiredHuman: () => config.setIsHuman(false),
        onCheckboxChange: config.setIsHuman,
        recaptchaRef: config.recaptchaRef,
        translations: config.translations,
        captchaId: config.captchaId,
    };
};
