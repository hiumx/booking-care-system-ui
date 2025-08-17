import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, title }) => {
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
                <img
                    src="./src/assets/img/bg/breadcrumb-bg-01.png"
                    alt="img"
                    className="breadcrumb-bg-01"
                />
                <img
                    src="./src/assets/img/bg/breadcrumb-bg-02.png"
                    alt="img"
                    className="breadcrumb-bg-02"
                />
                <img
                    src="./src/assets/img/bg/breadcrumb-icon.png"
                    alt="img"
                    className="breadcrumb-bg-03"
                />
                <img
                    src="./src/assets/img/bg/breadcrumb-icon.png"
                    alt="img"
                    className="breadcrumb-bg-04"
                />
            </div>
        </div>
    );
};

export default Breadcrumb;
