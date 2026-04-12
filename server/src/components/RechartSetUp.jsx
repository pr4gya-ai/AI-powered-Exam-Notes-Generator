import React from 'react'
import { 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Bar, 
  Cell, 
  LineChart, 
  Line, 
  PieChart, // Added
  Pie,      // Added
  Legend    // Added for better UX
} from "recharts"

function RechartSetUp({ charts }) {
  if (!charts || charts.length === 0) return null;

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <div className='space-y-8'>
      {charts.map((chart, index) => (
        <div key={index} className='border border-gray-200 rounded-xl p-4 bg-white shadow-sm'>
          
          <h4 className='font-semibold text-gray-800 mb-3'>
            📊 {chart.title}
          </h4>

          <div className='h-72 min-h-[250px] w-full'>
            <ResponsiveContainer width="100%" height={250} minHeight={250}>
              
              {/* Pie Chart Case */}
              {chart.type === "pie" && (
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Creates the Donut effect
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {chart.data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              )}

              {/* Bar Chart Case */}
              {chart.type === "bar" && (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chart.data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {/* Line Chart Case */}
              {chart.type === "line" && (
                <LineChart data={chart.data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              )}

            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RechartSetUp