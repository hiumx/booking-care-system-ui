export interface BookingActionProps {
    nextStepTitle: string;
    prevStep: () => void;
    nextStep: () => void;
    disabled?: boolean;
}

const BookingAction: React.FC<BookingActionProps> = ({
    nextStepTitle,
    prevStep,
    nextStep,
    disabled = false,
}) => {
    return (
        <div className="card-footer">
            <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                <button
                    className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                    onClick={prevStep}
                    disabled={disabled}
                >
                    <i className="isax isax-arrow-left-2 me-1"></i>
                    Quay lại
                </button>
                <button
                    onClick={nextStep}
                    className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                    disabled={disabled}
                >
                    {disabled && <i className="fa fa-spinner fa-spin me-2"></i>}
                    {nextStepTitle}
                    {!disabled && <i className="isax isax-arrow-right-3 ms-1"></i>}
                </button>
            </div>
        </div>
    );
};

export default BookingAction;
