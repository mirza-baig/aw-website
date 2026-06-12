import { useExternalScript } from 'lib/utils/use-external-script';

export const useModelViewerScript = () => {
  const modelViewerScriptUrl =
    'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
  const modelViewerScriptState = useExternalScript(modelViewerScriptUrl, 'module');

  return modelViewerScriptState;
};
