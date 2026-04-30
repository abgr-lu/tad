import { query } from "../../../lib/db.js";

async function companies() {
  const result = await query("SELECT * FROM companies");
  const comp = result.rows;
  console.log(comp);

  return (
    <section>
      <div>
        <h1>COMPANIES</h1>
        <hr></hr>
        <br></br>
        <div>
        <ul>
            <li>Name</li>
        </ul>
        <ul>
          {comp.map((comp) => (
            <li key={comp.name}>
                
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default companies;