import { query } from "../../../lib/db.js";

async function ob() {
  const result = await query("SELECT * FROM ob");
  const ob = result.rows;
  console.log(ob);

  return (
    <section>
      <div>
        <h1>ORDER BOOK</h1>
        <hr></hr>
        <br></br>
        <div>
        <ul>
            <li>Type | 2026 | 2027 | 2028 | Beyond | Total | Total Units</li>
        </ul>
        <ul>
          {ob.map((ob) => (
            <li key={ob.id}>
                
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default ob;
//{ob.type} | {ob.'2026'} | {ob.'2027'} | {ob.'2028'} | {ob.beyond} | {ob.total} | {sales.buyer} | {sales.price}