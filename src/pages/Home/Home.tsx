import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface HomeProps {
    title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
    return (
        <div>
            <MainLayout>
                <h1>{title}</h1>
                <Link to="/demo">Go to Demo</Link>
            </MainLayout>
        </div>
    );
};

export default Home;
