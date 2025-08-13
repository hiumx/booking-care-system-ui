interface AuthLayoutProps {
    title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title }) => {
    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
};

export default AuthLayout;
