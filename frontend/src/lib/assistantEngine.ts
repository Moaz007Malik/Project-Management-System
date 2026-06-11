import { api } from '@/lib/api'
import { processChatMessage, type ChatContext } from '@/lib/chatbotEngine'

export interface AssistantReply {
  text: string
  table?: Record<string, unknown>[]
  source?: string
  actions?: string[]
  context?: ChatContext
}

const PCP_KEYWORDS = /pcp|cost center|revision|vacant|electrician|welder|approv|headcount|personnel|recruitment|shift|charging|ruwais|demob/i

export function isPcpContext(pathname: string, message?: string): boolean {
  if (pathname.startsWith('/pcp')) return true
  if (message && PCP_KEYWORDS.test(message)) return true
  return false
}

export function getAssistantWelcome(pathname: string): string {
  if (pathname.startsWith('/pcp')) {
    return 'Hi! I\'m **Descon Chatbot**. Ask about PCPs, positions, budgets, approvals, and forecasts.'
  }
  return 'Hi! I\'m **Descon Chatbot**. Ask about projects, PCPs, budgets, or team skills.'
}

export function getAssistantSuggestions(pathname: string): string[] {
  if (pathname.startsWith('/pcp')) {
    return [
      'Which cost centers are over budget this quarter?',
      'Compare Rev. 0 and Rev. 1 of PCP-2026-00041',
      'Show all vacant electrician positions on Project A',
      'Summarize PCP activity this month',
    ]
  }
  return [
    'Show employees with React and TypeScript',
    'Which cost centers are over budget this quarter?',
    'Give me details',
  ]
}

export async function processAssistantMessage(
  message: string,
  options: {
    pathname: string
    pcpRole: string
    businessUnit: string
    userId?: string
    context: ChatContext
  }
): Promise<AssistantReply> {
  const { pathname, pcpRole, businessUnit, userId, context } = options

  if (isPcpContext(pathname, message)) {
    const res = await api.post<{
      text?: string
      table?: Record<string, unknown>[]
      source?: string
      actions?: string[]
    }>('/pcp/assistant', { message, role: pcpRole, businessUnit, userId })

    return {
      text: String(res.text || ''),
      table: res.table,
      source: res.source,
      actions: res.actions,
      context,
    }
  }

  const { reply, context: nextContext } = await processChatMessage(message, context)
  return { text: reply, context: nextContext }
}
