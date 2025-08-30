import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { inputDir, textOutput } from './config';

// For Bun, we can use the built-in HTML parser instead of JSDOM
function htmlToText(html: string): string {
	// Simple HTML to text conversion - removes tags and decodes entities
	return html
		.replace(/<[^>]*>/g, ' ') // Remove HTML tags
		.replace(/\s+/g, ' ') // Collapse multiple spaces
		.replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
		.replace(/&amp;/g, '&') // Decode common entities
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.trim();
}

export const extractText = async () => {
	// Create output directory if it doesn't exist
	if (!fs.existsSync(textOutput)) {
		fs.mkdirSync(textOutput, { recursive: true });
	}

	// Get all .md files in the input directory
	const files = fs.readdirSync(inputDir).filter((file) => file.endsWith('.md'));

	if (files.length === 0) {
		console.log('No .md files found in', inputDir);
		process.exit(0);
	}

	console.log(`Found ${files.length} .md files to process...`);

	// Process each file
	files.forEach(async (file) => {
		try {
			const inputPath = path.join(inputDir, file);
			const outputFileName = path.basename(file, '.md') + '.txt';
			const outputPath = path.join(textOutput, outputFileName);

			// Read and convert the markdown file
			const mdContent = fs.readFileSync(inputPath, 'utf8');
			const html = await marked.parse(mdContent);
			const plainText = htmlToText(html);

			// Write the output file
			fs.writeFileSync(outputPath, plainText);
			console.log(`✓ Converted: ${file} -> ${outputFileName}`);
		} catch (error: any) {
			console.error(`✗ Error processing ${file}:`, error.message);
		}
	});

	console.log('Conversion completed!');
};
