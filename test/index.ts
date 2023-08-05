import { create_flow } from "./create_flow";
import { test } from "./mysql";

try {
    // test();
    create_flow()
        .then(() => {
            console.log('Test Done.');
        })
} catch (error) {
    console.error(error);
}

