#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import { IArgumentsParsed } from "./interfaces/IArguments";
import Project from "./commands/create-project";
import ArgumentsHandler from "./commands/arguments";
import initializeGit from "./commands/git";
import Listr from "listr";
import chalk from "chalk";
import { projectInstall } from "pkg-install";
import DependenciesHandler from "./commands/dependencies";

async function startApp(): Promise<void> {
  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: IArgumentsParsed | undefined = await ArgumentsHandler.parseArguments(process.argv);

  // Handle errors
  if (!parsedArguments) process.exit(1);

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { template, db, testing, orm, engine } = answers; 

  const tasks = new Listr([
    {
      title: "Creating project's structure...",
      task: () => {
        console.log("");
        Project.create({ template, db, testing, orm, engine }, parsedArguments.projectDirectory)
      }
    },
    {
      title: "Initializing Git...",
      task: () => initializeGit(parsedArguments.projectDirectory)
    },
    {
      title: "Installing dependencies...",
      task: async () => {
        // Install the pre-defined dependencies in the template's package.json file
        await projectInstall({ cwd: parsedArguments.projectDirectory });

        // Install production and development dependencies based on what the user selected
        await DependenciesHandler.handleDependencies(parsedArguments.projectDirectory, answers);
      }
    }
  ]);

  await tasks.run();

  // TODO: Move to a separate utility function for handling text to be displayed in the CLI 
  console.log("");
  console.log(chalk.green.bold("DONE"), "Project has been created!");
  console.log("");

  process.exit(0);
}

startApp();
