// Frame-busting clickjacking guard. GitHub Pages can't send an
// X-Frame-Options header, and `frame-ancestors` inside a <meta> CSP is ignored
// by the spec, so break out of any cross-origin frame here (menu.js loads on
// every page). If reading top.location throws (cross-origin), hide the page.
if (window.self !== window.top) {
	try {
		window.top!.location.replace(window.self.location.href);
	} catch {
		document.documentElement.style.display = 'none';
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const mobileMenuButton = document.getElementById('mobile-menu-button');
	const mobileMenu = document.getElementById('mobile-menu');
	const menuIcon = document.getElementById('menu-icon');
	const closeIcon = document.getElementById('close-icon');

	// Exit early if any required elements are missing
	if (!mobileMenuButton || !mobileMenu || !menuIcon || !closeIcon) {
		console.error('Required menu elements not found in DOM');
		return;
	}

	let menuOpen = false;

	mobileMenuButton.addEventListener('click', function () {
		menuOpen = !menuOpen;

		if (menuOpen) {
			// Open menu
			mobileMenu.classList.remove('scale-y-0', 'opacity-0', 'max-h-0');
			mobileMenu.classList.add('scale-y-100', 'opacity-100', 'max-h-64');
			menuIcon.classList.add('hidden');
			closeIcon.classList.remove('hidden');
		} else {
			// Close menu
			mobileMenu.classList.remove('scale-y-100', 'opacity-100', 'max-h-64');
			mobileMenu.classList.add('scale-y-0', 'opacity-0', 'max-h-0');
			menuIcon.classList.remove('hidden');
			closeIcon.classList.add('hidden');
		}
	});

	// Close menu when clicking on a link
	const mobileLinks = document.querySelectorAll('.nav-link-mobile');
	mobileLinks.forEach((link) => {
		link.addEventListener('click', function () {
			mobileMenu.classList.remove('scale-y-100', 'opacity-100', 'max-h-64');
			mobileMenu.classList.add('scale-y-0', 'opacity-0', 'max-h-0');
			menuIcon.classList.remove('hidden');
			closeIcon.classList.add('hidden');
			menuOpen = false;
		});
	});
});
