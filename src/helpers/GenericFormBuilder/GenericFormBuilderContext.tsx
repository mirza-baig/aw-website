import { FormPage } from 'lib/generic-form-builder/form-props';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';

export type GenericFormBuilderContextState = {
  currentPage: number;
  navigateToPage: (pageNumber: number) => void;
  isErrorOnSubmit: false | string;
  setIsErrorOnSubmit: Dispatch<SetStateAction<false | string>>;
  botCheckers: string[];
  isFormInteracted?: boolean;
  sessionId: string;
  formPages: FormPage[];
  initialValues: Record<string, unknown>;
  formDetails: { id?: string; name?: string };
};

const GenericFormBuilderContext = createContext<GenericFormBuilderContextState>(
  {} as GenericFormBuilderContextState
);

export type GenericFormBuilderContextProviderProps = PropsWithChildren<{
  initialState: GenericFormBuilderContextState;
}>;

export function GenericFormBuilderContextProvider({
  children,
  initialState,
}: GenericFormBuilderContextProviderProps) {
  return (
    <GenericFormBuilderContext.Provider value={initialState}>
      {children}
    </GenericFormBuilderContext.Provider>
  );
}

export function useGenericFormBuilderContext(): GenericFormBuilderContextState {
  const context = useContext(GenericFormBuilderContext);
  if (context === undefined) {
    throw new Error(
      'useGenericFormBuilderContext must be used within a GenericFormBuilderContextProvider'
    );
  }
  return context;
}
