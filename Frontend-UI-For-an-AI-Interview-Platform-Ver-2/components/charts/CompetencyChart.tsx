// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import type { Theme } from '../../types';

interface CompetencyChartProps {
    theme: Theme;
}

const CompetencyChart: React.FC<CompetencyChartProps> = ({ theme }) => {
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

        const gradient = ctx.createRadialGradient(
            canvasRef.current.width / 2,
            canvasRef.current.height / 2,
            0,
            canvasRef.current.width / 2,
            canvasRef.current.height / 2,
            canvasRef.current.width / 2
        );
        gradient.addColorStop(0, `hsla(${style.getPropertyValue('--brand-primary-raw')}, 0.4)`);
        gradient.addColorStop(1, `hsla(${style.getPropertyValue('--brand-secondary-raw')}, 0.4)`);
        
        const data = {
            labels: ['STAR Method', 'Technical Depth', 'Clarity', 'Leadership', 'Collaboration'],
            datasets: [{
                label: 'Your Competencies',
                data: [88, 95, 78, 85, 92],
                backgroundColor: gradient,
                borderColor: primaryColor,
                pointBackgroundColor: primaryColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: primaryColor,
                borderWidth: 2,
            }]
        };

        chartRef.current = new window.Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'var(--chart-tooltip-bg)',
                        titleColor: 'var(--chart-tooltip-text)',
                        bodyColor: 'var(--chart-tooltip-text)',
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'var(--chart-grid-color)'
                        },
                        grid: {
                            color: 'var(--chart-grid-color)'
                        },
                        pointLabels: {
                            color: 'var(--chart-text-color)',
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: 'var(--chart-text-color)',
                            stepSize: 25,
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [theme]);

    return <canvas ref={canvasRef} />;
};

export default CompetencyChart;