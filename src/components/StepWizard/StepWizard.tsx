import React from 'react';
import clsx from 'clsx';

interface StepItem {
    id: number;
    title: string;
}

interface StepWizardProps {
    steps: StepItem[];
    currentStep: number;
    className?: string;
}

const StepWizard: React.FC<StepWizardProps> = ({ steps, currentStep, className }) => {
    return (
        <div className={clsx('booking-wizard', className)}>
            <ul
                className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
                id="progressbar2"
            >
                {steps.map((stepItem) => (
                    <li
                        key={stepItem.id}
                        className={(() => {
                            if (stepItem.id === currentStep) {
                                return 'progress-active';
                            }
                            if (stepItem.id < currentStep) {
                                return 'progress-activated';
                            }
                            return '';
                        })()}
                    >
                        <div className="profile-step">
                            <span className="multi-steps">{stepItem.id}</span>
                            <div className="step-section">
                                <h6>{stepItem.title}</h6>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StepWizard;
