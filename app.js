document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('click', () => {
    const action = card.querySelector('.card-action');
    if (action) action.click();
  });
});
