const employee_id = "e0000000-0000-0000-0000-000000000001"; // Need to get a valid employee ID
fetch('http://localhost:3001/api/goals/sheet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: "some_id",
    goals: []
  })
}).then(r => r.json()).then(console.log);
