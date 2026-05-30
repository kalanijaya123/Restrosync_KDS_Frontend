import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react'
import type { Order } from '../types/order'

type VoiceAction = 'preparing' | 'served'

type VoiceAssistantPanelProps = {
    orders: Order[]
    onUpdateStatus: (orderId: string, status: VoiceAction) => Promise<void> | void
}

declare global {
    interface Window {
        SpeechRecognition?: any
        webkitSpeechRecognition?: any
    }
}

const VoiceAssistantPanel = ({ orders, onUpdateStatus }: VoiceAssistantPanelProps) => {
    const [supported, setSupported] = useState(true)
    const [listening, setListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const recognitionRef = useRef<any>(null)
    const listeningRef = useRef(false)
    const ordersRef = useRef<Order[]>(orders)
    const updateStatusRef = useRef(onUpdateStatus)

    useEffect(() => {
        ordersRef.current = orders
    }, [orders])

    useEffect(() => {
        updateStatusRef.current = onUpdateStatus
    }, [onUpdateStatus])

    const speak = (message: string) => {
        if (!('speechSynthesis' in window)) return

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.rate = 1
        utterance.pitch = 1
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
    }

    const setAndSpeakStatus = (message: string) => {
        setStatusMessage(message)
        speak(message)
    }

    const findOrders = (orderNumbers: number[]) => {
        const availableOrders = ordersRef.current
        return orderNumbers
            .map((number) => availableOrders.find((order) => Number(order.orderNo) === number || Number(order.id) === number))
            .filter((order): order is Order => Boolean(order))
    }

    const parseCommand = (command: string) => {
        const normalized = command.toLowerCase().replace(/[^a-z0-9, ]+/g, ' ')
        const orderNumbers = Array.from(normalized.matchAll(/\b\d+\b/g), (match) => Number(match[0]))
        const isStart = /\b(start|started|prepare|prep|cook|begin)\b/.test(normalized)
        const isServe = /\b(serve|served|send|done|finish|complete)\b/.test(normalized)

        if (isStart) {
            return { action: 'preparing' as const, orderNumbers }
        }

        if (isServe) {
            return { action: 'served' as const, orderNumbers }
        }

        return { action: null, orderNumbers }
    }

    const executeCommand = async (command: string) => {
        const { action, orderNumbers } = parseCommand(command)

        if (!action) {
            setAndSpeakStatus('Say an order number followed by start or serve.')
            return
        }

        const selectedOrders = orderNumbers.length > 0
            ? findOrders(orderNumbers)
            : []

        if (selectedOrders.length === 0) {
            setAndSpeakStatus('I could not find any matching orders.')
            return
        }

        const allowedOrders = selectedOrders.filter((order) => {
            if (action === 'preparing') return order.status === 'pending'
            if (action === 'served') return order.status === 'ready'
            return false
        })

        if (allowedOrders.length === 0) {
            const nextState = action === 'preparing' ? 'pending' : 'ready'
            setAndSpeakStatus(`Selected orders must be in ${nextState} status first.`)
            return
        }

        for (const order of allowedOrders) {
            await Promise.resolve(updateStatusRef.current(order.id, action))
        }

        const orderList = allowedOrders.map((order) => `#${order.orderNo}`).join(', ')
        if (action === 'preparing') {
            setAndSpeakStatus(`Started ${orderList}.`)
        } else {
            setAndSpeakStatus(`Served ${orderList}. POS has been notified.`)
        }
    }

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            setSupported(false)
            setStatusMessage('Voice control is not supported in this browser.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.continuous = true
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
            const lastResult = event.results[event.results.length - 1]
            const command = String(lastResult?.[0]?.transcript ?? '').trim()
            if (!command) return

            setTranscript(command)
            void executeCommand(command)
        }

        recognition.onerror = (event: any) => {
            setListening(false)
            listeningRef.current = false
            setStatusMessage(`Voice error: ${event?.error || 'unknown error'}`)
        }

        recognition.onend = () => {
            if (listeningRef.current) {
                try {
                    recognition.start()
                    return
                } catch {
                    // ignore restart failures
                }
            }

            setListening(false)
        }

        recognitionRef.current = recognition

        return () => {
            listeningRef.current = false
            try {
                recognition.stop()
            } catch {
                // ignore cleanup failures
            }
            recognitionRef.current = null
        }
    }, [])

    const toggleListening = () => {
        const recognition = recognitionRef.current

        if (!recognition) return

        if (listeningRef.current) {
            listeningRef.current = false
            setListening(false)
            setStatusMessage('Voice assistant stopped.')
            try {
                recognition.stop()
            } catch {
                // ignore stop failures
            }
            return
        }

        try {
            listeningRef.current = true
            setListening(true)
            setStatusMessage('Listening for order commands...')
            recognition.start()
        } catch {
            listeningRef.current = false
            setListening(false)
            setStatusMessage('Could not start voice assistant.')
        }
    }

    return (
        <div className="rounded-3xl border-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 shadow-xl p-6 mb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${listening ? 'bg-emerald-500' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
                        {listening ? <Mic className="w-7 h-7 text-white" /> : <MicOff className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Voice Assistant</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                            Say things like <span className="font-semibold">order 1 start</span>, <span className="font-semibold">orders 2 3 serve</span>, or <span className="font-semibold">order 4 start</span>.
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <Volume2 className="w-4 h-4" />
                            <span>{supported ? 'Speech recognition is ready.' : 'Voice recognition is unavailable in this browser.'}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={toggleListening}
                    disabled={!supported}
                    className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 font-bold transition-all ${supported
                        ? listening
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-gray-900 hover:bg-black text-white dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <span>{listening ? 'Stop Listening' : 'Start Voice Control'}</span>
                </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold mb-2">Last Command</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white min-h-6">{transcript || 'Waiting for speech...'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold mb-2">Status</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white min-h-6">{statusMessage || 'Ready.'}</p>
                </div>
            </div>

            {!supported && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3 text-amber-700 dark:text-amber-300 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>This feature needs a Chromium browser with Web Speech API support.</span>
                </div>
            )}
        </div>
    )
}

export default VoiceAssistantPanel