interface Writeup {
	id: string;
	title: string;
	description: string;
	tags: string[];
}

// AUTO-GENERATED-WRITEUPS-START
const writeups: Writeup[] = [
  {
    "id": "input",
    "title": "Penetration Testing Writeup: Cross-Site Scripting (XSS) Vulnerability",
    "description": "During a recent penetration test conducted on [Target Application], a critical Cross-Site Scripting (XSS) vulnerability was identified in the application's user input handling mechanism. This vulnerability allows an attacker to inject malicious scripts into web pages viewed by other users, potentially leading to session hijacking, data theft, or defacement of the website.",
    "tags": []
  },
  {
    "id": "xss_writeup_1",
    "title": "Penetration Testing Writeup: Stored Cross-Site Scripting (XSS) Vulnerability",
    "description": "During a penetration test on [Target Application], a critical Stored Cross-Site Scripting (XSS) vulnerability was discovered in the application's comment system. This flaw allows attackers to inject malicious scripts that execute in the browsers of all users viewing the affected page, potentially leading to account takeover, data theft, or website defacement.",
    "tags": [
      "xss",
      "js"
    ]
  },
  {
    "id": "xss_writeup_10",
    "title": "Penetration Testing Writeup: XSS in Admin Panel",
    "description": "A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s admin panel during a penetration test. This allows attackers to inject scripts into admin inputs, affecting admin users.",
    "tags": [
      "php",
      "web"
    ]
  },
  {
    "id": "xss_writeup_2",
    "title": "Penetration Testing Writeup: DOM-Based XSS Vulnerability",
    "description": "A DOM-Based Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s client-side JavaScript code during a recent penetration test. This vulnerability allows attackers to manipulate the DOM to execute malicious scripts, potentially compromising user sessions or stealing sensitive data.",
    "tags": [
      "sqli",
      "mysql"
    ]
  }
];
// AUTO-GENERATED-WRITEUPS-END

document.addEventListener('DOMContentLoaded', function () {
	const writeupsList = document.getElementById('writeupsList');
	const searchInput = document.getElementById(
		'search-input',
	) as HTMLInputElement | null;
	const tagsContainer = document.getElementById('tags-container');
	const resultsCount = document.getElementById('results-count');
	const prevPageBtn = document.getElementById(
		'prevPage',
	) as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById(
		'nextPage',
	) as HTMLButtonElement | null;
	const currentPageEl = document.getElementById('currentPage');
	const dateDropdown = document.getElementById(
		'sortDate',
	) as HTMLSelectElement | null;

	if (!writeupsList) {
		console.error('Writeups list element not found');
		return;
	}
	if (!tagsContainer) {
		console.error('Tags container not found');
		return;
	}

	const tagButtons =
		tagsContainer.querySelectorAll<HTMLButtonElement>('button');
	// Pagination setup
	let currentPage = 1;
	const itemsPerPage = 6;
	let filteredWriteups = [...writeups];
	const selectedTags = new Set<string>();

	// Core render
	function renderWriteups() {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const toRender = filteredWriteups.slice(start, end);

		if (!writeupsList) return;
		writeupsList.innerHTML = toRender
			.map((writeup) => {
				const tagsHtml = (writeup.tags ?? [])
					.map((t) => `<span class="tag small" data-tag="${t}">${t}</span>`)
					.join('');

				return `
      <div class="writeup-card" data-id="${writeup.id}">
        <h2 class="writeup-title cyber-text">${writeup.title}</h2>
        <p class="writeup-description">${writeup.description}</p>

        <a href="writeups/${writeup.id}.html" class="writeup-link cyber-link">READ_WRITEUP</a>
        ${tagsHtml ? `<div class="writeup-tags mt-4">${tagsHtml}</div>` : ''}
      </div>
    `;
			})
			.join('');

		const pageCount = Math.ceil(filteredWriteups.length / itemsPerPage);
		if (currentPageEl) currentPageEl.textContent = currentPage.toString();
		if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
		if (nextPageBtn)
			nextPageBtn.disabled = currentPage === pageCount || pageCount === 0;
		if (resultsCount)
			resultsCount.textContent = `${toRender.length} of ${filteredWriteups.length} WRITEUPS DISPLAYED`;
	}

	// Apply filtering from search or category
	function applyFilters() {
		console.log('Applying...');
		const searchTerm = searchInput?.value.toLowerCase() || '';
		filteredWriteups = writeups.filter((w) => {
			const title = w.title.toLowerCase();
			const desc = w.description.toLowerCase();

			const matchesSearch =
				title.includes(searchTerm) ||
				desc.includes(searchTerm) ||
				w.tags.some((t) => t.toLowerCase().includes(searchTerm));

			const matchesSelectedTags =
				selectedTags.size === 0 ||
				Array.from(selectedTags).every((t) => w.tags.includes(t));

			return matchesSearch && matchesSelectedTags;
		});

		currentPage = 1;
		renderWriteups();
	}

	// Event listeners for pagination & search
	searchInput?.addEventListener('input', applyFilters);
	tagButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const tag = btn.dataset['tag'];
			if (!tag || tag === 'all') return;

			if (selectedTags.has(tag)) {
				selectedTags.delete(tag);
				btn.classList.remove('active');
			} else {
				selectedTags.add(tag);
				btn.classList.add('active');
			}

			applyFilters();
		});
	});
	nextPageBtn?.addEventListener('click', () => {
		const max = Math.ceil(filteredWriteups.length / itemsPerPage);
		if (currentPage < max) {
			currentPage++;
			renderWriteups();
		}
	});

	// Sorting dropdown
	dateDropdown?.addEventListener('change', () => {
		const order = dateDropdown.value;
		filteredWriteups.sort((a, b) =>
			order === 'newest'
				? b.title.localeCompare(a.title)
				: a.title.localeCompare(b.title),
		);
		renderWriteups();
	});

	// Initial render
	renderWriteups();
});
