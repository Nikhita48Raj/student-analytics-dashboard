const run = async () => {
  const req = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Meera', password: 'password' })
  });
  console.log(await req.json());
}
run();
