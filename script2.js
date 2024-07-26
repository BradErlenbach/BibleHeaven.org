const bibleContainer = document.getElementById("bibleContainer");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const bookSelector = document.getElementById("bookSelector");
const chapterButtonsContainer = document.getElementById("chapterButtons");
let currentBook = '';
let currentChapter = 1;
const apiUrl = 'https://bible-api.com/';

// Array of books with their maximum chapter count
const books = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
];

// Function to populate the book selector options
function populateBookSelector() {
  // Add the "OLD TESTAMENT" title before Genesis
  const oldTestamentTitleOption = document.createElement('option');
  oldTestamentTitleOption.disabled = true;
  oldTestamentTitleOption.textContent = 'OLD TESTAMENT';
  oldTestamentTitleOption.style.fontWeight = 'bold';
  oldTestamentTitleOption.style.color = 'darkgoldenrod';
  bookSelector.appendChild(oldTestamentTitleOption);
  oldTestamentTitleOption.classList.add('special-option');

  for (const book of books) {
    const option = document.createElement('option');
    option.value = book.name;
    option.textContent = book.name;

    if (book.name === "Matthew") {
      // Add the "NEW TESTAMENT" title before Matthew
      const newTestamentTitleOption = document.createElement('option');
      newTestamentTitleOption.disabled = true;
      newTestamentTitleOption.textContent = 'NEW TESTAMENT';
      newTestamentTitleOption.style.fontWeight = 'bold';
      newTestamentTitleOption.style.color = 'darkgoldenrod';
      bookSelector.appendChild(newTestamentTitleOption);
    }

    bookSelector.appendChild(option);
  }
}

// Function to populate the chapter buttons based on the current book
function populateChapterButtons(bookName) {
  const currentBookIndex = books.findIndex(book => book.name === bookName);
  const currentMaxChapter = books[currentBookIndex].chapters;

  chapterButtonsContainer.innerHTML = '';

  for (let i = 1; i <= currentMaxChapter; i++) {
    const button = document.createElement('button');
    button.classList.add('button', 'chapter-button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentChapter = i;
      fetchChapter(currentBook, currentChapter);
    });

    chapterButtonsContainer.appendChild(button);
  }
}

// Function to fetch Bible verses for a specific book and chapter
function fetchChapter(book, chapter) {
  const chapterUrl = `${apiUrl}${book}+${chapter}`;

  fetch(chapterUrl)
    .then(response => response.json())
    .then(data => {
      bibleContainer.innerHTML = '';

      for (const verse of data.verses) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        const bookTitle = document.createElement('h2');
        bookTitle.classList.add('book-title');
        bookTitle.textContent = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
        bookElement.appendChild(bookTitle);

        const verseElement = document.createElement('p');
        verseElement.classList.add('verse');
        verseElement.textContent = verse.text;
        bookElement.appendChild(verseElement);

        bibleContainer.appendChild(bookElement);
      }

      const listenToChapterButton = document.getElementById("listenToChapterButton");
      listenToChapterButton.addEventListener("click", () => {
        readChapterAloud(data.verses);
      });

      updateNavigationButtons(data);
      addListenButtonFunctionality(data);
    })
    .catch(error => console.error(error));
}

function readChapterAloud(verses) {
  // Check if ResponsiveVoice is available
  if ('responsiveVoice' in window) {
    // Choose a voice and language (e.g., US English female voice)
    const voiceName = 'US English Female';
    const voiceLang = 'en-US';

    // Set the voice and language
    responsiveVoice.setDefaultVoice(voiceName, { lang: voiceLang });

    // Read each verse one by one with a slight delay
    let delay = 0;
    for (const verse of verses) {
      setTimeout(() => {
        responsiveVoice.speak(`${verse.book_name} ${verse.chapter}:${verse.verse}. ${verse.text}`, voiceName);
      }, delay);
      delay += 1500; // Adjust the delay (in milliseconds) between verses as needed
    }
  } else {
    // Fallback for devices/browsers without TTS support
    alert("Text-to-Speech is not available on this device/browser.");
  }
}



// Function to update the navigation buttons based on the current chapter
function updateNavigationButtons(data) {
  const currentBookIndex = books.findIndex(book => book.name === data.book_name);
  const currentMaxChapter = books[currentBookIndex].chapters;

  prevButton.disabled = currentChapter === 1;
  prevButton.classList.toggle('disabled', currentChapter === 1);
  nextButton.disabled = currentChapter === currentMaxChapter;
  nextButton.classList.toggle('disabled', currentChapter === currentMaxChapter);
}

// Event listener for book selector change
bookSelector.addEventListener('change', () => {
  currentBook = bookSelector.value;
  populateChapterButtons(currentBook);
  currentChapter = 1;
  fetchChapter(currentBook, currentChapter);
});

// Event listener for previous button click
prevButton.addEventListener('click', () => {
  if (currentChapter > 1) {
    currentChapter--;
    fetchChapter(currentBook, currentChapter);
  }
});

// Event listener for next button click
nextButton.addEventListener('click', () => {
  const currentBookIndex = books.findIndex(book => book.name === currentBook);
  const currentMaxChapter = books[currentBookIndex].chapters;

  if (currentChapter < currentMaxChapter) {
    currentChapter++;
    fetchChapter(currentBook, currentChapter);
  }
});

// Fetch the initial chapter and populate the book selector
populateBookSelector();
currentBook = books[0].name;
populateChapterButtons(currentBook);
fetchChapter(currentBook, currentChapter);

// Function to trigger text-to-speech
function speak(text) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US'; // Set the language for the speech (you can change it to other languages if needed)
    speech.volume = 1; // Set the volume (0 to 1)
    speech.rate = 1; // Set the rate of speech (0.1 to 10)
    speech.pitch = 1; // Set the pitch of speech (0 to 2)
    window.speechSynthesis.speak(speech);
  } else {
    alert('Text-to-speech is not supported in this browser.');
  }
}