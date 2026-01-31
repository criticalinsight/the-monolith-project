const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../public/assets-r2/assets/choreography.json');

function validate() {
    console.log(`Starting validation for: ${MANIFEST_PATH}`);

    // 1. Syntax Check
    let manifest;
    try {
        const content = fs.readFileSync(MANIFEST_PATH, 'utf-8');
        manifest = JSON.parse(content);
        console.log("✅ Syntax: Valid JSON");
    } catch (err) {
        console.error("❌ Syntax: Invalid JSON");
        console.error(err.message);
        process.exit(1);
    }

    // 2. Structural Check
    const requiredKeys = ['scenes', 'initial_scene', 'choreography'];
    requiredKeys.forEach(key => {
        if (!manifest[key]) {
            console.error(`❌ Structure: Missing required key '${key}'`);
            process.exit(1);
        }
    });
    console.log("✅ Structure: Required keys present");

    // 3. Scene Check
    if (!manifest.scenes[manifest.initial_scene]) {
        console.error(`❌ Logic: Initial scene '${manifest.initial_scene}' not found in scenes definition`);
        process.exit(1);
    }
    console.log(`✅ Logic: Initial scene '${manifest.initial_scene}' exists`);

    // 4. Asset Path Check (Warning only, as paths are relative to base)
    let totalAssets = 0;
    Object.keys(manifest.scenes).forEach(sceneId => {
        const scene = manifest.scenes[sceneId];
        if (scene.assets) {
            scene.assets.forEach(asset => {
                totalAssets++;
            });
        }
    });
    console.log(`ℹ️ Info: Found ${Object.keys(manifest.scenes).length} scenes and ${totalAssets} asset references`);

    console.log("\n✨ Validation Successful.");
}

validate();
