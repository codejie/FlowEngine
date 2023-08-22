import Poplar from "poplar-logger";

export default new Poplar({
    pretty: true,
    level: 'trace',
    // output: process.stderr
    color: 'text',
    noTags: true,
});