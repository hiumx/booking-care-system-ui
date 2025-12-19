export interface StepItem {
    id: number;
    title?: string;
    titleKey?: string; // Translation key for i18n
}

export interface StepWizardProps {
    steps: StepItem[];
    currentStep: number;
    className?: string;
}
