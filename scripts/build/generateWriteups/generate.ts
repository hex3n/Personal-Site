import { readdirSync, readFileSync, writeFile, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { marked } from 'marked';
import { inputDir, writeupsDir } from './config';

export const generate = async () => {
	// Input and output directories

	const templatePath = './src/html/template.html';

	mkdirSync(writeupsDir, { recursive: true });

	const template = readFileSync(templatePath, 'utf8');

	const files = readdirSync(inputDir).filter((file) => extname(file) === '.md');

	if (files.length === 0) {
		console.log('No Markdown files found in', inputDir);
		process.exit(0);
	}

	files.forEach(async (file) => {
		const inputPath = join(inputDir, file);
		const outputPath = join(writeupsDir, basename(file, '.md') + '.html');

		const mdContent = readFileSync(inputPath, 'utf8');
		const htmlContent = await marked.parse(mdContent);

		// Replace placeholder in template with HTML content
		const finalHtml = template.replace('${content}', htmlContent);

		writeFile(outputPath, finalHtml, () => {
			console.log(`✅ Converted ${file} → ${outputPath}`);
		});
	});
};
