import { api } from '@/lib/api'
import { CHATBOT_NAME, processChatMessage, type ChatContext } from '@/lib/chatbotEngine'

export interface AssistantLink {
  platform: string
  url: string
  label: string
}

export interface AssistantReply {
  text: string
  table?: Record<string, unknown>[]
  source?: string
  actions?: string[]
  links?: AssistantLink[]
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
    return `Hi! I'm **${CHATBOT_NAME}**. Ask about PCPs, positions, budgets, approvals, and forecasts — powered by Groq when configured.`
  }
  return `Hi! I'm **${CHATBOT_NAME}**. Ask about your projects, team skills, budgets, or external hiring on Rozee/LinkedIn.`
}

export function getAssistantSuggestions(pathname: string): string[] {
  if (pathname.startsWith('/pcp')) {
    return [
      'Which cost centers are over budget this quarter?',
      'Summarize open PCPs in my business unit',
      'Show vacant electrician positions',
      'Compare revision history for latest PCP',
    ]
  }
  return [
    'Summarize all active projects and their budgets',
    'Show employees with React skills in our database',
    'Find React developers on Rozee or LinkedIn for a new project',
    'Which projects are over budget?',
  ]
}

interface ChatHistoryMessage {
  role: 'user' | 'bot'
  text: string
}

export async function processAssistantMessage(
  message: string,
  options: {
    pathname: string
    pcpRole: string
    businessUnit: string
    userId?: string
    systemRole?: string
    context: ChatContext
    history?: ChatHistoryMessage[]
  },
): Promise<AssistantReply> {
  const { pathname, pcpRole, businessUnit, userId, systemRole, context, history = [] } = options

  try {
    const res = await api.post<{
      text?: string
      table?: Record<string, unknown>[]
      source?: string
      actions?: string[]
      links?: AssistantLink[]
      code?: string
    }>('/chat', {
      message,
      history,
      pathname,
      pcpRole,
      businessUnit,
      userId,
      systemRole,
    })

    return {
      text: String(res.text || ''),
      table: res.table,
      source: res.source,
      actions: res.actions,
      links: res.links,
      context,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    const isAiMissing =
      msg.includes('GROQ_NOT_CONFIGURED')
      || msg.includes('Groq API is not configured')

    if (!isAiMissing) {
      throw err
    }
  }

  // Fallback when Groq is not configured
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
