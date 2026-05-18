import { z } from 'zod'

// ─── Goal validation ──────────────────────────────────────────────────────────
export const goalSchema = z.object({
  thrust_area: z.string().min(1, 'Thrust area is required'),
  title: z.string().min(3, 'Goal title must be at least 3 characters'),
  description: z.string().optional().default(''),
  uom_type: z.enum(['numeric_min', 'numeric_max', 'timeline', 'zero']),
  target_value: z.number().nullable(),
  target_date: z.string().nullable(),
  weightage: z.number().min(10, 'Minimum weightage is 10%').max(100),
  is_shared: z.boolean().optional().default(false),
  is_readonly: z.boolean().optional().default(false),
}).refine(data => {
  if (data.uom_type === 'timeline' && !data.target_date) {
    return false
  }
  return true
}, { message: 'Deadline date required for Timeline goals', path: ['target_date'] })
.refine(data => {
  if (['numeric_min', 'numeric_max', 'zero'].includes(data.uom_type) && data.target_value == null) {
    return false
  }
  return true
}, { message: 'Target value required', path: ['target_value'] })

// ─── Goal sheet submission validation ─────────────────────────────────────────
export const goalSheetSubmitSchema = z.object({
  goals: z.array(goalSchema)
    .min(1, 'Add at least one goal')
    .max(8, 'Maximum 8 goals per sheet (RULE-V3)')
}).refine(data => {
  const total = data.goals.reduce((sum, g) => sum + g.weightage, 0)
  return Math.abs(total - 100) < 0.01
}, { message: 'Total weightage must equal exactly 100%' })

// ─── Achievement validation ───────────────────────────────────────────────────
export const achievementSchema = z.object({
  goal_id: z.string().uuid(),
  quarter: z.enum(['q1', 'q2', 'q3', 'q4']),
  actual_value: z.number().nullable(),
  actual_date: z.string().nullable(),
  status: z.enum(['not_started', 'on_track', 'completed']),
})

// ─── Check-in comment validation ──────────────────────────────────────────────
export const checkinCommentSchema = z.object({
  sheet_id: z.string().uuid(),
  quarter: z.string(),
  comment_text: z.string().min(1, 'Comment cannot be empty'),
})

// ─── Manager return validation ────────────────────────────────────────────────
export const returnSheetSchema = z.object({
  comment: z.string().min(1, 'A comment is required when returning a sheet'),
})

// ─── Admin unlock validation ──────────────────────────────────────────────────
export const unlockSheetSchema = z.object({
  reason: z.string().min(1, 'A reason is required for unlocking'),
})

// ─── Progress score computation ───────────────────────────────────────────────
export function computeProgressScore(
  uomType: string,
  targetValue: number | null,
  targetDate: string | null,
  actualValue: number | null,
  actualDate: string | null
): number | null {
  switch (uomType) {
    case 'numeric_min':
      if (!targetValue || actualValue == null) return null
      return Math.min((actualValue / targetValue) * 100, 100)

    case 'numeric_max':
      if (!targetValue || actualValue == null) return null
      if (actualValue === 0) return 100
      return Math.min((targetValue / actualValue) * 100, 100)

    case 'timeline':
      if (!targetDate || !actualDate) return null
      return new Date(actualDate) <= new Date(targetDate) ? 100 : 0

    case 'zero':
      if (actualValue == null) return null
      return actualValue === 0 ? 100 : 0

    default:
      return null
  }
}
