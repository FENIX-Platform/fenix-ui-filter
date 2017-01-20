/*global describe, it, require*/
function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("FENIX Filter", function () {

    importTest("Default Values", "./defaultValues");

    importTest("Get Values", "./getValues");

    importTest("Set Values", "./setValues");

    importTest("Dynamic", "./dynamic");

});