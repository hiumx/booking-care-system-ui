import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    return (
        <div>
            <MainLayout>
                <h1>Home</h1>
                <Link to="/demo">Go to Demo</Link>
            </MainLayout>
        </div>
    );
};

export default Home;
