"use strict";
// import * as fs from 'fs';
// import * as path from 'path';
Object.defineProperty(exports, "__esModule", { value: true });
// function analyzeAndCheckTests(directory: string) {
//   const files = fs.readdirSync(directory);
//   files.forEach((file) => {
//     const filePath = path.join(directory, file);
//     if (fs.statSync(filePath).isDirectory()) {
//       analyzeAndCheckTests(filePath);
//     } else {
//       analyzeAndCheckTestForFile(filePath);
//     }
//   });
// }
// function analyzeAndCheckTestForFile(filePath: string) { 
//   if (filePath.endsWith('.component.ts') && !filePath.endsWith('.spec.ts')) {
//     const testFilePath = filePath.replace('.ts', '.spec.ts');
//     if (!fs.existsSync(testFilePath)) {
//       console.log(`Missing unit test for: ${filePath}`);
//     } else {
//       const fileContent = fs.readFileSync(filePath, 'utf-8');
//       const methods = extractMethods(fileContent);
//       if (methods.length > 0) {
//         checkTestMethods(testFilePath, methods);
//       }
//     }
//   }
// }
// function extractMethods(fileContent: string): string[] {
//   const methodRegex = /(?:public|private|protected)?\s+(\w+)\s*\([^)]*\)\s*{/g;
//   const matches = fileContent.matchAll(methodRegex);
//   return Array.from(matches, (match) => match[1]);
// }
// function checkTestMethods(testFilePath: string, methods: string[]) {
//   const testFileContent = fs.readFileSync(testFilePath, 'utf-8');
//   methods.forEach((method) => {
//     //const testMethodName = `should ${method}`;
//     const testMethodName =  `component.${method}()`
//     if (!testFileContent.includes(testMethodName)) {
//       console.log(`Missing unit test for method '${method}' in: ${testFilePath}`);
//     }
//   });
// }
// // Run analysis on the entire Angular project
// const projectRoot = path.resolve(__dirname, 'src/app'); // Change to your actual project structure
// analyzeAndCheckTests(projectRoot);
var fs = require("fs");
var path = require("path");
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
        }
        else {
            var fileContent = fs.readFileSync(filePath, 'utf-8');
            var methods = extractMethods(fileContent);
            if (methods.length > 0) {
                checkTestMethods(testFilePath, methods);
            }
        }
    }
}
function extractMethods(fileContent) {
    // Modified regex to handle arrow functions with explicit return types
    var methodRegex = /(?:public|private|protected)?\s+(\w+)\s*=\s*\(.*\)\s*:\s*\w+\s*=>\s*{/g;
    var matches = fileContent.matchAll(methodRegex);
    return Array.from(matches, function (match) { return match[1]; });
}
function checkTestMethods(testFilePath, methods) {
    var testFileContent = fs.readFileSync(testFilePath, 'utf-8');
    methods.forEach(function (method) {
        var testMethodName = "component.".concat(method, "()");
        if (!testFileContent.includes(testMethodName)) {
            console.log("Missing unit test for method '".concat(method, "' in: ").concat(testFilePath));
        }
    });
}
// Run analysis on the entire Angular project
var projectRoot = path.resolve(__dirname, 'src/app'); // Change to your actual project structure
analyzeAndCheckTests(projectRoot);
