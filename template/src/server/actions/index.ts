import path from 'path';
import { readdir } from 'fs/promises';
import { ActionDeclareResult, ActionResult, Context, IncomingMessage, handlers } from '@epiijs/server';

export default async function PageHome(message: IncomingMessage, context: Context): Promise<ActionResult> {
  const appConfig = context.getAppConfig();

  // this is a demo for local dev redirecting 
  // you should not care about dev in real service
  const isDev = process.env['epiijs_env'] === 'dev';
  if (isDev) {
    return {
      status: 302,
      headers: {
        'location': `http://localhost:${appConfig.port.client}/`,
        'content-type': 'text/html; charset=utf8'
      }
    };
  }

  console.log(message.url);

  const fileRoot = path.join(appConfig.root, appConfig.dirs.target, appConfig.dirs.client);
  const fileName = message.url.slice(1) || 'index.html';
  const fileNames = await readdir(fileRoot);
  if (!fileNames.includes(fileName)) {
    throw new Error(`file not found [${message.url}]`);
  }

  await context.useHandler(handlers.staticFiles({ fileName, fileRoot }));
}

export function declare(): ActionDeclareResult {
  return {
    routes: [
      { method: 'GET', path: '/$any' }
    ]
  };
}