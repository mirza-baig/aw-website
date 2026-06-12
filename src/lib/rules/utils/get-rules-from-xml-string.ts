import { parseXml, XmlElement } from '@rgrove/parse-xml';

import { Rule } from '../rule';
import { RuleAction } from '../rule-action';
import { RuleCondition } from '../rule-condition';
import { RuleContext } from '../rule-context';
import { RuleList } from '../rule-list';
import { GetRulesContext } from './get-rules-context';

/*
<ruleset>
  <rule uid="{996AC775-39EB-4CEF-B99B-DC857FC55027}">
    <conditions>
      <or uid="A18756DF24094ECD87454B5D7DBC88A7">
        <and uid="390E6226902C4FA197FA4BCFC62A96C6">
          <condition id="{6002678D-0F77-475D-AB41-C46DBD198654}" uid="51BF05F712D24F14A6E0FF7A66A5D55F" itemid="{B0198E27-6331-4FD3-8128-B4220A8A5A0C}" />
          <condition id="{2AF6E625-0662-48EC-93C0-1205D0B433B4}" uid="D3BB151665314403BF4D4D554C35AB9D" templateids="{9256EDF3-D0FA-4588-ADDA-3036B9D04FAA}|{68F36855-3CD5-454E-B1EB-13E29F3F6E54}|{A28667E9-0CD2-46A9-A228-0F6C8D85B817}" />
        </and>
        <and uid="6F705243F4424D3B984CC7EB06C094F0">
          <condition id="{6002678D-0F77-475D-AB41-C46DBD198654}" uid="FC3B5C2F45D4412F98B5A8783F897682" itemid="{F1A8BF2C-39C9-4EC9-A512-ACE6DC4E674E}" />
          <condition id="{5288E6AE-EF2A-4E1A-9E34-5D9BAED418DD}" uid="43E27D67F540410AAE0C15C25A1C7328" templateid="{68E979BD-5A69-45CF-9010-314FB66FB538}" />
        </and>
      </or>
    </conditions>
  </rule>
</ruleset>
*/

export function getRulesFromXmlString<TContext extends RuleContext>(
  value: string,
  context: GetRulesContext<TContext>,
  id?: string
): RuleList<TContext> {
  try {
    // Strip out the whitespace between XML tags to avoid parsing issues
    const xml = value.replaceAll(/(>)(\s*)(<)/g, '$1$3');
    const document = parseXml(xml);
    const ruleSet = document.root;

    const result = new RuleList<TContext>();

    if (ruleSet == null) {
      return result;
    }

    for (const ruleNode of ruleSet.children) {
      if (!(ruleNode instanceof XmlElement)) {
        continue;
      }
      const rule = getRule(ruleNode, context);
      rule.id = id;

      result.add(rule);
    }

    return result;
  } catch (err) {
    console.error('Unable to parse personalization rules %s %o', value, err);
    return new RuleList<TContext>();
  }
}

function getRule<TContext extends RuleContext>(
  data: XmlElement,
  context: GetRulesContext<TContext>
): Rule<TContext> {
  const rule = new Rule<TContext>(data.attributes.uid ?? '');

  const conditionsElement = data.children.find(
    (child) => child instanceof XmlElement && child.name === 'conditions'
  ) as XmlElement | undefined;
  if (
    conditionsElement != undefined &&
    conditionsElement.children.length > 0 &&
    conditionsElement.children[0].type == 'element'
  ) {
    const conditions = getRuleConditions(conditionsElement.children[0] as XmlElement, context);
    if (conditions) {
      rule.condition = conditions;
    }
  }

  const actionsElement = data.children.find(
    (child) => child instanceof XmlElement && child.name === 'actions'
  ) as XmlElement | undefined;
  if (actionsElement != null) {
    for (const actionElement of actionsElement.children) {
      if (!(actionElement instanceof XmlElement)) {
        continue;
      }
      const action = getRuleAction(actionElement, context);
      if (action != null) {
        rule.actions.push(action);
      }
    }
  }

  return rule;
}

function getRuleConditions<TContext extends RuleContext>(
  data: XmlElement,
  context: GetRulesContext<TContext>
): RuleCondition<TContext> | null {
  const condition = context.getCondition(data);
  if (condition) {
    condition.uid = data.attributes.uid ?? '';
  }

  return condition;
}

function getRuleAction<TContext extends RuleContext>(
  data: XmlElement,
  context: GetRulesContext<TContext>
): RuleAction<TContext> | null {
  const action = context.getAction(data);
  if (action) {
    action.uid = data.attributes.uid ?? '';
  }

  return action;
}
