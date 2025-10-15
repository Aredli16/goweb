export interface Question {
    id: number;
    question: string;
    options: { id: string; label: string }[];
    next?: Record<string, number | string>;
}

export interface Diagnostic {
    id: string;
    title: string;
    description: string;
    price: string;
    includes: string[];
}

export interface Quiz {
    questions: Question[];
    diagnostics: Diagnostic[];
}

export interface StepResponseQuestion {
    type: "question";
    data: Question;
}

export interface StepResponseDiagnostic {
    type: "diagnostic";
    data: Diagnostic;
}

export type StepResponse = StepResponseQuestion | StepResponseDiagnostic;