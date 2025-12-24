import { useTranslation } from 'react-i18next';

export interface BookingActionProps {
    nextStepTitle: string;
    prevStep: () => void;
    nextStep: () => void;
    disabled?: boolean;
    loading?: boolean;
    showPrev?: boolean;
}

const BookingAction: React.FC<BookingActionProps> = ({
    nextStepTitle,
    prevStep,
    nextStep,
    disabled = false,
    loading = false,
    showPrev = true,
}) => {
    const { t } = useTranslation('booking');

    const containerClass = showPrev
        ? 'd-flex align-items-center flex-wrap rpw-gap-2 justify-content-between'
        : 'd-flex align-items-center flex-wrap rpw-gap-2 justify-content-end';

    return (
        <div className="card-footer">
            <div className={containerClass}>
                {showPrev && (
                    <button
                        className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                        onClick={prevStep}
                        disabled={loading}
                    >
                        <i className="isax isax-arrow-left-2 me-1"></i>
                        {t('common.back')}
                    </button>
                )}
                <button
                    onClick={nextStep}
                    className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                    disabled={disabled || loading}
                >
                    {loading && <i className="fa fa-spinner fa-spin me-2"></i>}
                    {nextStepTitle}
                    {!loading && <i className="isax isax-arrow-right-3 ms-1"></i>}
                </button>
            </div>
        </div>
    );
};

export default BookingAction;
