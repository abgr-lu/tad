import { query } from "../../../lib/db.js";

async function vvalues() {
  const result = await query("SELECT * FROM vv");
  const vv = result.rows;
  console.log(vv);

  return (
    <section>
      <div>
        <h1>VESSEL VALUATIONS</h1>
        <hr></hr>
        <br></br>
        <div>
        <ul>
            <li>Type | NB | 5y | 10y | 15y | 20y | scrap</li>
        </ul>
        <ul>
          {vv.map((vv) => (
            <li key={vv.id}>
                
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default vvalues;