const form = document.querySelector('#feedback-form');
const statusText = document.querySelector('#form-status');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  if (name.length < 2) return showStatus('Please enter a name with at least 2 letters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStatus('Please enter a valid email.');
  if (message.length < 10) return showStatus('Please write at least 10 characters.');
  showStatus('Sending...');
  try {
    const response = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    form.reset();
    showStatus('Thank you! Your feedback was saved.');
  } catch (error) { showStatus(error.message || 'Could not send feedback. Please try again.'); }
});
function showStatus(message) { statusText.textContent = message; }
