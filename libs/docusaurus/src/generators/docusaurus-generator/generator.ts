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
  
  // Create a new Docusaurus site with TypeScript using create-docusaurus
  execSync(`npx create-docusaurus@latest ${projectRoot} classic --typescript`, { stdio: 'inherit' });

  // Generate project.json
  const projectJsonPath = `${projectRoot}/project.json`;
  const projectJsonContent = {
    "scripts": {
      "start": "docusaurus start",
      "build": "docusaurus build"
    },
    // Add other custom configurations here
  };
  tree.write(projectJsonPath, JSON.stringify(projectJsonContent, null, 2));

  // Add Nx project configuration
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      // Add your Nx targets here, if any
    },
  });

  // Generate additional files if needed
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  await formatFiles(tree);
}

export default docusaurusGeneratorGenerator;
