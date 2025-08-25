const fs = require('fs');
const path = require('path');

// chemins
const pkgPath = path.join(__dirname, '..', 'package.json');
const publicMapPath = path.join(__dirname, '..', 'public-packages.json');
const outputPath = path.join(__dirname, '..', 'public', 'assets', 'public-dependencies.json');

// lecture des fichiers
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const publicMap = JSON.parse(fs.readFileSync(publicMapPath, 'utf-8'));

const deps = {};

// parcours des packages publics
for (const [publicName, realName] of Object.entries(publicMap)) {
  const version =
    pkg.dependencies?.[realName] ||
    pkg.devDependencies?.[realName] ||
    null;

  if (version) {
    deps[publicName] = version.replace(/^[\^~]/, ''); // nettoie ^ ou ~
  } else {
    console.warn(`⚠️ Package "${realName}" non trouvé dans package.json`);
  }
}

// écriture du fichier de sortie
fs.writeFileSync(outputPath, JSON.stringify(deps, null, 2));
console.log(`✅ Fichier généré : ${outputPath}`);
