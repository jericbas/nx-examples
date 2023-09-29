import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';

export default async function runExecutor(
  options: { command: string },
  context: ExecutorContext
): Promise<{ success: boolean }> {
  try {
    execSync(`docusaurus ${options.command}`, { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    console.error(`Failed to execute Docusaurus command: ${options.command}`, error);
    return { success: false };
  }
}
