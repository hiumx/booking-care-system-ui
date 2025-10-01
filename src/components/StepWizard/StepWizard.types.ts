export interface StepItem {
    id: number;
    title: string;
}

export interface StepWizardProps {
    steps: StepItem[];
    currentStep: number;
    className?: string;
}
