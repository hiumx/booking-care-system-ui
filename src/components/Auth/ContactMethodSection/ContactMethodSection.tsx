import {
    ContactMethodToggle,
    ContactMethodToggleOption,
} from '@/components/Auth/ContactMethodToggle';
import { ContactMethodInput } from '@/components/Auth/ContactMethodInput';
import { CaptchaSection } from '@/components/Auth/CaptchaSection';

type ContactMethodInputProps = Parameters<typeof ContactMethodInput>[0];
type CaptchaSectionProps = Parameters<typeof CaptchaSection>[0];

interface ContactMethodSectionProps {
    method: 'phone' | 'email';
    onMethodChange: (value: 'phone' | 'email') => void;
    toggleOptions: ContactMethodToggleOption[];
    contactInputProps: ContactMethodInputProps;
    captchaProps: CaptchaSectionProps;
    inputWrapperClassName?: string;
}

export const ContactMethodSection = ({
    method,
    onMethodChange,
    toggleOptions,
    contactInputProps,
    captchaProps,
    inputWrapperClassName = 'mb-3',
}: ContactMethodSectionProps) => {
    return (
        <>
            <ContactMethodToggle
                method={method}
                options={toggleOptions}
                onChange={onMethodChange}
            />
            <div className={inputWrapperClassName}>
                <ContactMethodInput {...contactInputProps} />
            </div>
            <CaptchaSection {...captchaProps} />
        </>
    );
};
