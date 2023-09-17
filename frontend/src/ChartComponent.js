import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, LineController, CategoryScale, LinearScale, Title, Tooltip, PointElement, LineElement } from 'chart.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ChartComponent = () => {
  // Fetching metrics
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:5500/data') 
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const chartRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const chartInstanceRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Processing data
    const chartsData = [
      { label: 'PERFORMANCE', dataKey: 'performance' },
      { label: 'SEO', dataKey: 'seo' },
      { label: 'ACCESSIBILITY', dataKey: 'accessibility' },
      { label: 'BEST PRACTICES', dataKey: 'best_pr' },
      { label: 'PROGRESSIVE WEB APP', dataKey: 'pwa' },
    ];

    chartsData.forEach((chartData, index) => {
      const dateValues = [];
      const values = [];

      data.forEach((item) => {
        dateValues.push(item.date);
        values.push(item[chartData.dataKey]);
      });

      // Destroy the existing chart instance if it exists
      if (chartInstanceRefs[index].current) {
        chartInstanceRefs[index].current.destroy();
      }

      const ctx = chartRefs[index].current.getContext('2d');

      Chart.register(LineController, CategoryScale, LinearScale, Title, Tooltip, PointElement, LineElement);

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dateValues,
          datasets: [
            {
              fill: false,
              tension: 0,
              backgroundColor: 'rgba(0,0,255,1.0)',
              borderColor: 'rgba(87,190,255,0.1)',
              pointBackgroundColor: '#57b8ff',
              data: values,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: chartData.label,
              color: "#ddd",
            },
          },
          scales: {
            x: {
              type: 'category',
            },
            y: {
              min: 10,
              max: 100,
            },
          },
        },
      });

      // Store the chart instance in the ref
      chartInstanceRefs[index].current = newChartInstance;
    });
    // eslint-disable-next-line
  }, [data]);

  return (
    <div>
      <Container>
        <Row>
            {chartRefs.map((chartRef, index) => (
                <Col lg={6}>
                    <div key={index} className="mb-5 rounded-3" style={{background: "#101935", padding: "10px"}}>
                    <canvas style={{maxHeight: '400px', maxWidth: '100%' }} ref={chartRef}></canvas>
                    </div>
                </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default ChartComponent;
