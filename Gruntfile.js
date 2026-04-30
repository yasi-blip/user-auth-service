grunt.registerTask("db-reset", "(Re)init the database.", function(arg) {
    var finalEnv = process.env.NODE_ENV || arg || "development";
    var done = this.async();

    // Whitelist acceptable environment names to avoid arbitrary input.
    var allowedEnvs = ["development", "test", "staging", "production"];
    if (allowedEnvs.indexOf(finalEnv) === -1) {
        grunt.log.error("Invalid environment specified for db-reset: " + String(finalEnv));
        done(false);
        return;
    }

    var path = require("path");
    var execFile = require("child_process").execFile;
    var script = path.join(process.cwd(), "artifacts", "db-reset.js");
    var env = Object.assign({}, process.env, { NODE_ENV: finalEnv });

    // PRECOGS_FIX: use execFile (no shell) and set NODE_ENV via env option to avoid shell injection
    execFile(process.execPath, [script], { env: env }, function(err, stdout, stderr) {
        if (err) {
            grunt.log.error("db-reset:");
            grunt.log.error(err);
            grunt.log.error(stderr);
        } else {
            grunt.log.ok(stdout);
        }
        done();
    });
});
