const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  Delete out/ and .next/ folders?');
rl.question('Continue? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      if (fs.existsSync('out')) {
        fs.rmSync('out', { recursive: true, force: true });
      }
      if (fs.existsSync('.next')) {
        fs.rmSync('.next', { recursive: true, force: true });
      }
      console.log('✅ Cleaned!');
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  } else {
    console.log('❌ Cancelled');
  }
  rl.close();
});
