import React from 'react';
import { Bar } from 'react-chartjs-2';

export function TasksPerLabelChart({ tasksPerLabelMap, labelsColors }) {
  const data = {
    labels: Object.keys(tasksPerLabelMap),
    datasets: [
      {
        label: '',
        data: Object.values(tasksPerLabelMap),
        backgroundColor: labelsColors,
        borderWidth: 2,
        hoverOffset: 2,
        fontColor: 'black',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          fontColor: 'black',
          // fontColor: '#f00'
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'black',
          // color: 'white'
        },
      },
      x: {
        ticks: {
          color: 'black',
          // color: 'white'
        },
      },
    },
  };

  return (
    <div className='bar-chart-container'>
      <h1>Tasks per Label</h1>
      <div className="video-ratio">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
