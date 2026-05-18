async function run() {
  const payload = {
    employee_id: '00000000-0000-0000-0000-000000000001',
    goals: [
      { area: "Revenue", title: "Test Goal", uom: "numeric_min", tv: 100, td: null, w: 100 }
    ]
  }

  console.log("Sending payload:", payload)
  try {
    const res = await fetch('http://localhost:3000/api/goals/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const json = await res.json()
    console.log("Response:", res.status, json)
  } catch(e) {
    console.log("Fetch failed:", e.message)
  }
}
run()
