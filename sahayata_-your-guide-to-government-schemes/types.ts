
export interface Scheme {
  schemeName: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  documentsRequired: string[];
  applicationProcess: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export type Language = 'en' | 'hi';

export interface Settings {
  language: Language;
  isHighContrast: boolean;
  isLargeText: boolean;
}

export type View = 'finder' | 'docs' | 'chat' | 'community';

export interface GlossaryTerm {
  term: string;
  definition: string;
}
