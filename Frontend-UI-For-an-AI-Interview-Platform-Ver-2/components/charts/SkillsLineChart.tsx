// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import type { Theme, SkillProgress } from '../../types';

interface SkillsLineChartProps {
    theme: Theme;
    data: SkillProgress[];
}

const SkillsLineChart: React.FC<SkillsLineChartProps> = ({ theme, data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart || !data || data.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const isDark = theme === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#cbd5e1' : '#475569'; // slate-300 or slate-600
        
        const style = getComputedStyle(document.documentElement);
        const primaryColor = `hsl(${style.getPropertyValue('--brand-primary-raw')})`;
        const secondaryColor = `hsl(${style.getPropertyValue('--brand-secondary-raw')})`;
        const accentColor = 'hsl(240, 60%, 65%)'; // A vibrant, distinct blue for better contrast

        const labels = data.map(item => item.session);
        const skillNames = Object.keys(data[0].skills);
        const colors = [primaryColor, secondaryColor, accentColor];

        const datasets = skillNames.map((skill, index) => ({
            label: skill,
            data: data.map(item => item.skills[skill]),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '33', // with transparency
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: colors[index % colors.length],
        }));

        chartRef.current = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: { family: 'Inter, sans-serif' },
                            usePointStyle: true,
                            pointStyle: 'line',
                            boxWidth: 20,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        enabled: true,
                         backgroundColor: '#1e293b', // slate-800
                        titleColor: '#f8fafc', // slate-50
                        bodyColor: '#cbd5e1', // slate-300
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: gridColor,
                            display: false
                        },
                        ticks: {
                            color: textColor,
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                        },
                        ticks: {
                            color: textColor,
                        },
                        beginAtZero: true,
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };

    }, [data, theme]);

    return <canvas ref={canvasRef} />;
};

export default SkillsLineChart;