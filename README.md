# Hashira Placements Assignment - Polynomial Solver

This solution implements Shamir's Secret Sharing polynomial interpolation to find the constant term (secret) from given roots in different number bases.

## Problem Overview

Given roots of a polynomial in various number bases, the program:
1. Converts roots from different bases to decimal
2. Uses Lagrange interpolation to reconstruct the polynomial
3. Finds the constant term (the secret)

## Files

- `test-runner.js` - Main solution that accepts JSON file input
- `polynomial-solver.js` - Alternative so
