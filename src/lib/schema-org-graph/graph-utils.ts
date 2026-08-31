import { Thing } from 'schema-dts';

export function hasGraphNode(graph: Thing[], type: string): boolean {
  return graph.some((node): boolean => {
    // schema-dts v2 union includes `string` on some types; guard before accessing @type
    if (typeof node !== 'object' || node === null) {
      return false;
    }
    const schemaType = (node as Record<string, unknown>)['@type'];
    return Array.isArray(schemaType)
      ? (schemaType as string[]).includes(type)
      : schemaType === type;
  });
}

export function updateGraphNode(
  graph: Thing[],
  type: string,
  updater: (node: Record<string, unknown>) => Record<string, unknown>
): Thing[] {
  return graph.map((node) => {
    if (typeof node !== 'object' || node === null) {
      return node;
    }
    const schemaType = (node as Record<string, unknown>)['@type'];
    const matches = Array.isArray(schemaType)
      ? (schemaType as string[]).includes(type)
      : schemaType === type;
    return matches ? (updater(node as Record<string, unknown>) as unknown as Thing) : node;
  });
}
