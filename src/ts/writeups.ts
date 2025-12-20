interface Writeup {
	id: string;
	title: string;
	description: string;
	tag: string;
}

// AUTO-GENERATED-WRITEUPS-START
const writeups: Writeup[] = [
  {
    "id": "input",
    "title": "Penetration Testing Writeup: Cross-Site Scripting (XSS) Vulnerability",
    "description": "During a recent penetration test conducted on [Target Application], a critical Cross-Site Scripting (XSS) vulnerability was identified in the application's user input handling mechanism. This vulnerability allows an attacker to inject malicious scripts into web pages viewed by other users, potentially leading to session hijacking, data theft, or defacement of the website.",
    "tag": ""
  },
  {
    "id": "xss_writeup_7",
    "title": "Penetration Testing Writeup: XSS in Chat Feature",
    "description": "A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s chat feature during a penetration test. This flaw allows attackers to inject scripts into chat messages, affecting all users in the chat.",
    "tag": ""
  },
  {
    "id": "xss_writeup_4",
    "title": "Penetration Testing Writeup: XSS in URL Parameter",
    "description": "A penetration test on [Target Application] revealed a Reflected Cross-Site Scripting (XSS) vulnerability in a URL parameter. This flaw allows attackers to inject scripts that execute in users’ browsers, posing risks like session hijacking and data theft.",
    "tag": ""
  },
  {
    "id": "xss_writeup_9",
    "title": "Penetration Testing Writeup: XSS in Feedback Form",
    "description": "A Reflected Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s feedback form during a penetration test. This allows attackers to inject scripts that execute in the response, risking user security.",
    "tag": ""
  },
  {
    "id": "xss_writeup_3",
    "title": "Penetration Testing Writeup: Reflected XSS in Form Input",
    "description": "A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s form submission process during a penetration test. This vulnerability allows attackers to inject malicious scripts via form inputs, which are reflected in the response, compromising user security.",
    "tag": ""
  },
  {
    "id": "xss_writeup_5",
    "title": "Penetration Testing Writeup: XSS in User Profile",
    "description": "A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s user profile editing feature during a penetration test. This flaw allows attackers to inject scripts that execute for users viewing the profile, risking data theft and account compromise.",
    "tag": ""
  },
  {
    "id": "xss_writeup_8",
    "title": "Penetration Testing Writeup: XSS in File Upload",
    "description": "A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s file upload feature, allowing attackers to embed scripts in uploaded file metadata. This report details the vulnerability and remediation steps.",
    "tag": ""
  },
  {
    "id": "xss_writeup_2",
    "title": "Penetration Testing Writeup: DOM-Based XSS Vulnerability",
    "description": "A DOM-Based Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s client-side JavaScript code during a recent penetration test. This vulnerability allows attackers to manipulate the DOM to execute malicious scripts, potentially compromising user sessions or stealing sensitive data.",
    "tag": ""
  },
  {
    "id": "xss_writeup_10",
    "title": "Penetration Testing Writeup: XSS in Admin Panel",
    "description": "A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s admin panel during a penetration test. This allows attackers to inject scripts into admin inputs, affecting admin users.",
    "tag": ""
  },
  {
    "id": "xss_writeup_6",
    "title": "Penetration Testing Writeup: XSS in Search Autocomplete",
    "description": "A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s search autocomplete feature during a penetration test. This allows attackers to inject scripts via the autocomplete query, compromising user security.",
    "tag": ""
  },
  {
    "id": "xss_writeup_1",
    "title": "Penetration Testing Writeup: Stored Cross-Site Scripting (XSS) Vulnerability",
    "description": "During a penetration test on [Target Application], a critical Stored Cross-Site Scripting (XSS) vulnerability was discovered in the application's comment system. This flaw allows attackers to inject malicious scripts that execute in the browsers of all users viewing the affected page, potentially leading to account takeover, data theft, or website defacement.",
    "tag": ""
  }
];
// AUTO-GENERATED-WRITEUPS-END
document.addEventListener('DOMContentLoaded', function () {
	const writeupsList = document.getElementById('writeupsList');
	const searchInput = document.getElementById(
		'search-input',
	) as HTMLInputElement | null;
	const resultsCount = document.getElementById('results-count');
	const prevPageBtn = document.getElementById(
		'prevPage',
	) as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById(
		'nextPage',
	) as HTMLButtonElement | null;
	const currentPageEl = document.getElementById('currentPage');
	const categoryDropdown = document.getElementById(
		'sortCategory',
	) as HTMLSelectElement | null;
	const dateDropdown = document.getElementById(
		'sortDate',
	) as HTMLSelectElement | null;

	if (!writeupsList) {
		console.error('Writeups list element not found');
		return;
	}

	// Pagination setup
	let currentPage = 1;
	const itemsPerPage = 6;
	let filteredWriteups = [...writeups];

	// Core render
	function renderWriteups() {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const toRender = filteredWriteups.slice(start, end);

		if (!writeupsList) return;
		writeupsList.innerHTML = toRender
			.map(
				(writeup) => `
      <div class="writeup-card" data-id="${writeup.id}">
        <h2 class="writeup-title cyber-text">${writeup.title}</h2>
        <p class="writeup-description">${writeup.description}</p>
        <a href="writeups/${writeup.id}.html" class="writeup-link cyber-link">READ_WRITEUP</a>
      </div>
    `,
			)
			.join('');

		const pageCount = Math.ceil(filteredWriteups.length / itemsPerPage);
		if (currentPageEl) currentPageEl.textContent = currentPage.toString();
		if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
		if (nextPageBtn)
			nextPageBtn.disabled = currentPage === pageCount || pageCount === 0;
		if (resultsCount)
			resultsCount.textContent = `${toRender.length} of ${filteredWriteups.length} WRITEUPS DISPLAYED`;

		attachTagAndSortHandlers();
	}

	// Apply filtering from search or category
	function applyFilters() {
		console.log('Applying...');
		const searchTerm = searchInput?.value.toLowerCase() || '';
		const selectedCategory = categoryDropdown?.value.toLowerCase() || 'all';

		filteredWriteups = writeups.filter((w) => {
			const title = w.title.toLowerCase();
			const desc = w.description.toLowerCase();
			const matchesSearch =
				title.includes(searchTerm) || desc.includes(searchTerm);
			const matchesCategory =
				selectedCategory === 'all' ||
				title.includes(selectedCategory) ||
				desc.includes(selectedCategory);
			return matchesSearch && matchesCategory;
		});

		currentPage = 1;
		renderWriteups();
	}

	// Event listeners for pagination & search
	searchInput?.addEventListener('input', applyFilters);
	prevPageBtn?.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			renderWriteups();
		}
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

	function attachTagAndSortHandlers() {
		const tags = document.querySelectorAll('.tag');

		tags.forEach((tag) => {
			tag.addEventListener('click', () => {
				const selected =
					tag.getAttribute('data-tag')?.toLowerCase() ||
					tag.textContent?.toLowerCase().trim() ||
					'';
				console.log('Clicked tag:', selected);

				tags.forEach((t) => t.classList.remove('active'));
				tag.classList.add('active');

				if (categoryDropdown) categoryDropdown.value = selected || 'all';
				applyFilters();
			});
		});
	}

	// Initial render
	renderWriteups();
});
