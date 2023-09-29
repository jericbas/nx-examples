import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';

export default async function docusaurusExecutor(
  options: any,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  try {
    const command = options.command || 'start'; // Default to 'start' if no command is provided
    execSync(`npx docusaurus ${command}`, { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    console.error(`Failed to execute Docusaurus command: ${options.command}`, error);
    return { success: false };
  }
}
