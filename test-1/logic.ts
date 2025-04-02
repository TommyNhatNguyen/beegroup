import readline from 'readline';

// Cancel the process when press key "q"
// Ref sources: https://github.com/nodejs/node/issues/2890
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.on('keypress', (chunk, key) => {
  if (key && key.name == 'q') process.exit();
});

function validateNumbers(numbers: number[]): boolean | Error {
  if (!Array.isArray(numbers)) {
    return new Error('Input is not an array');
  }

  if (numbers.some((number) => typeof number !== 'number')) {
    return new Error('Input array contains non-number values');
  }
  return true;
}

function progress(currentWork: number, totalWork: number): number {
  const currentProgress = (currentWork / totalWork) * 100;
  console.log(`Progress: ${'|'.repeat(currentProgress)} ${currentProgress}%\n`);
  return currentProgress;
}

function handleItemFunction(number: number): number {
  // Do something with the number
  console.log(`Done processing item: ${number}`);
  return number;
}

async function processWithDelay(
  numbers: number[],
  delay: number = 1,
  progressCallback: (currentWork: number, totalWork: number) => void = () => {}
): Promise<number[]> {
  console.log('Processing... Press "q" to cancel');
  if (numbers.length === 0) {
    return await Promise.resolve([]);
  }

  if (validateNumbers(numbers) instanceof Error) {
    throw validateNumbers(numbers);
  }

  const promises = numbers.map(
    (number, index) =>
      new Promise((resolve) =>
        setTimeout(
          () => resolve(handleItemFunction(number)),
          delay * 1000 * (index + 1)
        )
      )
  );

  const result: any = await Promise.all(
    promises.map(async (p, index) => {
      await p;
      progressCallback(index + 1, promises.length);
      return p;
    })
  );
  console.log('Done processing');
  return result;
}

// let numbers: number[] = [];
// let numbers: any = {};
// let numbers: any = [10, 20, 30, 40, '100'];
let numbers: number[] = [10, 20, 30, 40, 50];
processWithDelay(numbers, 1, progress).then((result) => {
  console.log(result);
  process.exit();
});
