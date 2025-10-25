
// @ts-nocheck
import React, { useEffect, useRef } from 'react';

interface FeedbackDoughnutChartProps {
    score: number;
    color: string;
    trackColor: string;
}

const FeedbackDoughnutChart: React.FC<FeedbackDoughnutChartProps> = ({ score, color, trackColor }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new window.Chart(canvasRef.current, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [color, trackColor],
                    borderWidth: 0,
                    cutout: '70%',
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: { animateRotate: true },
            },
            plugins: [{
                id: 'doughnutText',
                afterDraw(chart) {
                    const { ctx, width, height } = chart;
                    ctx.restore();
                    const fontSize = (height / 40).toFixed(2);
                    ctx.font = `bold ${fontSize}px Inter`;
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = chart.data.datasets[0].backgroundColor[0];
                    const text = `${chart.data.datasets[0].data[0]}%`;
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                },
            }],
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [score, color, trackColor]);

    return <canvas ref={canvasRef} />;
};

export default FeedbackDoughnutChart;
