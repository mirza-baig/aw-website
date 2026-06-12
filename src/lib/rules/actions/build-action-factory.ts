import { XmlElement } from '@rgrove/parse-xml';

import { IActionFactoryContext } from './action-factory-context';

export function buildActionFactory(context: IActionFactoryContext) {
  const actionFactory = (actionElement: XmlElement) => {
    const id = actionElement.attributes.id;
    if (id == null) {
      return null;
    }

    const actionConstructor = context.actionMap.get(id);
    if (actionConstructor == undefined) {
      console.error(`No rule action defined for '${id}'`);
      return null;
    }

    return new actionConstructor(actionElement, context);
  };

  return actionFactory;
}
