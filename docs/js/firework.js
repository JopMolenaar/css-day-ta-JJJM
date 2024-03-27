function initFireworks() {

	const year2024 = document.getElementById('2024');
	const fireworks = document.querySelector('.fireworks');
	const amountFireworks = 5;

	for (let i = amountFireworks - 1; i >= 0; i--) {
		const newFirework = document.createElement('ul');
		newFirework.classList.add('firework');
		for (let j = 32 - 1; j >= 0; j--) {
			const newFireworkItem = document.createElement('li');
			newFirework.appendChild(newFireworkItem);
		}
		fireworks.appendChild(newFirework);
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				fireworks.classList.add('show');
			} else {
				fireworks.classList.remove('show');
			}
		})
	},{
		threshold: .2
	});

	observer.observe(year2024);
}