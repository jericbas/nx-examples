import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { execSync } from 'child_process';
import { DocusaurusGeneratorGeneratorSchema } from './schema';

export async function docusaurusGeneratorGenerator(
  tree: Tree,
  options: DocusaurusGeneratorGeneratorSchema
) {
  const projectRoot = `apps/${options.name}`;

  // Check if the project directory already exists
  if (tree.exists(`${projectRoot}/package.json`)) {
    console.error(`Cannot create a new project ${options.name} at ${projectRoot}. It already exists.`);
  } else {
    // Create a new Docusaurus site with TypeScript using create-docusaurus
    execSync(`npx create-docusaurus@latest ${projectRoot} classic --typescript`, { stdio: 'inherit' });

    // Add Nx project configuration
    addProjectConfiguration(tree, options.name, {
      root: projectRoot,
      projectType: 'application',
      sourceRoot: `${projectRoot}/src`,
      targets: {
        // Add your Nx targets here, if any
      },
    });
  }

  // Generate project.json regardless of whether the project directory existed
  const projectJsonPath = `${projectRoot}/project.json`;
  if (!tree.exists(projectJsonPath)) {
    const projectJsonContent = {
      "scripts": {
        "start": "docusaurus start",
        "build": "docusaurus build"
      },
      // Add other custom configurations here
    };
    tree.write(projectJsonPath, JSON.stringify(projectJsonContent, null, 2));
  }

  // Generate additional files if needed
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  await formatFiles(tree);
}

export default docusaurusGeneratorGenerator;
