import { ReactNode } from 'react';
import { Mail } from 'lucide-react';
import Input from '@/components/Input';

interface PhoneInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

interface EmailInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: ReactNode;
}

interface ContactMethodInputProps {
    method: 'phone' | 'email';
    phoneInput: PhoneInputProps;
    emailInput: EmailInputProps;
    onFocus: () => void;
}

const DEFAULT_EMAIL_ICON = <Mail size={18} className="text-muted" />;

export const ContactMethodInput = ({
    method,
    phoneInput,
    emailInput,
    onFocus,
}: ContactMethodInputProps) => {
    if (method === 'phone') {
        return (
            <Input
                label={phoneInput.label}
                type="tel"
                inputMode="numeric"
                placeholder={phoneInput.placeholder}
                leftContent={
                    <>
                        <img src="https://flagcdn.com/w20/vn.png" alt="VN" width={20} height={15} />
                        <span className="text-muted" style={{ fontSize: 14 }}>
                            +84
                        </span>
                    </>
                }
                wrapVariant="phone"
                value={phoneInput.value}
                onChange={phoneInput.onChange}
                onKeyDown={phoneInput.onKeyDown}
                onPaste={phoneInput.onPaste}
                onFocus={onFocus}
            />
        );
    }

    return (
        <Input
            label={emailInput.label}
            type="email"
            placeholder={emailInput.placeholder}
            leftIcon={emailInput.icon ?? DEFAULT_EMAIL_ICON}
            wrapVariant="email"
            value={emailInput.value}
            onChange={emailInput.onChange}
            onFocus={onFocus}
        />
    );
};
