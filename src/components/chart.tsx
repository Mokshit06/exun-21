import { Task, User } from '@prisma/client';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';

function createRow(
  id: string,
  title: string,
  startAt: Date | null,
  endAt: Date | null,
  duration: number | null,
  percentDone: number,
  dependsOn: string | null
): google.visualization.Row {
  return [
    id,
    title,
    // Math.random to generate a unique string so that each bar is of different color
    'resource' + Math.random(),
    startAt,
    endAt,
    duration,
    percentDone,
    dependsOn,
  ];
}

export default function Chart(props: {
  tasks: Array<Task & { assignedTo: User[]; dependsOn: Task[] }>;
}) {
  const [r, rerender] = useState(false);
  const { tasks } = props;

  useEffect(() => {
    if (!('google' in window)) return;

    google.charts.load('current', { packages: ['gantt'] });
    google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days: number) {
      return days * 24 * 60 * 60 * 1000;
    }
    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      data.addRows(
        tasks.map((task, index) => {
          const complete = task.description.split('- [x] ').length - 1;
          const incomplete = task.description.split('- [ ] ').length - 1;
          const total = complete + incomplete;

          return createRow(
            task.id,
            task.title,
            task.dependsOn.length > 0 ? null : new Date(task.startedAt),
            null,
            task.duration ? daysToMilliseconds(task.duration) : null,
            total === 0 ? 100 : (complete / total) * 100,
            task.dependsOn.map(t => t.id).join(',') || null
          );
        })
      );

      const options = {
        height: 400,
        gantt: {
          innerGridTrack: { fill: '#383838' },
          innerGridDarkTrack: { fill: '#292929' },
          labelStyle: {
            fontName: 'Roboto',
            fontSize: 14,
            color: '#e4e4e4',
          },
        },
        backgroundColor: { fill: '#212121' },
      };

      const chart = new google.visualization.Gantt(
        document.getElementById('gantt-chart')!
      );

      chart.draw(data, options);
    }
  }, [r, tasks]);

  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div id="gantt-chart" />
      <Script
        src="https://www.gstatic.com/charts/loader.js"
        onLoad={() => rerender(true)}
      />
    </>
  );
}
