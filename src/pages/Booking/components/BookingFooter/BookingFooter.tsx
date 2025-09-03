interface BookingFooterProps {
    nextStepTitle: string;
}

const BookingFooter: React.FC<BookingFooterProps> = ({ nextStepTitle }) => {
    return (
        <div className="card-footer">
            <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                <a
                    href="javascript:void(0);"
                    className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                >
                    <i className="isax isax-arrow-left-2 me-1"></i>
                    Back
                </a>
                <a
                    onClick={() => console.log('Next step clicked')}
                    className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                >
                    {nextStepTitle}
                    <i className="isax isax-arrow-right-3 ms-1"></i>
                </a>
            </div>
        </div>
    );
};

export default BookingFooter;
