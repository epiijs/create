import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { glob } from 'glob';
import { kebabCase } from 'lodash-es';
import prompts from 'prompts';

interface IInputParams {
  targetDir: string;
  targetApp: {
    name: string;
  }
}

async function acceptParams(): Promise<IInputParams> {
  const targetDir = process.cwd();
  const foundFiles = await fs.readdir(targetDir);

  if (foundFiles.includes('.git')) {
    throw new Error('cannot create new project in a git repository');
  }

  const questions: prompts.PromptObject<string>[] = [
    {
      type: 'text',
      name: 'name',
      message: 'What is your project name?'
    }
  ];
  const promptResult = await prompts(questions);

  if (foundFiles.includes(promptResult.name)) {
    throw new Error(`<${promptResult.name}> is already existed`);
  }

  return {
    targetDir,
    targetApp: {
      name: promptResult.name
    }
  };
}

async function deployTarget(inputParams: IInputParams): Promise<void> {
  const { targetDir, targetApp } = inputParams;
  const targetAppDir = path.join(targetDir, targetApp.name);
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const sourceTemplateDir = path.join(currentDir, '../template');

  const deployObject = async (objectPath: string): Promise<void> => {
    const objectDir = path.dirname(objectPath);
    const sourcePath = path.join(sourceTemplateDir, objectPath);
    const targetDir = path.join(targetAppDir, objectDir);
    const targetPath = path.join(targetAppDir, objectPath.replace('_d_', '.'));
    await fs.mkdir(targetDir, { recursive: true });
    const sourceContent = await fs.readFile(sourcePath, 'utf-8');
    const targetContent = sourceContent
      .replace(/\$\{name\}/g, targetApp.name)
      .replace(/\$\{name-in-kebab-case\}/g, kebabCase(targetApp.name));
    await fs.writeFile(targetPath, targetContent);
  };

  const objects = (await glob(`${sourceTemplateDir}/**/*`, { nodir: true }))
      .map(e => path.relative(sourceTemplateDir, e));
  await Promise.all(objects.map(e => deployObject(e)));
}

async function main(): Promise<void> {
  const outputMessage = (message: string): void => {
    console.log(`\n${message}\n`);
  }

  const inputParams = await acceptParams().catch(error => {
    outputMessage(error.message);
    process.exit(1);
  });

  await deployTarget(inputParams).catch(error => {
    outputMessage(error.message);
    process.exit(2);
  });

  outputMessage('succeed to create @epiijs web app');
}

main();