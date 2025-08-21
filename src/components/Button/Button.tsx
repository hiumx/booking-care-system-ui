import clsx from 'clsx';
import styles from './Button.module.scss';

/**
 * Props for the `Button` component.
 *
 * @property text - The label or text displayed on the button.
 * @property type - The button's type attribute, which determines its behavior. Can be 'button', 'submit', or 'reset'.
 * @property className - Optional additional CSS class names to apply to the button.
 * @property style - Optional inline styles to apply to the button.
 * @property isDisabled - Optional boolean to disable the button.
 * @property onClick - Optional click event handler function.
 */
type ButtonProps = {
    text: string;
    type: 'button' | 'submit' | 'reset';
    className?: string;
    style?: React.CSSProperties;
    isDisabled?: boolean;
    onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
    text,
    type = 'button',
    className,
    style = {},
    isDisabled = false,
    onClick = () => {},
}) => (
    <button
        className={clsx(styles.button, className, 'btn btn-primary-gradient')}
        type={type}
        style={style}
        disabled={isDisabled}
        onClick={onClick}
    >
        {text}
    </button>
);

export default Button;
