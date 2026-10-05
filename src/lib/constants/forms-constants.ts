export const FormsConstants = {
  AW: {
    Form: {
      CCPFormStep: 'awCcpFormStep',
      CCPFormTimeout: 'awCcpFormTimeout',
      CCPFormCompleted: 'awCcpCompletedStep',
      CCPFormSubmitEventType: 'AW:FORM_CCP_SUBMIT',
      CCPFormFromExperienceText: 'fromExperience',
      CCPFormExperienceIdText: 'experienceId',
      // session keys for CCP form
      CCPFormFromExperience: 'awCCPFromExperience',
      CCPFormExperienceId: 'awCCPExperienceId',
    },
  },
  Enterprise: {
    openModalEvent: 'openGenericModal',
    openFormEvent: 'openForm',
    // Dispatched when a form instance is mounted inside a modal (i.e. the user opened the modal).
    formOpenedInModalEvent: 'awFormOpenedInModal',
  },
  Country: {
    USA: 'USA',
    Canada: 'Canada',
    Mexico: 'Mexico',
    Other: 'Other',
  },
};
