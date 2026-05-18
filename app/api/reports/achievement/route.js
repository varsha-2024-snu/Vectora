import { NextResponse } from 'next/server'
import Papa from 'papaparse'

export async function GET(request) {
  try {
    // For now, we use dummy data to demonstrate the CSV export.
    // When Supabase is wired up, this will be a joined query across:
    // users, goal_sheets, goals, achievements
    
    const data = [
      {
        Employee: 'Arjun Sharma',
        Department: 'Sales',
        Goal: 'Annual Sales Revenue',
        UOM: 'Numeric ↑',
        Target: '10,000,000',
        Weightage: '30%',
        Q1_Actual: '7,500,000',
        Q1_Score: '75%',
        Q2_Actual: '',
        Q2_Score: '',
        Q3_Actual: '',
        Q3_Score: '',
        Q4_Actual: '',
        Q4_Score: '',
      },
      {
        Employee: 'Arjun Sharma',
        Department: 'Sales',
        Goal: 'Customer TAT Reduction',
        UOM: 'Numeric ↓',
        Target: '48',
        Weightage: '25%',
        Q1_Actual: '36',
        Q1_Score: '100%',
        Q2_Actual: '',
        Q2_Score: '',
        Q3_Actual: '',
        Q3_Score: '',
        Q4_Actual: '',
        Q4_Score: '',
      },
      {
        Employee: 'Priya Nair',
        Department: 'Sales',
        Goal: 'Sales Pipeline Growth',
        UOM: 'Numeric ↑',
        Target: '5,000,000',
        Weightage: '35%',
        Q1_Actual: '',
        Q1_Score: '',
        Q2_Actual: '',
        Q2_Score: '',
        Q3_Actual: '',
        Q3_Score: '',
        Q4_Actual: '',
        Q4_Score: '',
      }
    ]

    const csv = Papa.unparse(data)

    const headers = new Headers({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="achievement_report.csv"',
    })

    return new NextResponse(csv, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
