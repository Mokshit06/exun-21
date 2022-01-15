declare global {
  namespace google {
    namespace visualization {
      type Row = [
        id: string,
        title: string,
        resource: string,
        startAt: Date | null,
        endAt: Date,
        duration: number | null,
        percentDone: number,
        dependsOn: string | null
      ];
      class DataTable {
        addColumn(type: string, name: string): void;
        addRows(rows: Array<Row>): void;
      }
      class Gantt {
        constructor(root: HTMLElement);
        draw(
          data: DataTable,
          options: {
            height: number;
          }
        ): void;
      }
    }
    namespace charts {
      function load(type: string, options: { packages: string[] }): void;
      function setOnLoadCallback(cb: () => void): void;
    }
  }
}

export {};
