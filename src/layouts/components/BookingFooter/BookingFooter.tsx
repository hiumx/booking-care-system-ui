import clsx from 'clsx';
import styles from './BookingFooter.module.scss';

const BookingFooter: React.FC = () => {
    return (
        <footer className={clsx(styles.bookingFooter, 'text-center')}>
            <p className="mb-0"> Bản quyền © 2025. Đã đăng ký mọi quyền, Doccure </p>
        </footer>
    );
};

export default BookingFooter;
