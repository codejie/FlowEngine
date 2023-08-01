import { create_flow } from "./create_flow";
import { test } from "./mysql";

try {
    // test();
    create_flow();
} catch (error) {
    console.error(error);
}

