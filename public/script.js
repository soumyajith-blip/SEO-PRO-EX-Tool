document.getElementById("generateBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const keywords = document.getElementById("keywords").value.trim();
  const platform = document.getElementById("platform").value;

  if (!title || !keywords) {
    showMessage("Please fill in both Title and Keywords.");
    return;
  }

  toggleLoading(true);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, keywords, platform })
    });

    if (!res.ok) throw new Error("API request failed.");

    const data = await res.json();

    document.getElementById("tagsResult").textContent = data.tags || "No tags generated.";
    document.getElementById("hashtagsResult").textContent = data.hashtags || "No hashtags generated.";
    document.getElementById("descriptionResult").textContent = data.description || "No description generated.";

    document.getElementById("outputSection").classList.remove("hidden");
  } catch (err) {
    showMessage("Error: " + err.message);
  } finally {
    toggleLoading(false);
  }
});

function toggleLoading(isLoading) {
  document.getElementById("btnText").classList.toggle("hidden", isLoading);
  document.getElementById("loadingSpinner").classList.toggle("hidden", !isLoading);
}

function showMessage(msg) {
  const box = document.getElementById("messageBox");
  box.textContent = msg;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 3000);
}
