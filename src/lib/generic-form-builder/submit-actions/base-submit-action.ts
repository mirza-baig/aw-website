import { ActionProps, ActionResult, ISubmitAction, SubmitActionProps } from '.';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export abstract class BaseSubmitAction<
  T = Sitecore.BaseTemplates.BaseSubmitAction,
> implements ISubmitAction {
  constructor(protected readonly props: SubmitActionProps<T>) {}

  abstract execute(props: ActionProps): Promise<ActionResult>;
}
