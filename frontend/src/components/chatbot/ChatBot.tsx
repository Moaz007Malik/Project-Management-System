import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useLocation } from 'react-router-dom'
import { X, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHATBOT_NAME } from '@/lib/chatbotEngine'
import { useAppStore } from '@/stores/useAppStore'
import { useAssistantStore } from '@/stores/useAssistantStore'
import { useChatBotStore } from '@/stores/useChatBotStore'
import { AssistantPanel } from './AssistantPanel'

export function ChatBot() {
  const location = useLocation()
  const [groqEnabled, setGroqEnabled] = useState(false)
  const { open, pendingQuery, openChat, closeChat, clearPendingQuery } = useChatBotStore()
  const { pcpRole, businessUnit, currentUserId, systemRole } = useAppStore()
  const send = useAssistantStore((s) => s.send)

  useEffect(() => {
    api.get<{ enabled?: boolean }>('/chat/status', { skipAuth: true })
      .then((s) => setGroqEnabled(Boolean(s.enabled)))
      .catch(() => setGroqEnabled(false))
  }, [])

  useEffect(() => {
    if (!open || !pendingQuery) return
    const query = pendingQuery
    clearPendingQuery()
    void send(query, location.pathname, pcpRole || 'Requester', businessUnit, currentUserId, systemRole)
  }, [
    open,
    pendingQuery,
    clearPendingQuery,
    send,
    location.pathname,
    pcpRole,
    businessUnit,
    currentUserId,
    systemRole,
  ])

  return (
    <>
      {!open && (
        <Button
          onClick={() => openChat()}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-xl hover:bg-primary/90"
          size="icon"
          aria-label={`Open ${CHATBOT_NAME}`}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[min(560px,calc(100vh-3rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{CHATBOT_NAME}</p>
                <p className="text-[10px] text-muted-foreground">
                  {groqEnabled ? 'Powered by Groq · project data & hiring' : 'Projects, PCP, budgets & skills'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <AssistantPanel />
          </div>
        </div>
      )}
    </>
  )
}
