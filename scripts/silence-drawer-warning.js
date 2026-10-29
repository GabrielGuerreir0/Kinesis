const fs = require('fs');
const path = require('path');

const edits = [
  [
    'node_modules/react-native-drawer-layout/lib/module/views/Drawer.native.js',
    [
      '}, [direction, drawerPosition, drawerType, drawerWidth, isHidden, layout.width, translateX]);',
      '}, [drawerPosition, drawerType, drawerWidth, translateX]);',
      '}, [drawerType, progress]);',
    ],
  ],
  ['node_modules/react-native-drawer-layout/lib/module/views/Overlay.native.js', ['}, [progress]);']],
];

for (const [file, needles] of edits) {
  const full = path.join(__dirname, '..', file);
  if (!fs.existsSync(full)) continue;
  const source = fs.readFileSync(full, 'utf8');
  const next = needles.reduce((text, needle) => text.split(needle).join('});'), source);
  if (next !== source) fs.writeFileSync(full, next);
}
