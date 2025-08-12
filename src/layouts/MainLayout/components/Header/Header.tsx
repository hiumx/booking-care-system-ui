import { Link } from 'react-router-dom';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    return (
        <div>
            <header>
                <h1>BookingCare</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </header>
        </div>
    );
};

export default Header;
