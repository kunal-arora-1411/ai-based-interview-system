// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import type { Theme } from '../../types';

interface ScoreChartProps {
    theme: Theme;
    score: number;
    title?: string;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ theme, score, title = "Overall Score" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const style = getComputedStyle(document.documentElement);
        const primaryColor = `hsl(${style.getPropertyValue('--brand-primary-raw')})`;
        const trackColor = theme === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.05)';

        chartRef.current = new window.Chart(canvasRef.current, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [primaryColor, trackColor],
                    borderWidth: 0,
                    cutout: '80%',
                    circumference: 270,
                    rotation: -135,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: { animateRotate: true, duration: 1500 },
            },
            plugins: [{
                id: 'doughnutText',
                afterDraw(chart) {
                    const { ctx, width, height } = chart;
                    ctx.restore();
                    
                    const chartScore = chart.data.datasets[0].data[0];
                    
                    // Score Text
                    let fontSize = (height / 5).toFixed(2);
                    ctx.font = `bold ${fontSize}px Inter`;
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = chart.data.datasets[0].backgroundColor[0] as string;
                    let text = `${chartScore}%`;
                    let textX = Math.round((width - ctx.measureText(text).width) / 2);
                    let textY = height / 2;
                    ctx.fillText(text, textX, textY);

                    // Label Text
                    fontSize = (height / 20).toFixed(2);
                    ctx.font = `${fontSize}px Inter`;
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = theme === 'dark' ? '#94a3b8' : '#334155'; // slate-400 / slate-700
                    text = title;
                    textX = Math.round((width - ctx.measureText(text).width) / 2);
                    textY = height / 2 + parseFloat(fontSize) * 1.5;
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
    }, [score, theme, title]);

    return <canvas ref={canvasRef} />;
};

export default ScoreChart;