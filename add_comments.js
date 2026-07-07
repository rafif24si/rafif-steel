const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already commented by me manually
        if (content.includes('KOMENTAR DEMO:') && content.includes('Mengambil') && !content.includes('File ini adalah komponen')) {
            // Already heavily commented manually, but let's check if we want to add a general top-level comment anyway.
            // Let's just add it if the general one doesn't exist.
        }

        if (!content.includes('File ini adalah komponen')) {
            const fileName = path.basename(filePath, '.jsx');
            
            const commentBlock = `
// ==========================================
// KOMENTAR DEMO:
// File ini adalah komponen ${fileName}.
// Berfungsi untuk mengatur tata letak antarmuka (UI) dan logika dasar yang berkaitan dengan data ${fileName}.
// ==========================================
`;

            // Try to insert after imports, before the main component
            let lines = content.split('\n');
            let insertIndex = 0;
            
            // find last import
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    insertIndex = i + 1;
                }
            }
            
            lines.splice(insertIndex, 0, commentBlock);
            
            fs.writeFileSync(filePath, lines.join('\n'));
            console.log(`Added comment to ${filePath}`);
        }
    }
});
console.log("Selesai menambahkan komentar ke seluruh file .jsx");
