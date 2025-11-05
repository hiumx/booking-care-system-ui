import { ReactNode } from 'react';
import MainHeader from '../components/MainHeader';
import BookingFooter from '../components/BookingFooter';

interface BookingLayoutProps {
    children: ReactNode;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children }) => {
    return (
        <div>
            <MainHeader isHeaderMenu={true} />
            {children}
            <BookingFooter />
        </div>
    );
};

export default BookingLayout;
