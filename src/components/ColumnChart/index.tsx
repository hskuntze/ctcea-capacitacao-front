import ReactApexChart from "react-apexcharts";
import { buildColumnChart } from "./helpers";
import "./styles.css";

type Props = {
  data: number[];
  labels: string[];
  title: string;
  colors: string[];
};

/**
 * Componente de gráfico de colunas. Recebe os parâmetros:
 * - data: os dados que serão exibidos
 * - labels: rótulos dos dados
 * - title: título do gráfico
 * - colors: array de cores para as colunas
 */
const ColumnChart = ({ data, labels, title, colors }: Props) => {
  return (
    <div className="relatorio-chart">
      <ReactApexChart
        options={buildColumnChart(data, labels, title, colors)}
        type="bar"
        width={400}
        height={400}
        series={[{data}]}
      />
    </div>
  );
};

export default ColumnChart;
