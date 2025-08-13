import MainLayout from '../../layouts/MainLayout';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    return (
        <div>
            <MainLayout>
                <h1>Home</h1>
            </MainLayout>
        </div>
    );
};

export default Home;
