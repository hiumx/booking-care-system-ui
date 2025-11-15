import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaSectionProps {
    isVisible: boolean;
    siteKey?: string;
    onVerify: (value: string | null) => void;
    onExpired: () => void;
    checkboxId: string;
    checkboxChecked: boolean;
    onCheckboxChange: (checked: boolean) => void;
    label: string;
    recaptchaRef?: React.RefObject<ReCAPTCHA | null>;
}

export const CaptchaSection = ({
    isVisible,
    siteKey,
    onVerify,
    onExpired,
    checkboxId,
    checkboxChecked,
    onCheckboxChange,
    label,
    recaptchaRef,
}: CaptchaSectionProps) => {
    if (!isVisible) return null;

    return (
        <div>
            {siteKey ? (
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={onVerify}
                    onExpired={onExpired}
                />
            ) : (
                <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
                    <input
                        type="checkbox"
                        id={checkboxId}
                        className="me-2"
                        checked={checkboxChecked}
                        onChange={(event) => onCheckboxChange(event.target.checked)}
                    />
                    <label htmlFor={checkboxId} className="text-muted">
                        {label}
                    </label>
                </div>
            )}
        </div>
    );
};
