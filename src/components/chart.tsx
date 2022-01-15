import Head from 'next/head';
import Script from 'next/script';

function createRow(
  id: string,
  title: string,
  startAt: Date | null,
  endAt: Date,
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

export default function Chart() {
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
        onLoad={() => {
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

            data.addRows([
              createRow(
                'Research',
                'Find sources',
                new Date(2015, 0, 1),
                new Date(2015, 0, 5),
                null,
                100,
                null
              ),
              createRow(
                'Write',
                'Write paper',
                null,
                new Date(2015, 0, 9),
                daysToMilliseconds(3),
                25,
                'Research,Outline'
              ),
              createRow(
                'Cite',
                'Create bibliography',
                null,
                new Date(2015, 0, 7),
                daysToMilliseconds(1),
                20,
                'Research'
              ),
              createRow(
                'Complete',
                'Hand in paper',
                null,
                new Date(2015, 0, 10),
                daysToMilliseconds(1),
                0,
                'Cite,Write'
              ),
              createRow(
                'Outline',
                'Outline paper',
                null,
                new Date(2015, 0, 6),
                daysToMilliseconds(1),
                100,
                'Research'
              ),
            ]);

            const options = {
              height: 400,
            };

            const chart = new google.visualization.Gantt(
              document.getElementById('gantt-chart')!
            );

            chart.draw(data, options);
          }
        }}
      />
    </>
  );
}
