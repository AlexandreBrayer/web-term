import { writable } from "svelte/store";
var tree = {
  "": {
    bin: {},
    boot: {},
    data: {},
    dev: {},
    etc: {},
    home: {
      nephis: {
        fileTest: "This is a test file",
        fileTest2: "This is a test file2",
        fileTest3: "This is a test file3",
        dirTest: {
          fileTest4: "This is a test file4",
          fileTest5: "This is a test file5",
        },
      },
    },
    init: {},
    lib: {},
    lib32: {},
    lib64: {},
    libx32: {},
    lost: {},
    found: {},
    media: {},
    mnt: {},
    opt: {},
    proc: {},
    root: {},
    run: {},
    sbin: {},
    snap: {},
    srv: {},
    sys: {},
    tmp: {},
    usr: {},
    var: {},
  },
};
export const treeStore = writable(tree);
treeStore.subscribe((value) => (tree = value));
const homePath = ["", "home", "nephis"];
var path = homePath;
export const pathStore = writable(path);
pathStore.subscribe((value) => (path = value));

function parseArgs(args: string): string[] {
  if (args === "") {
    return [];
  }
  return args
    .match(/(?:[^\s"]+|"[^"]*")+/g)
    .map((arg) => arg.replace(/"/g, ""));
}

function getCurrentDir(): any {
  let currentDir = tree;
  for (let i = 0; i < path.length; i++) {
    currentDir = currentDir[path[i]];
  }
  return currentDir;
}
function getDirFromPath(path: string[]): any {
  try {
    let currentDir = tree;
    for (let i = 0; i < path.length; i++) {
      currentDir = currentDir[path[i]];
    }
    return currentDir;
  } catch {
    return false;
  }
}

const commands = {
  help: (): string => {
    return "you need help";
  },
  echo: (args: string[]): string => {
    return args.join(" ");
  },
  pwd: (): string => {
    return path.join("/") != "" ? path.join("/") : "/";
  },
  ls: (): string => {
    let currentDir = getCurrentDir();
    let output = "";
    for (let key in currentDir) {
      output += key + " ";
    }
    return output;
  },
  cd: (args: string[]): string => {
    if (args.length === 0) {
      path = homePath;
      return "";
    }
    let currentPath = path;
    let goTo = args[0].split("/");
    if (goTo[goTo.length - 1] === "") {
      goTo = goTo.slice(0, -1);
    }
    if (goTo[0] === "") {
      currentPath = [""];
      goTo = goTo.slice(1);
    }
    for (let i = 0; i < goTo.length; i++) {
      if (goTo[i] === "..") {
        if (currentPath.length !== 1) {
          currentPath = currentPath.slice(0, -1);
        }
      } else {
        currentPath = [...currentPath, goTo[i]];
      }
    }
    let currentDir = getDirFromPath(currentPath);
    if (currentDir) {
      path = currentPath;
    } else {
      return "cd: no such file or directory: " + args[0];
    }
    return "";
  },
  cat: (args: string[]): string => {
    let currentDir = getCurrentDir();
    let output = "";
    for (let i = 0; i < args.length; i++) {
      if (currentDir[args[i]]) {
        output += currentDir[args[i]] + " ";
      } else {
        return "cat: " + args[i] + ": No such file or directory";
      }
    }
    return output;
  },
};

export function command(command: string): {
  returnCode: number;
  output: string;
} {
  const commandName = command.split(" ")[0];
  const args = command.split(" ").slice(1).join(" ") || "";
  const commandFunction = commands[commandName];
  if (commandFunction) {
    return { output: commandFunction(parseArgs(args)), returnCode: 0 };
  } else if (commandName === "") {
    return { output: "", returnCode: 0 };
  } else {
    return { output: `Command "${commandName}" not found`, returnCode: 1 };
  }
}
