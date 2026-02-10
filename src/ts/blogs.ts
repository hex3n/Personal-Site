interface Blog {
	id: string;
	title: string;
	description: string;
	tags: string[];
}

// AUTO-GENERATED-BLOGS-START
const blogs: Blog[] = [
  {
    "id": "first_blog",
    "title": "Building This Portfolio Site",
    "description": "This blog post explains how the build pipeline turns markdown into static HTML pages. It mirrors the writeup system and is used as a sample blog entry.",
    "tags": [
      "web"
    ]
  }
];
// AUTO-GENERATED-BLOGS-END

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
		console.error('Blogs list element not found');
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
	let filteredWriteups = [...blogs];
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

        <a href="blogs/${writeup.id}.html" class="writeup-link cyber-link">READ_BLOG</a>
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
			resultsCount.textContent = `${toRender.length} of ${filteredWriteups.length} BLOGS DISPLAYED`;
	}

	// Apply filtering from search or category
	function applyFilters() {
		console.log('Applying...');
		const searchTerm = searchInput?.value.toLowerCase() || '';
		filteredWriteups = blogs.filter((w) => {
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
