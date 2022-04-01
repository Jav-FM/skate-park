const app = document.getElementById(app);
const pintarDatos = (users) => {
  users.forEach((user) => {
      users.forEach(user => n{
          app.innerHTML += <
      })
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  try {
    const res = await fetch('/api/v1/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();

    console.log(data);
    if (!data.ok) {
    }
  } catch (e) {
    console.log(e);
  }
});
