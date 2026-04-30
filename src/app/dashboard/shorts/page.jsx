import { query } from "../../../lib/db.js";

async function shorts() {
  const result = await query("SELECT * FROM shorts");
  const shorts = result.rows;
  console.log(shorts);

  return (
    <section>
      <div>
        <h1>SHORTS</h1>
        <hr></hr>
        <br></br>
        <div>
        <ul>
            <li>Company | Symbol | Market | Current Short | Previous Short | Outstanding | Float | Av. Volume 3m</li>
        </ul>
        <ul>
          {shorts.map((short) => (
            <li key={short.id}>
                
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default shorts;