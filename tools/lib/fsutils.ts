import { $ } from 'execa';
import { globby } from 'globby';
import { access, cp, readFile, rm, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

export const glob = globby;

export async function rmrf(path: string) {
  try {
    await rm(path, { recursive: true });
  } catch {}
}

export async function exists(path: string) {
  return await access(path)
    .then(() => true)
    .catch(() => false);
}

export async function cpRf(src: string, dest: string) {
  await cp(src, dest, { recursive: true, force: true });
}

export async function replaceAllInFile(
  path: string,
  pattern: string | RegExp,
  replacement: string
) {
  const content = await readFile(path, 'utf-8');
  const newContent = content.replaceAll(pattern, replacement);
  await writeFile(path, newContent, 'utf-8');
}

export async function rename(oldPath: string, newPath: string) {
  await cp(oldPath, newPath);
  await rm(oldPath);
}

export async function getWordCount(path: string) {
  return $`wc -c ${path}`.then(({ stdout }) => {
    return parseInt(stdout.trim().split(' ')[0]);
  });
}

export function getEnFilePath(file: string) {
  const ext = extname(file);
  if (file.endsWith(`.en${ext}`)) {
    return file;
  }
  return file.replace(ext, `.en${ext}`);
}

export function getLocalizedFilePath(file: string) {
  const ext = extname(file);
  if (file.endsWith(`.en${ext}`)) {
    return file.replace(`.en${ext}`, ext);
  }
  return file;
}
