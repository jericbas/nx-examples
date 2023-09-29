import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  readJson,
  updateJson,
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
    execSync(`npx create-docusaurus@latest ${projectRoot} classic --typescript -s`, { stdio: 'inherit' });

    // Add Nx project configuration
    addProjectConfiguration(tree, options.name, {
      root: projectRoot,
      projectType: 'application',
      sourceRoot: `${projectRoot}/src`,
      targets: {
        // Add your Nx targets here, if any
      },
    });

    // Update root package.json dependencies and devDependencies
    const rootPackageJsonPath = 'package.json';

    updateJson(tree, rootPackageJsonPath, (json) => {
      const newDependencies = {
        "@docusaurus/core": "2.4.3",
        "@docusaurus/preset-classic": "2.4.3",
        "@mdx-js/react": "^1.6.22",
        "clsx": "^1.2.1",
        "prism-react-renderer": "^1.3.5",
      };

      const newDevDependencies = {
        "@docusaurus/module-type-aliases": "2.4.3",
        "@tsconfig/docusaurus": "^1.0.5",
      };

      return {
        ...json,
        dependencies: { ...json.dependencies, ...newDependencies },
        devDependencies: { ...json.devDependencies, ...newDevDependencies },
      };
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
