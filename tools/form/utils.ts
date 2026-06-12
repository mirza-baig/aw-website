import fs from 'fs';
import chokidar from 'chokidar';

/**
 * Run watch mode, watching on @var rootPath
 */
export function watchItems(rootPath: string, cb: () => void): void {
  chokidar
    .watch(rootPath, { ignoreInitial: true, awaitWriteFinish: true })
    .on('add', cb)
    .on('unlink', cb);
}

/**
 * Using @var path find all files recursively and generate output using @var resolveItem by calling it for each file
 * @param path plugins path
 * @param resolveItem will resolve item in required data format
 * @param cb will be called when new item is found
 * @param fileFormat Matches specific files
 * @returns {Item[]} items
 */
export function getItems<Item>(settings: {
  path: string;
  resolveItem: (path: string, name: string) => Item;
  cb?: (item: Item) => void;
  fileFormat?: RegExp;
}): Item[] {
  const { path, resolveItem, cb, fileFormat = new RegExp(/(.+)(?<!\.d)\.[jt]sx?$/) } = settings;
  const items: Item[] = [];
  const folders: fs.Dirent[] = [];

  if (!fs.existsSync(path)) return [];

  fs.readdirSync(path, { withFileTypes: true }).forEach((value) => {
    if (value.isDirectory()) {
      folders.push(value);
    }

    if (fileFormat.test(value.name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const name = value.name.match(fileFormat)![1];
      const item = resolveItem(path, name);
      items.push(item);
      cb && cb(item);
    }
  });

  for (const folder of folders) {
    items.push(
      ...getItems<Item>({
        path: `${path}/${folder.name}`,
        resolveItem,
        cb,
        fileFormat,
      })
    );
  }

  return items;
}
