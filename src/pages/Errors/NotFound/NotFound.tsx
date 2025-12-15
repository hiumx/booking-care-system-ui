import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import error404Image from '@/assets/img/error-404.png';

/**
 * 404 Not Found Page Component
 * Displays when user navigates to a non-existent route
 */
const NotFound = () => {
    return (
        <div className="container-fluid p-0">
            <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
                <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
                    <div className="col-lg-8 col-md-12 text-center">
                        <div className="error-info">
                            <div className="error-404-img">
                                <img
                                    src={error404Image}
                                    className="img-fluid"
                                    alt="Trang không tồn tại"
                                />
                                <div className="error-content">
                                    <h5 className="mb-2">Oops! Không tìm thấy trang.</h5>
                                    <p>Trang bạn đang tìm kiếm không tồn tại.</p>
                                    <Link
                                        to={PATHS.HOME}
                                        className="btn btn-primary-gradient btn-sm"
                                        aria-label="Quay về trang chủ"
                                    >
                                        Quay về Trang chủ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
