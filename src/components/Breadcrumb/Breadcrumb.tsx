import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    title: string;
    backgroundImages?: {
        bg01?: string;
        bg02?: string;
        icon01?: string;
        icon02?: string;
    };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    title,
    backgroundImages = {
        bg01: './src/assets/img/bg/breadcrumb-bg-01.png',
        bg02: './src/assets/img/bg/breadcrumb-bg-02.png',
        icon01: './src/assets/img/bg/breadcrumb-icon.png',
        icon02: './src/assets/img/bg/breadcrumb-icon.png',
    },
}) => {
    return (
        <div className="breadcrumb-bar">
            <div className="container">
                <div className="row align-items-center inner-banner">
                    <div className="col-md-12 col-12 text-center">
                        <nav aria-label="breadcrumb" className="page-breadcrumb">
                            <ol className="breadcrumb">
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`breadcrumb-item ${item.isActive ? 'active' : ''}`}
                                        aria-current={item.isActive ? 'page' : undefined}
                                    >
                                        {item.path ? (
                                            <Link to={item.path}>
                                                {index === 0 && (
                                                    <i className="isax isax-home-15"></i>
                                                )}
                                                {index > 0 && item.label}
                                            </Link>
                                        ) : (
                                            <>
                                                {index === 0 && (
                                                    <i className="isax isax-home-15"></i>
                                                )}
                                                {index > 0 && item.label}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ol>
                            <h2 className="breadcrumb-title">{title}</h2>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="breadcrumb-bg">
                <img src={backgroundImages.bg01} alt="img" className="breadcrumb-bg-01" />
                <img src={backgroundImages.bg02} alt="img" className="breadcrumb-bg-02" />
                <img src={backgroundImages.icon01} alt="img" className="breadcrumb-bg-03" />
                <img src={backgroundImages.icon02} alt="img" className="breadcrumb-bg-04" />
            </div>
        </div>
    );
};

export default Breadcrumb;
