let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
    const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/categories?count=${NUM_CATEGORIES}`);
    return res.data.map(category => category.id);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
    const categoryData = res.data;

    // Format clues to include showing: null
    const clues = categoryData.clues.slice(0, NUM_QUESTIONS_PER_CAT).map(clue => ({
        question: clue.question,
        answer: clue.answer,
        showing: null,
    }));

    return { title: categoryData.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
    const $table = $("#jeopardy");
    $table.empty();

    // Add header row
    const $thead = $("<thead>");
    const $headerRow = $("<tr>");
    for (let category of categories) {
        $headerRow.append($("<th>").text(category.title));
    }
    $thead.append($headerRow);
    $table.append($thead);

    // Add question rows
    const $tbody = $("<tbody>");
    for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
        const $row = $("<tr>");
        for (let category of categories) {
            const $cell = $("<td>")
                .addClass("clue")
                .attr("data-cat", category.title)
                .attr("data-clue", i)
                .text("?"); // Initially show "?"
            $row.append($cell);
        }
        $tbody.append($row);
    }
    $table.append($tbody);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
    const $cell = $(evt.target);
    const catIndex = $cell.parent().children().index($cell);
    const clueIndex = $cell.closest("tr").index();

    const clue = categories[catIndex].clues[clueIndex];

    if (clue.showing === null) {
        $cell.text(clue.question);
        clue.showing = "question";
    } else if (clue.showing === "question") {
        $cell.text(clue.answer);
        clue.showing = "answer";
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
    const $table = $("#jeopardy");
    $table.empty();
    $("#spinner").show();
    $("#start").text("Loading...");
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
    $("#spinner").hide();
    $("#start").text("Restart Game");
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 */
async function setupAndStart() {
    showLoadingView();

    // Get category IDs
    const categoryIds = await getCategoryIds();

    // Get data for each category and populate categories array
    categories = [];
    for (let catId of categoryIds) {
        categories.push(await getCategory(catId));
    }

    // Populate table and hide loading spinner
    await fillTable();
    hideLoadingView();
}

/** On click of start / restart button, set up game. */
$("#start").on("click", setupAndStart);

/** On page load, add event handler for clicking clues */
$(document).on("click", ".clue", handleClick);
