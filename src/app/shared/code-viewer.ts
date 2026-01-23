import {EditorConfiguration} from 'codemirror';

declare var CodeMirror: any;
declare var hljs: any;
declare const window: any;

export function prepareCode() {
  setTimeout(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      const canRun = block.parentElement.className.indexOf('run_') > -1;
      const java = block.parentElement.className.indexOf('run_main') > -1;
      const golang = block.parentElement.className.indexOf('run_golang') > -1;

      sandBoxWidget(block, java, canRun, golang);
    });
  }, 0);
}

function sandBoxWidget(block, java, canRun, golang) {
  // Create elements
  const codeEl = document.createElement('textarea');
  const outputEl = document.createElement('textarea');
  const buttonContainer = document.createElement('div');
  const runButton = document.createElement('button');
  const copyButton = document.createElement('button');
  const div = document.createElement('div');
  const divEnd = document.createElement('div');

  // Add classes and inner text
  div.classList.add('pt-2');
  div.innerText = 'Вывод:';
  divEnd.classList.add('mt-3');
  buttonContainer.classList.add('mt-3', 'mb-1', 'd-flex', 'gap-2');

  runButton.classList.add('btn', 'btn-success', 'btn-sm', 'mr-1');
  runButton.innerHTML = '<i class="fa fa-caret-right mr-1"></i>Запустить';

  copyButton.classList.add('btn', 'btn-light', 'btn-sm');
  copyButton.innerHTML = '<i class="fa fa-copy mr-1"></i>Копировать';

  // Append buttons to the button container
  if (canRun) {
    buttonContainer.appendChild(runButton);
  }
  buttonContainer.appendChild(copyButton);

  // Insert elements before the block
  block.parentElement.before(buttonContainer);
  block.parentElement.before(codeEl);
  if (canRun) {
    block.parentElement.before(div);
    block.parentElement.before(outputEl);
  }
  block.parentElement.before(divEnd);

  const code = CodeMirror.fromTextArea(codeEl, {
    lineNumbers: true,
    matchBrackets: true,
    mode: 'text/x-java',
    indentUnit: 4,
    indentWithTabs: false,
    theme: localStorage.getItem('theme') === 'light'
      ? 'idea'
      : 'dracula'
  } as EditorConfiguration);

  const runCode = (output, runButton) => {
    // Disable the button and change the icon to loading
    runButton.disabled = true;
    const originalIcon = runButton.innerHTML;
    runButton.innerHTML = '<i class="fa fa-spinner fa-spin mr-1"></i>Загрузка...';

    const handleResponse = (model) => {
      output.getDoc().setValue(model.output);
      // Enable the button and revert the icon
      runButton.disabled = false;
      runButton.innerHTML = originalIcon;
    };

    if (java) {
      this.tasksService.runJava(code.getValue()).subscribe(handleResponse, handleError);
    } else if (golang) {
      this.tasksService.runGoLang(code.getValue()).subscribe(handleResponse, handleError);
    } else {
      this.tasksService.runSql(code.getValue()).subscribe(handleResponse, handleError);
    }
  };

  // Set initial code value
  code.getDoc().setValue(
    block.innerHTML
      .split('<br>').join('\r\n')
      .split('&gt;').join('>')
      .split('&lt;').join('<')
      .split('&amp;').join('&')
  );

  // Fun error handler
  const handleError = (err) => {
    // Fun error message
    const messages = [
      'Oops! Something went wrong. 🤷‍♂️',
      'Whoops! Looks like the code ran into a snag. 🥴',
      'Error! The gremlins are at it again! 👾',
      'Yikes! The code hit a bump in the road. 🚧',
      'Oh no! Something broke. We\'ll fix it! 🛠️',
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    alert(`${message}\n\nError details: ${err}`);

    // Re-enable the button and revert the icon
    runButton.disabled = false;
    runButton.innerHTML = '<i class="fa fa-caret-right mr-1"></i>Запустить';
  };

  // Run button event listener
  if (canRun) {
    const output = CodeMirror.fromTextArea(outputEl, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
      indentUnit: 4,
      indentWithTabs: false,
      theme: localStorage.getItem('theme') === 'light'
        ? 'idea'
        : 'dracula'
    } as EditorConfiguration);

    code.on('keydown', (cm, event) => {
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        runCode(output, runButton)
      }
    });
    runButton.addEventListener('click', () => runCode(output, runButton));
  }

  // Copy button event listener
  copyButton.addEventListener('click', () => {
    const codeText = code.getValue();
    navigator.clipboard.writeText(codeText).then(() => {
      const originalIcon = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="fa fa-check mr-1"></i>Скопировано';
      setTimeout(() => {
        copyButton.innerHTML = originalIcon;
      }, 2000); // Revert icon back after 2 seconds
    }).catch(err => {
      alert('Failed to copy code: ' + err);
    });
  });

  // Remove the original block element
  block.parentElement.parentElement.removeChild(block.parentElement);
}
