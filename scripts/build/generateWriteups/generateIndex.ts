import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Writeup {
	id: string;
	title: string;
	description: string;
}

// Configuration
const writeupsJsonPath = join(process.cwd(), 'out', 'writeups.json');
const outputPath = join(process.cwd(), 'public', 'writeups.html');
const templatePath = join(process.cwd(), 'src', 'html', 'template.html');

export async function generateWriteupsIndex() {
	try {
		// Check if writeups.json exists
		if (!existsSync(writeupsJsonPath)) {
			console.error(`❌ writeups.json not found at: ${writeupsJsonPath}`);
			process.exit(1);
		}

		// Read and parse writeups data
		const writeupsData = readFileSync(writeupsJsonPath, 'utf8');
		const writeups: Writeup[] = JSON.parse(writeupsData);

		console.log(`📊 Found ${writeups.length} writeups to process`);

		// Read the template file
		let template = '';
		if (existsSync(templatePath)) {
			template = readFileSync(templatePath, 'utf8');
		} else {
			console.error(`❌ Template file not found at: ${templatePath}`);
			process.exit(1);
		}

		// Generate writeup cards HTML
		const writeupsHtml = writeups
			.map(
				(writeup) => `
      <div class="writeup-card" data-id="${writeup.id}">
        <h2 class="writeup-title cyber-text">${writeup.title}</h2>
        <p class="writeup-description">${writeup.description}</p>
        <a href="/writeups/${writeup.id}.html" class="writeup-link cyber-link">READ_WRITEUP</a>
      </div>
    `,
			)
			.join('');

		// Generate pagination HTML
		const itemsPerPage = 6;
		const pageCount = Math.ceil(writeups.length / itemsPerPage);
		let paginationHtml = '';

		if (pageCount > 1) {
			paginationHtml = `<div class="pagination-controls">
            <button type="button" id="prevPage" class="pagination-btn cyber-button">PREV</button>
            <span class="page-info cyber-text">PAGE <span id="currentPage">1</span> / ${pageCount}</span>
            <button type="button" id="nextPage" class="pagination-btn cyber-button">NEXT</button>
        </div>`;
		}

		// JavaScript for search and pagination
		const script = `
      document.addEventListener('DOMContentLoaded', function() {
        const writeups = ${JSON.stringify(writeups)};
        const writeupsList = document.getElementById('writeupsList');
        const searchInput = document.getElementById('searchInput');
        const resultsCount = document.getElementById('resultsCount');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const currentPageEl = document.getElementById('currentPage');
        
        let currentPage = 1;
        const itemsPerPage = 6;
        let filteredWriteups = [...writeups];
        
        // Render writeups based on current page and filter
        function renderWriteups() {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const writeupsToRender = filteredWriteups.slice(startIndex, endIndex);
          
          writeupsList.innerHTML = writeupsToRender.map(writeup => \`
            <div class="writeup-card" data-id="\${writeup.id}">
              <h2 class="writeup-title cyber-text">\${writeup.title}</h2>
              <p class="writeup-description">\${writeup.description}</p>
              <a href="/writeups/\${writeup.id}.html" class="writeup-link cyber-link">READ_WRITEUP</a>
            </div>
          \`).join('');
          
          // Update pagination controls
          const pageCount = Math.ceil(filteredWriteups.length / itemsPerPage);
          if (currentPageEl) {
            currentPageEl.textContent = currentPage;
          }
          
          if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
          }
          
          if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === pageCount || pageCount === 0;
          }
          
          // Update results count
          if (resultsCount) {
            resultsCount.textContent = \`\${writeupsToRender.length} of \${filteredWriteups.length} WRITEUPS DISPLAYED\`;
          }
        }
        
        // Filter writeups based on search input
        function filterWriteups() {
          const searchTerm = searchInput.value.toLowerCase();
          
          if (searchTerm.trim() === '') {
            filteredWriteups = [...writeups];
          } else {
            filteredWriteups = writeups.filter(writeup => 
              writeup.title.toLowerCase().includes(searchTerm) || 
              writeup.description.toLowerCase().includes(searchTerm)
            );
          }
          
          currentPage = 1; // Reset to first page when filtering
          renderWriteups();
        }
        
        // Event listeners
        if (searchInput) {
          searchInput.addEventListener('input', filterWriteups);
        }
        
        if (prevPageBtn) {
          prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
              currentPage--;
              renderWriteups();
            }
          });
        }
        
        if (nextPageBtn) {
          nextPageBtn.addEventListener('click', () => {
            const pageCount = Math.ceil(filteredWriteups.length / itemsPerPage);
            if (currentPage < pageCount) {
              currentPage++;
              renderWriteups();
            }
          });
        }
        
        // Initial render
        renderWriteups();
      });
    `;

		// Create the main content for the writeups index
		const mainContent = `
      <div class="writeups-container">
        <h1 class="cyber-text glitch-effect text-center" data-text="PENETRATION_TESTING_WRITEUPS">
          PENETRATION_TESTING_WRITEUPS
        </h1>
        
        <div class="search-container">
          <input type="text" id="search-input" placeholder="SEARCH_WRITEUPS...">
          <span id="results-count"></span>
        </div>
        
        <div id="writeupsList" class="writeups-grid">
          ${writeupsHtml}
        </div>
        
        <div class="pagination">
          ${paginationHtml}
        </div>
      </div>
    `;

		// Add the additional styles to the template
		const templateWithStyles = template.replace(
			'</head>',
			`  <link rel="stylesheet" href="../assets/css/writeupIndex.css" /></head>`,
		);

		// Replace the content placeholder with our writeups index
		const finalHtml = templateWithStyles
			.replace('${content}', mainContent)
			.replace('</body>', `<script>${script}</script></body>`);

		// Write the final HTML to file
		writeFileSync(outputPath, finalHtml);
		console.log(`✅ Writeups index generated at: ${outputPath}`);
	} catch (error) {
		console.error('❌ Error generating writeups index:', error);
		process.exit(1);
	}
}
