// Define the FormFields type
export type FormFields = {
  [key: string]: string;
};

export type ValidationFunction = (key: keyof FormFields, value: string) => string | null;