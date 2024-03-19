import * as fs from 'fs';
import * as path from 'path';

let totalMethods = 0;
let missingUnitTestCount = 0;
let missingUnitTests: string[] = [];

function analyzeAndCheckTests(directory: string) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      analyzeAndCheckTests(filePath);
    } else {
      analyzeAndCheckTestForFile(filePath);
    }
  });
}

function analyzeAndCheckTestForFile(filePath: string) {
  if (filePath.endsWith('.component.ts') && !filePath.endsWith('.spec.ts')) {
    const testFilePath = filePath.replace('.ts', '.spec.ts');

    if (!fs.existsSync(testFilePath)) {
      console.log(`Missing unit test for: ${filePath}`);
      missingUnitTestCount++;
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const testFileContent = fs.readFileSync(testFilePath, 'utf-8');

      const testedMethods = extractTestedMethods(testFileContent);

      const methods = extractMethods(fileContent);
      totalMethods += methods.length;

      if (methods.length > 0) {
        checkTestMethods(testFilePath, methods, testedMethods);
      }
    }
  }
}

function extractTestedMethods(testFileContent: string): string[] {
  // Regular expression to capture method names from test file
  const testMethodRegex = /component\.(\w+)\s*\(/g;

  const matches = testFileContent.matchAll(testMethodRegex);
  return Array.from(matches, (match) => match[1]);
}

function extractMethods(fileContent: string): { name: string; content: string }[] {
  const methodRegex = /(?:public|private|protected)?\s+(\w+)\s*=\s*\([^)]*\)\s*:\s*\w+\s*=>\s*{/g;

  const matches: { name: string; content: string }[] = [];
  let match;
  while ((match = methodRegex.exec(fileContent)) !== null) {
    const methodName = match[1];
    const methodStartIndex = match.index;
    const methodEndIndex = findMethodEndIndex(fileContent, methodStartIndex);
    const methodContent = fileContent.substring(methodStartIndex, methodEndIndex);
    matches.push({ name: methodName, content: methodContent });
  }
  return matches;
}

function findMethodEndIndex(fileContent: string, methodStartIndex: number): number {
  let braceCount = 0;
  let index = methodStartIndex;
  while (index < fileContent.length) {
    if (fileContent[index] === '{') {
      braceCount++;
    } else if (fileContent[index] === '}') {
      braceCount--;
      if (braceCount === 0) {
        return index + 1;
      }
    }
    index++;
  }
  return -1; // Method end not found
}

function checkTestMethods(testFilePath: string, methods: { name: string; content: string }[], testedMethods: string[]) {
  const testFileContent = fs.readFileSync(testFilePath, 'utf-8');

  methods.forEach((method) => {
    if (!testedMethods.includes(method.name)) {
      //console.log(`Missing unit test for method '${method.name}' in: ${testFilePath}`);
      //console.log(`Provide me unit test for below content: ${method.content}`);
      missingUnitTestCount++;
      missingUnitTests.push(`Provide me unit test for below content: ${method.content}`);
    }
  });
}

// Run analysis on the entire Angular project
const projectRoot = path.resolve(__dirname, 'src/app'); // Change to your actual project structure
analyzeAndCheckTests(projectRoot);

const combinedMissingUnitTests = missingUnitTests.join('\n');

console.log(JSON.stringify({
  combinedMissingUnitTests,
  totalMethods,
  missingUnitTestCount
}));

