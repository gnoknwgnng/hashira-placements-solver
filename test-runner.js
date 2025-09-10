const fs = require('fs');

// Function to convert a number from any base to decimal
function baseToDecimal(value, base) {
    let result = 0;
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    
    for (let i = 0; i < value.length; i++) {
        const digit = digits.indexOf(value[i].toLowerCase());
        if (digit === -1 || digit >= base) {
            throw new Error(`Invalid digit '${value[i]}' for base ${base}`);
        }
        result = result * base + digit;
    }
    
    return result;
}

// Lagrange interpolation to find the constant term
function lagrangeInterpolation(points, k) {
    let constant = 0;
    
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        
        // Calculate Lagrange basis polynomial L_i(0)
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= (0 - xj) / (xi - xj);
            }
        }
        
        constant += yi * li;
    }
    
    return Math.round(constant);
}

// Function to solve from JSON file or object
function solveFromInput(input) {
    let testCase;
    
    if (typeof input === 'string') {
        // If input is a file path
        try {
            const data = fs.readFileSync(input, 'utf8');
            testCase = JSON.parse(data);
        } catch (error) {
            console.error(`Error reading file ${input}:`, error.message);
            return null;
        }
    } else {
        // If input is already an object
        testCase = input;
    }
    
    const n = testCase.keys.n;
    const k = testCase.keys.k;
    
    console.log(`Processing: n=${n}, k=${k}`);
    
    // Extract and convert all points
    const points = [];
    
    for (let i = 1; i <= n; i++) {
        if (testCase[i.toString()]) {
            const base = parseInt(testCase[i.toString()].base);
            const value = testCase[i.toString()].value;
            
            try {
                const y = baseToDecimal(value, base);
                points.push({ x: i, y: y });
                console.log(`Root ${i}: (${i}, ${y}) [base ${base}: "${value}"]`);
            } catch (error) {
                console.error(`Error converting root ${i}:`, error.message);
                return null;
            }
        }
    }
    
    if (points.length < k) {
        console.error(`Not enough valid points. Need ${k}, got ${points.length}`);
        return null;
    }
    
    // Use first k points for interpolation
    const selectedPoints = points.slice(0, k);
    console.log(`Using first ${k} points for interpolation`);
    
    // Find the constant term
    const constant = lagrangeInterpolation(selectedPoints, k);
    
    return constant;
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        // If file path provided as argument
        const result = solveFromInput(args[0]);
        if (result !== null) {
            console.log(`\nSecret (constant term): ${result}`);
        }
    } else {
        // Run built-in test cases
        console.log("Running built-in test cases...\n");
        
        // Test case 1
        const testCase1 = {
            "keys": { "n": 4, "k": 3 },
            "1": { "base": "10", "value": "4" },
            "2": { "base": "2", "value": "111" },
            "3": { "base": "10", "value": "12" },
            "6": { "base": "4", "value": "213" }
        };
        
        console.log("=== Test Case 1 ===");
        const result1 = solveFromInput(testCase1);
        console.log(`Secret: ${result1}\n`);
        
        // Test case 2
        const testCase2 = {
            "keys": { "n": 10, "k": 7 },
            "1": { "base": "6", "value": "13444211440455345511" },
            "2": { "base": "15", "value": "aed7015a346d635" },
            "3": { "base": "15", "value": "6aeeb69631c227c" },
            "4": { "base": "16", "value": "e1b5e05623d881f" },
            "5": { "base": "8", "value": "316034514573652620673" },
            "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
            "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
            "8": { "base": "6", "value": "20220554335330240002224253" },
            "9": { "base": "12", "value": "45153788322a1255483" },
            "10": { "base": "7", "value": "1101613130313526312514143" }
        };
        
        console.log("=== Test Case 2 ===");
        const result2 = solveFromInput(testCase2);
        console.log(`Secret: ${result2}\n`);
        
        console.log("=== Summary ===");
        console.log(`Test Case 1 Result: ${result1}`);
        console.log(`Test Case 2 Result: ${result2}`);
    }
}

main();