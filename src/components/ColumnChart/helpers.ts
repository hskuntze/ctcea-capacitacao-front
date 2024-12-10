import { ApexOptions } from "apexcharts";

/**
 * Função responsável pela construção das propriedades/opções 
 * que são utilizadas pela biblioteca para montar o gráfico
 * @param data 
 * @param labels 
 * @param title 
 * @param colors 
 * @returns 
 */
export const buildColumnChart = (
  data: number[] = [],
  labels: string[] = [],
  title: string,
  colors: string[],
) => {
  return {
    series: [
      {
        name: "Status",
        data: [data],
      },
    ],
    colors: colors,
    chart: {
      height: 400,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: 0,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: [...labels],
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    title: {
      text: title,
      floating: false,
      offsetY: 380,
      align: "center",
      style: {
        color: "#333",
      },
    },
  } as ApexOptions;
};
