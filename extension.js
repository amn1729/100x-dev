const vscode = require("vscode");

let intervalId = null;

function randomInt(min = 10, max = min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handel100xing() {
  if (!vscode.window.activeTextEditor) return;

  const tabs = vscode.window.tabGroups.all
    .flatMap((t) => t.tabs)
    .filter((t) => t.input instanceof vscode.TabInputText);
  if (tabs.length < 2)
    return void vscode.window.showInformationMessage("Not enough tabs");

  const currIdx = tabs.findIndex((t) => t.isActive);
  const nextIdx = (currIdx + randomInt(1, 4)) % tabs.length;

  await vscode.window.showTextDocument(tabs[nextIdx].input.uri, {
    preview: true,
  });
}

async function start100xing(power, boost) {
  const randomInterval = randomInt(power, power + boost);
  clearInterval(intervalId);
  intervalId = setInterval(handel100xing, randomInterval);
}

function activate(context) {
  const startCommand = vscode.commands.registerCommand("100x.transform", () => {
    const config = vscode.workspace.getConfiguration("100x");
    const power = config.get("powerLevel") || 5000;
    const boost = config.get("boostLevel") || 5000;

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => start100xing(power, boost), power);
  });

  const stopCommand = vscode.commands.registerCommand("100x.revert", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  context.subscriptions.push(startCommand);
  context.subscriptions.push(stopCommand);
}

function deactivate() {
  if (intervalId) clearInterval(intervalId);
}

module.exports = {
  activate,
  deactivate,
};
