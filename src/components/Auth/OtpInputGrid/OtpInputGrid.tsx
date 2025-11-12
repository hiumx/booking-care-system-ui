import clsx from 'clsx';
import { CSSProperties } from 'react';

type InputRef = React.MutableRefObject<Array<HTMLInputElement | null>>;

interface OtpInputGridProps {
    otp: string[];
    otpRefs: InputRef;
    onChange: (index: number, value: string) => void;
    onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
    containerClassName?: string;
    baseInputClassName?: string;
    getInputClassName?: (digit: string) => string;
    inputStyle?: CSSProperties;
    inputKeyBuilder?: (index: number) => string | number;
}

export const OtpInputGrid = ({
    otp,
    otpRefs,
    onChange,
    onKeyDown,
    containerClassName,
    baseInputClassName,
    getInputClassName,
    inputStyle,
    inputKeyBuilder,
}: OtpInputGridProps) => {
    return (
        <div className={containerClassName}>
            {otp.map((digit, index) => (
                <input
                    key={inputKeyBuilder ? inputKeyBuilder(index) : index}
                    ref={(element) => {
                        otpRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => onChange(index, event.target.value)}
                    onKeyDown={(event) => onKeyDown(index, event)}
                    className={clsx(baseInputClassName, getInputClassName?.(digit))}
                    style={inputStyle}
                />
            ))}
        </div>
    );
};
