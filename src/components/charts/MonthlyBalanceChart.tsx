import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

interface MonthlyBalanceChartProps {
    data: { day: number; balance: number }[]
    isPositive: boolean
}

export function MonthlyBalanceChart({ data, isPositive }: MonthlyBalanceChartProps) {
    if (!data || data.length === 0) return null

    const color = isPositive ? '#10b981' : '#ef4444' // Emerald-500 or Red-500

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="day"
                        hide
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        hide
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            borderColor: '#27272a',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: color }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Saldo']}
                    />
                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
