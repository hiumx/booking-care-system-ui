import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { PATHS } from '@/routes/paths';

const Home: React.FC = () => {
    return (
        <div>
            <MainLayout>
                <Link to={PATHS.SCREEN_MANAGEMENT}>Go to Screen Management</Link>
            </MainLayout>
        </div>
    );
};

export default Home;
