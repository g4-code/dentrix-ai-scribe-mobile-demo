// Console commands to check localStorage:

// 1. View the saved caption text
localStorage.getItem('clinical-caption-text')

// 2. Clear the saved text (for testing)
localStorage.removeItem('clinical-caption-text')

// 3. Check all localStorage keys
Object.keys(localStorage)

// 4. Pretty print the saved text
console.log(localStorage.getItem('clinical-caption-text'))
