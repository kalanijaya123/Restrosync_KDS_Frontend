import React from 'react'
import { KDS_CONFIG } from '../kdsConfig'

interface Props {
    createdAt: string
}

export const OrderTimer: React.FC<Props> = ({ createdAt }) => {
    const [now, setNow] = React.useState(Date.now())
    React.useEffect(() => {
        const i = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(i)
    }, [])

    const elapsed = now - new Date(createdAt).getTime()
    const minutes = Math.floor(elapsed / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)
    const isWarning = elapsed > KDS_CONFIG.warningTime

    return (
        <div className={`text-lg font-bold ${isWarning ? 'text-red-400' : 'text-gray-300'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
    )
}