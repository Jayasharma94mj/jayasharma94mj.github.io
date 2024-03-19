"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var totalMethods = 0;
var missingUnitTestCount = 0;
var missingUnitTests = [];
function analyzeAndCheckTests(directory) {
    var files = fs.readdirSync(directory);
    files.forEach(function (file) {
        var filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            analyzeAndCheckTests(filePath);
        }
        else {
            analyzeAndCheckTestForFile(filePath);
        }
    });
}
function analyzeAndCheckTestForFile(filePath) {
    if (filePath.endsWith('.component.ts') && !filePath.endsWith('.spec.ts')) {
        var testFilePath = filePath.replace('.ts', '.spec.ts');
        if (!fs.existsSync(testFilePath)) {
            console.log("Missing unit test for: ".concat(filePath));
            missingUnitTestCount++;
        }
        else {
            var fileContent = fs.readFileSync(filePath, 'utf-8');
            var testFileContent = fs.readFileSync(testFilePath, 'utf-8');
            var testedMethods = extractTestedMethods(testFileContent);
            var methods = extractMethods(fileContent);
            totalMethods += methods.length;
            if (methods.length > 0) {
                checkTestMethods(testFilePath, methods, testedMethods);
            }
        }
    }
}
function extractTestedMethods(testFileContent) {
    // Regular expression to capture method names from test file
    var testMethodRegex = /component\.(\w+)\s*\(/g;
    var matches = testFileContent.matchAll(testMethodRegex);
    return Array.from(matches, function (match) { return match[1]; });
}
function extractMethods(fileContent) {
    var methodRegex = /(?:public|private|protected)?\s+(\w+)\s*=\s*\([^)]*\)\s*:\s*\w+\s*=>\s*{/g;
    var matches = [];
    var match;
    while ((match = methodRegex.exec(fileContent)) !== null) {
        var methodName = match[1];
        var methodStartIndex = match.index;
        var methodEndIndex = findMethodEndIndex(fileContent, methodStartIndex);
        var methodContent = fileContent.substring(methodStartIndex, methodEndIndex);
        matches.push({ name: methodName, content: methodContent });
    }
    return matches;
}
function findMethodEndIndex(fileContent, methodStartIndex) {
    var braceCount = 0;
    var index = methodStartIndex;
    while (index < fileContent.length) {
        if (fileContent[index] === '{') {
            braceCount++;
        }
        else if (fileContent[index] === '}') {
            braceCount--;
            if (braceCount === 0) {
                return index + 1;
            }
        }
        index++;
    }
    return -1; // Method end not found
}
function checkTestMethods(testFilePath, methods, testedMethods) {
    var testFileContent = fs.readFileSync(testFilePath, 'utf-8');
    methods.forEach(function (method) {
        if (!testedMethods.includes(method.name)) {
            //console.log(`Missing unit test for method '${method.name}' in: ${testFilePath}`);
            //console.log(`Provide me unit test for below content: ${method.content}`);
            missingUnitTestCount++;
            missingUnitTests.push("Provide me unit test for below content: ".concat(method.content));
        }
    });
}
// Run analysis on the entire Angular project
var projectRoot = path.resolve(__dirname, 'src/app'); // Change to your actual project structure
analyzeAndCheckTests(projectRoot);
var combinedMissingUnitTests = missingUnitTests.join('\n');
console.log(JSON.stringify({
    combinedMissingUnitTests: combinedMissingUnitTests,
    totalMethods: totalMethods,
    missingUnitTestCount: missingUnitTestCount
}));
