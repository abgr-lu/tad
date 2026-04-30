import { query } from "../../../lib/db.js";

async function vsales() {
  const result = await query("SELECT * FROM vsales");
  const vsales = result.rows;
  console.log(vsales);

  return (
    <section>
      <div>
        <h1>VESSEL SECONDHAND SALES</h1>
        <hr></hr>
        <br></br>
        <div>
        <ul>
            <li>Vessel Name | Type | DWT | Year | Yard | Country | Buyer | Price</li>
        </ul>
        <ul>
          {vsales.map((sales) => (
            <li key={sales.id}>
                {sales.name} | {sales.type} | {sales.dwt} | {sales.year_b} | {sales.yard} | {sales.country} | {sales.buyer} | {sales.price}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default vsales;
