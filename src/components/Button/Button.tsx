import styles from './Button.module.scss';

type Props = {
    title: string;
    onClick: () => void;
};

const Button: React.FC<Props> = ({ title, onClick }) => (
    <button className={styles.className} onClick={onClick}>
        {title}
    </button>
);

export default Button;
