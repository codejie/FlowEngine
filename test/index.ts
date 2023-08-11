import { create_flow } from "./create_flow";
import { test } from "./mysql";
import { new_flow } from "./new_flow";

try {
    // test();
    // create_flow()
    new_flow()
        .then(() => {
            console.log('Test Done.');
        })
} catch (error) {
    console.error(error);
}

