const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

function search(str) {
	str = str.toLowerCase();
	let results = [];

	for (let item of fruit) {
		if (item.toLowerCase().includes(str)) {
			results.push(item);
		}
	}

	return results;
}

function searchHandler(e) {
	const inputValue = e.target.value;
	const results = search(inputValue);

	if (inputValue.trim() === '') {
		suggestions.innerHTML = '';
		return;
	}

	showSuggestions(results, inputValue);
}

function showSuggestions(results, inputVal) {
	suggestions.innerHTML = '';

	for (let result of results) {
		if (result.toLowerCase().includes(inputVal.toLowerCase())) {
			const li = document.createElement('li');
			li.innerText = result;
			suggestions.appendChild(li);
		}
	}
}

function useSuggestion(e) {
	const selectedSuggestion = e.target.innerText;
	input.value = selectedSuggestion;
	suggestions.innerHTML = '';
}

input.addEventListener('keyup', searchHandler);
suggestions.addEventListener('click', useSuggestion);