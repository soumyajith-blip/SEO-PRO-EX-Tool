const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const outputSection = document.getElementById('outputSection');

const tagsResult = document.getElementById('tagsResult');
const hashtagsResult = document.getElementById('hashtagsResult');
const descriptionResult = document.getElementById('descriptionResult');

const copyTagsBtn = document.getElementById('copyTagsBtn');
const copyHashtagsBtn = document.getElementById('copyHashtagsBtn');
const copyDescBtn = document.getElementById('copyDescBtn');
const messageBox = document.getElementById('messageBox');

generateBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const keywords = document.getElementById('keywords').value.trim();
  const platform = document.getElementById('platform').value;

  if (!title || !keywords) {
    showMessage("Please fill in both the Video Title and Topic fields.", "error");
    return;
  }

  btnText.classList.add('hidden');
  loadingSpinner.classList.remove('hidden');
  generateBtn.disabled = true;
  outputSection.classList.add('hidden');

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, keywords, platform })
    });

    if (!response.ok) throw new Error("API request failed");

    const result = await response.json();
    tagsResult.textContent = result.tags || "";
    hashtagsResult.textContent = result.hashtags || "";
    descriptionResult.innerHTML = (result.description || "").replace(/\n/g, "<br>");
    outputSection.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    showMessage("Failed to generate content.", "error");
  } finally {
    btnText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
    generateBtn.disabled = false;
  }
});

function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = "Copied!";
    setTimeout(() => (buttonElement.textContent = originalText), 2000);
  }).catch(() => showMessage("Failed to copy text.", "error"));
}

copyTagsBtn.addEventListener('click', () => copyToClipboard(tagsResult.textContent, copyTagsBtn));
copyHashtagsBtn.addEventListener('click', () => copyToClipboard(hashtagsResult.textContent, copyHashtagsBtn));
copyDescBtn.addEventListener('click', () => copyToClipboard(descriptionResult.innerText, copyDescBtn));

function showMessage(message, type = 'info') {
  messageBox.textContent = message;
  messageBox.className = `fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg fade-in ${
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  messageBox.classList.remove('hidden');
  setTimeout(() => messageBox.classList.add('hidden'), 3000);
}