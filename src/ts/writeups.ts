interface Writeup {
	id: string;
	title: string;
	description: string;
}

// AUTO-GENERATED-WRITEUPS-START
const writeups: Writeup[] = [
	{
		id: 'input',
		title:
			'Penetration Testing Writeup: Cross-Site Scripting (XSS) Vulnerability',
		description:
			"During a recent penetration test conducted on [Target Application], a critical Cross-Site Scripting (XSS) vulnerability was identified in the application's user input handling mechanism. This vulnerability allows an attacker to inject malicious scripts into web pages viewed by other users, potentially leading to session hijacking, data theft, or defacement of the website.",
	},
	{
		id: 'xss_writeup_1',
		title:
			'Penetration Testing Writeup: Stored Cross-Site Scripting (XSS) Vulnerability',
		description:
			"During a penetration test on [Target Application], a critical Stored Cross-Site Scripting (XSS) vulnerability was discovered in the application's comment system. This flaw allows attackers to inject malicious scripts that execute in the browsers of all users viewing the affected page, potentially leading to account takeover, data theft, or website defacement.",
	},
	{
		id: 'xss_writeup_10',
		title: 'Penetration Testing Writeup: XSS in Admin Panel',
		description:
			'A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s admin panel during a penetration test. This allows attackers to inject scripts into admin inputs, affecting admin users.',
	},
	{
		id: 'xss_writeup_2',
		title: 'Penetration Testing Writeup: DOM-Based XSS Vulnerability',
		description:
			'A DOM-Based Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s client-side JavaScript code during a recent penetration test. This vulnerability allows attackers to manipulate the DOM to execute malicious scripts, potentially compromising user sessions or stealing sensitive data.',
	},
	{
		id: 'xss_writeup_3',
		title: 'Penetration Testing Writeup: Reflected XSS in Form Input',
		description:
			'A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s form submission process during a penetration test. This vulnerability allows attackers to inject malicious scripts via form inputs, which are reflected in the response, compromising user security.',
	},
	{
		id: 'xss_writeup_4',
		title: 'Penetration Testing Writeup: XSS in URL Parameter',
		description:
			'A penetration test on [Target Application] revealed a Reflected Cross-Site Scripting (XSS) vulnerability in a URL parameter. This flaw allows attackers to inject scripts that execute in users’ browsers, posing risks like session hijacking and data theft.',
	},
	{
		id: 'xss_writeup_5',
		title: 'Penetration Testing Writeup: XSS in User Profile',
		description:
			'A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s user profile editing feature during a penetration test. This flaw allows attackers to inject scripts that execute for users viewing the profile, risking data theft and account compromise.',
	},
	{
		id: 'xss_writeup_6',
		title: 'Penetration Testing Writeup: XSS in Search Autocomplete',
		description:
			'A Reflected Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s search autocomplete feature during a penetration test. This allows attackers to inject scripts via the autocomplete query, compromising user security.',
	},
	{
		id: 'xss_writeup_7',
		title: 'Penetration Testing Writeup: XSS in Chat Feature',
		description:
			'A Stored Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s chat feature during a penetration test. This flaw allows attackers to inject scripts into chat messages, affecting all users in the chat.',
	},
	{
		id: 'xss_writeup_8',
		title: 'Penetration Testing Writeup: XSS in File Upload',
		description:
			'A Stored Cross-Site Scripting (XSS) vulnerability was found in [Target Application]’s file upload feature, allowing attackers to embed scripts in uploaded file metadata. This report details the vulnerability and remediation steps.',
	},
	{
		id: 'xss_writeup_9',
		title: 'Penetration Testing Writeup: XSS in Feedback Form',
		description:
			'A Reflected Cross-Site Scripting (XSS) vulnerability was identified in [Target Application]’s feedback form during a penetration test. This allows attackers to inject scripts that execute in the response, risking user security.',
	},
];
// AUTO-GENERATED-WRITEUPS-END

// Rest of your existing writeups.ts code goes here
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

	// Check if essential elements exist
	if (!writeupsList) {
		console.error('Writeups list element not found');
		return;
	}

	let currentPage = 1;
	const itemsPerPage = 6;
	let filteredWriteups = [...writeups];

	// Render writeups based on current page and filter
	function renderWriteups() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const writeupsToRender = filteredWriteups.slice(startIndex, endIndex);

		if (!writeupsList) return;

		writeupsList.innerHTML = writeupsToRender
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

		// Update pagination controls
		const pageCount = Math.ceil(filteredWriteups.length / itemsPerPage);

		if (currentPageEl) {
			currentPageEl.textContent = currentPage.toString();
		}

		if (prevPageBtn) {
			prevPageBtn.disabled = currentPage === 1;
		}

		if (nextPageBtn) {
			nextPageBtn.disabled = currentPage === pageCount || pageCount === 0;
		}

		// Update results count
		if (resultsCount) {
			resultsCount.textContent = `${writeupsToRender.length} of ${filteredWriteups.length} WRITEUPS DISPLAYED`;
		}
	}

	// Filter writeups based on search input
	function filterWriteups() {
		if (!searchInput) return;

		const searchTerm = searchInput.value.toLowerCase();

		if (searchTerm.trim() === '') {
			filteredWriteups = [...writeups];
		} else {
			filteredWriteups = writeups.filter(
				(writeup) =>
					writeup.title.toLowerCase().includes(searchTerm) ||
					writeup.description.toLowerCase().includes(searchTerm),
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
