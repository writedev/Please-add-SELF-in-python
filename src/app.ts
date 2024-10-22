import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.addSelfInClassMethod",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const position = selection.active;

      // Vérifie si le fichier est un fichier Python et si on est dans une classe
      if (document.languageId === "python" && isInClass(document, position)) {
        editor.edit((editBuilder) => {
          const line = document.lineAt(position.line).text;
          if (line.includes("def") && line.includes("()")) {
            const newText = line.replace("()", "(self)");
            editBuilder.replace(
              new vscode.Range(position.line, 0, position.line, line.length),
              newText
            );

            // Déplace le curseur à l'intérieur des parenthèses
            const newPosition = position.with(
              position.line,
              line.indexOf("(") + 6
            );
            editor.selection = new vscode.Selection(newPosition, newPosition);
          }
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// Vérifie si la position actuelle est à l'intérieur d'une classe
function isInClass(
  document: vscode.TextDocument,
  position: vscode.Position
): boolean {
  for (let i = position.line; i >= 0; i--) {
    const line = document.lineAt(i).text.trim();
    if (line.startsWith("class ")) {
      return true;
    }
  }
  return false;
}

export function deactivate() {}
