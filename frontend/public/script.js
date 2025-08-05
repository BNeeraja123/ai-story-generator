document.getElementById('generateBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  const storyDiv = document.getElementById('story');

  if (!prompt) {
    storyDiv.textContent = '⚠️ Please enter a prompt.';
    return;
  }

  storyDiv.textContent = '⏳ Generating story...';

  try {
    const res = await fetch('http://localhost:3000/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    if (res.ok && data.story) {
      storyDiv.textContent = data.story;
    } else {
      storyDiv.textContent = '❌ ' + (data.error || 'No story received.');
    }

  } catch (err) {
    console.error(err);
    storyDiv.textContent = '❌ Something went wrong. Check console.';
  }
});
