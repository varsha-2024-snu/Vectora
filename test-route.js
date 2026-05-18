import { POST } from './app/api/goals/sheet/route.js'

async function run() {
  const payload = {
    employee_id: '00000000-0000-0000-0000-000000000001',
    goals: [
      { area: "Revenue", title: "Test Goal", uom: "numeric_min", tv: 100, td: null, w: 100 }
    ]
  }

  const req = {
    json: async () => payload
  }

  console.log("Calling POST route...")
  try {
    const res = await POST(req)
    console.log("Status:", res.status)
    const data = await res.json()
    console.log("Response Data:", data)
  } catch (err) {
    console.error("Route Error:", err)
  }
}
run()
