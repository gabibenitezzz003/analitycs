"use server"

import { getDrillDownDetails } from "@/lib/queries"

export async function fetchDrillDown(type: 'date' | 'intention', value: string) {
  return await getDrillDownDetails(type, value)
}
