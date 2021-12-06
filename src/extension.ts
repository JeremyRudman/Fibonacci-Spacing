import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	function getFibonacciArrayOfLengthN(length: number): number[] {
		var fibonacciArray: number[] = [];
		fibonacciArray.push(1);
		fibonacciArray.push(1);
		for (let i = 2; i < length; i++) {
			fibonacciArray.push(fibonacciArray[i-1] + fibonacciArray[i-2]);
		}
		return fibonacciArray;
	}

	let disposable = vscode.commands.registerCommand('fibonacci-spacing.perfectSpacing', () => {

		const editor  = vscode.window.activeTextEditor;

		if(editor) {
			const document = editor.document;
			const tabSize = editor.options.tabSize;
			const documentText = document.getText();
			var maxNumberOfIndents = 0;
			if(tabSize === undefined || documentText === undefined) {
				return;
			}

			const eachLineOfDocument = documentText.split(/\r?\n/);
			var spacesOnEachLine: string[] = [];
			
			eachLineOfDocument.forEach(lineText => {
				let spacesBeforeText = lineText.match(/^\s*/);
				if(spacesBeforeText !== null) {
					if(spacesBeforeText[0].length > maxNumberOfIndents) {
						maxNumberOfIndents = spacesBeforeText[0].length;
					}
					spacesOnEachLine.push(spacesBeforeText[0]);
				} else {
					spacesOnEachLine.push('');
				}
			});
			let fibonacciArray: number[] = getFibonacciArrayOfLengthN(Math.floor(maxNumberOfIndents/(tabSize as number)));
			var newSpacesOnEachLine: string[] = [];
			spacesOnEachLine.forEach(lineSpaces => {
				console.log(lineSpaces);
				console.log(lineSpaces.match(/    /));
				let numberOfIndents = lineSpaces.match(/    /)?.length;
				if(numberOfIndents === undefined) {
					numberOfIndents = 0;
				}
				let newIndents: string = '';
				for (let i = 0; i < numberOfIndents; i++) {
					newIndents += ' '.repeat(fibonacciArray[i]);
				}
				newSpacesOnEachLine.push(newIndents);
			});
			for (let i = 0; i < eachLineOfDocument.length; i++) {
				eachLineOfDocument[i] = eachLineOfDocument[0].replace(/^\s*/,newSpacesOnEachLine[i]);
			}
			let newDocumentText: string = '';
			eachLineOfDocument.forEach(line => {
				newDocumentText += line + '\n';
			});
			console.log(newDocumentText);
			editor.edit(editBuilder => {
				editBuilder.replace(editor.selection, newDocumentText);
			});
		}
		
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
