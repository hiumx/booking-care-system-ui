import { RefObject } from 'react';
import { Phone, Mail } from 'lucide-react';
import { ContactMethodSection } from '@/components/Auth/ContactMethodSection';

interface AuthContactMethodFormProps {
    method: 'phone' | 'email';
    onMethodChange: (value: 'phone' | 'email') => void;
    phone: string;
    email: string;
    onPhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPhoneKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onPhonePaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    showCaptcha: boolean;
    siteKey?: string;
    isHuman: boolean;
    onVerifyHuman: (value: string | null) => void;
    onExpiredHuman: () => void;
    onCheckboxChange: (value: boolean) => void;
    recaptchaRef?: RefObject<any>;
    translations: {
        phoneLabel: string;
        phonePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        phoneToggleLabel: string;
        emailToggleLabel: string;
        notRobotLabel: string;
    };
    captchaId: string;
}

export const AuthContactMethodForm = ({
    method,
    onMethodChange,
    phone,
    email,
    onPhoneChange,
    onEmailChange,
    onPhoneKeyDown,
    onPhonePaste,
    onFocus,
    showCaptcha,
    siteKey,
    isHuman,
    onVerifyHuman,
    onExpiredHuman,
    onCheckboxChange,
    recaptchaRef,
    translations,
    captchaId,
}: AuthContactMethodFormProps) => {
    return (
        <ContactMethodSection
            method={method}
            onMethodChange={onMethodChange}
            toggleOptions={[
                {
                    value: 'phone',
                    label: translations.phoneToggleLabel,
                    icon: <Phone size={16} className="me-2" />,
                },
                {
                    value: 'email',
                    label: translations.emailToggleLabel,
                    icon: <Mail size={16} className="me-2" />,
                },
            ]}
            contactInputProps={{
                method,
                phoneInput: {
                    label: translations.phoneLabel,
                    placeholder: translations.phonePlaceholder,
                    value: phone,
                    onChange: onPhoneChange,
                    onKeyDown: onPhoneKeyDown || (() => {}),
                    onPaste: onPhonePaste || (() => {}),
                },
                emailInput: {
                    label: translations.emailLabel,
                    placeholder: translations.emailPlaceholder,
                    value: email,
                    onChange: onEmailChange,
                },
                onFocus,
            }}
            captchaProps={{
                isVisible: showCaptcha,
                siteKey,
                onVerify: onVerifyHuman,
                onExpired: onExpiredHuman,
                checkboxId: captchaId,
                checkboxChecked: isHuman,
                onCheckboxChange,
                label: translations.notRobotLabel,
                recaptchaRef,
            }}
        />
    );
};
