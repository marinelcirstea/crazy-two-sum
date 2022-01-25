import { ISum } from "src/types";
import s from "./style.module.css";

interface ISumsTableProps {
  sums: ISum[];
}

function SumsTable({ sums }: ISumsTableProps) {
  return (
    <div className={s.tableContainer}>
      <table className={s.sumsTable}>
        <thead>
          <tr>
            <th>Position of item A</th>
            <th>Position of item B</th>
            <th>Position of sum</th>
          </tr>
        </thead>
        <tbody>
          {sums.map((s) => {
            const { pA, pB, sum } = s;
            return (
              <tr key={`${pA}${pB}${sum}`}>
                <td>{pA}</td>
                <td>{pB}</td>
                <td>{sum}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SumsTable;
