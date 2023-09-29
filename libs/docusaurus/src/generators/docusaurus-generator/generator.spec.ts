import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { docusaurusGeneratorGenerator } from './generator';
import { DocusaurusGeneratorGeneratorSchema } from './schema';

describe('docusaurus-generator generator', () => {
  let tree: Tree;
  const options: DocusaurusGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await docusaurusGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
