/**
 * Creates a pagination control dynamically.
 *
 * @param {string} containerSelector - The CSS selector for the pagination container element.
 * @param {string} defaultParam - The default query parameter key to be used if the page key is not found in the URL.
 */
function createPagination(containerSelector, defaultParam) {
	const maxVisiblePages = 3;
	const prevButton = document.querySelector('.w-pagination-previous');
	const nextButton = document.querySelector('.w-pagination-next');

	// Use nextButton as the default control button
	const controlButton = nextButton || prevButton;

	if (!controlButton) return; // Early exit if no control button is found

	controlButton.classList.add('pagination-button');

	const allQuery = controlButton.href.split('?')[1];
	const hrefUrlParams = new URLSearchParams(allQuery);
	const pageKey =
		Array.from(hrefUrlParams.entries()).find(([key]) =>
			key.includes('page'),
		)?.[0] || defaultParam;

	const totalPageCount =
		parseInt(
			document
				.querySelector('.w-page-count')
				.textContent.split('/')[1]
				.trim(),
		) || 0;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const currentPage = parseInt(urlParams.get(pageKey)) || 1;

	const paginationContainer = document.querySelector(containerSelector);
	paginationContainer.classList.add('pagination-wrapper');
	paginationContainer.innerHTML = '';

	const emptyElips = document.createElement('div');
	emptyElips.textContent = '...';
	emptyElips.className = 'empty-elips';

	const addButton = (text, page) => {
		const button = document.createElement('a');
		button.href = `?${pageKey}=${page}`;
		button.textContent = text;
		button.className = 'pagination-button';
		if (page === currentPage) button.classList.add('active');
		paginationContainer.appendChild(button);
	};

	// Always add the first page button
	addButton('1', 1);

	// Add ellipsis if currentPage is far enough from the first visible page
	if (currentPage > maxVisiblePages + 1) {
		paginationContainer.appendChild(emptyElips.cloneNode(true));
	}

	// Calculate the range for visible pages between the first and last
	const startPage = Math.max(2, currentPage - 2);
	const endPage = Math.min(totalPageCount - 1, currentPage + 2);

	for (let i = startPage; i <= endPage; i++) {
		addButton(i, i);
	}

	// Add ellipsis if there are hidden pages between the last visible and the last page
	if (endPage < totalPageCount - 1) {
		paginationContainer.appendChild(emptyElips.cloneNode(true));
	}

	// Always add the last page button
	if (totalPageCount > 1) {
		addButton(totalPageCount.toString(), totalPageCount);
	}
}

// example use
// createPagination() function take two arg parent class and fallback default param
// to work this we have to enable pagination from webflow collection
{
	/* 
    <script defer src="https://cdn.jsdelivr.net/gh/SoftwareIK/webflow-custom-js@pagination-ik/pagination-logic/pagination.js"></script>
    <script>
		document.addEventListener('DOMContentLoaded', () => createPagination('.pagination-container', 'test'));
    </script> 
*/
}
