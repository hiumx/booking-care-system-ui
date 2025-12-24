import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './BookingFooter.module.scss';

const BookingFooter: React.FC = () => {
    const { t } = useTranslation('booking');
    const currentYear = new Date().getFullYear();

    return (
        <footer className={clsx(styles.bookingFooter, 'text-center')}>
            <p className="mb-0">{t('common.copyright', { year: currentYear })}</p>
        </footer>
    );
};

export default BookingFooter;
