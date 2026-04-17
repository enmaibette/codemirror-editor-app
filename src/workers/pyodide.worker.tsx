import { loadPyodide, PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;

const initializePyodide = async () => {
  pyodide = await loadPyodide();
  self.postMessage({type: "ready"})
}

self.onmessage = async (event) => {
  const { type, code } = event.data;
  if (type === 'init') {
    await initializePyodide();
    return;
  }
  if (type === 'run') {
    const sanitizedCode = code.replace(/\t/g, '    ');
    if(!pyodide) return;
    try {
      const stdout: string[] = [];
      pyodide.setStdout({ batched: (line) => stdout.push(line) });
      await pyodide.runPythonAsync(sanitizedCode);

      self.postMessage({
        type: 'result',
        stdout: stdout.join('\n')
      });


    } catch (error) {
      self.postMessage({type: "error", message: (error as Error).message});
    }
  }
}