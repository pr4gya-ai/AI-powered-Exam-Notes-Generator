import React, { useEffect, useState } from 'react'
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
  PieChart,
  Pie,
  Legend
} from "recharts"

function RechartSetUp({ charts }) {
  if (!charts || charts.length === 0) return null;

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];
  const supportedTypes = ["bar", "line", "pie"];
  const safeType = (type) => {
    const t = (type || "").toString().toLowerCase();
    return supportedTypes.includes(t) ? t : "bar";
  };

  const [activeTypes, setActiveTypes] = useState(charts.map((chart) => safeType(chart.type)));

  useEffect(() => {
    setActiveTypes(charts.map((chart) => safeType(chart.type)));
  }, [charts]);

  const setChartType = (idx, selectedType) => {
    setActiveTypes((prev) => {
      const copy = [...prev];
      copy[idx] = selectedType;
      return copy;
    });
  };

  return (
    <div className='space-y-8'>
      {charts.map((chart, index) => (
        <div key={index} className='border border-gray-200 rounded-xl p-4 bg-white shadow-sm'>
          
          <h4 className='font-semibold text-gray-800 mb-3'>
            📊 {chart.title}
          </h4>

          <div className='mb-3 flex items-center gap-2 text-xs'>
            <span className='font-medium text-gray-600'>Chart type:</span>
            {supportedTypes.map((type) => (
              <button
                key={type}
                onClick={() => setChartType(index, type)}
                className={`rounded px-2 py-1 border text-xs ${activeTypes[index] === type ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className='h-72 min-h-[250px] w-full'>
            <ResponsiveContainer width="100%" height={250} minHeight={250}>
              {/* Pie Chart */}
              {activeTypes[index] === "pie" && chart.data && chart.data.length > 0 && (
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
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
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              )}

              {/* Bar Chart */}
              {activeTypes[index] === "bar" && chart.data && chart.data.length > 0 && (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chart.data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {/* Line Chart */}
              {activeTypes[index] === "line" && chart.data && chart.data.length > 0 && (
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

              {!chart.data || chart.data.length === 0 ? (
                <div className='text-center text-gray-500'>No chart data available.</div>
              ) : null}

            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RechartSetUp