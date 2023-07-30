import Database from "../src/db/mysql";

const db: Database = new Database();

export async function test() {
    await db.connect('host.docker.internal', 3306, 'flow_engine', 'root', '123');
    await db.execute('INSERT INTO nodes (`id`, `name`, `description`, `type`) VALUES (?,?,?,?)', ['start','t', 'for test', '2']);
    const results = await db.query('SELECT * FROM nodes');
    results.forEach(r => {
        console.log(r);
    });
    await db.disconnect();
}