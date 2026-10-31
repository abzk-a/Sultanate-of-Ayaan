import * as THREE from 'three';
import {
  createIslamicStarTexture,
  createCobblestoneTexture,
  createRoyalCarpetTexture,
  createMashrabiyaTexture,
} from './textures';
import { CollisionSystem } from './collision';

export interface CityEnvironment {
  group: THREE.Group;
  animatedMeshes: {
    update: (time: number, dt: number) => void;
  };
}

export function buildCapitalCity(collision: CollisionSystem): CityEnvironment {
  const cityGroup = new THREE.Group();

  // Procedural Textures
  const starTileTex = createIslamicStarTexture();
  starTileTex.repeat.set(8, 8);

  const cobblestoneTex = createCobblestoneTexture();
  cobblestoneTex.repeat.set(24, 24);

  const carpetTex = createRoyalCarpetTexture();
  const mashrabiyaTex = createMashrabiyaTexture();
  mashrabiyaTex.repeat.set(2, 2);

  // Reusable PBR Materials
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xd9c29e,
    roughness: 0.85,
    metalness: 0.05,
  });

  const darkSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xaa8c66,
    roughness: 0.9,
    metalness: 0.05,
  });

  const goldDomeMat = new THREE.MeshStandardMaterial({
    color: 0xe6b800,
    roughness: 0.22,
    metalness: 0.88,
  });

  const emeraldTileMat = new THREE.MeshStandardMaterial({
    color: 0x1c6643,
    roughness: 0.35,
    metalness: 0.15,
  });

  const whiteMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e6,
    roughness: 0.3,
    metalness: 0.1,
  });

  const woodBeamMat = new THREE.MeshStandardMaterial({
    color: 0x422615,
    roughness: 0.8,
    metalness: 0.05,
  });

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xc8b28a,
    map: cobblestoneTex,
    roughness: 0.95,
    metalness: 0.02,
  });

  const courtyardTileMat = new THREE.MeshStandardMaterial({
    map: starTileTex,
    roughness: 0.45,
    metalness: 0.1,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x2299aa,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  });

  // 1. Terrain: Expansive Desert Ground & Distant Dunes
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  cityGroup.add(groundMesh);

  // Distant Desert Dunes ring
  const dunesGeo = new THREE.RingGeometry(75, 120, 32);
  const dunesMat = new THREE.MeshStandardMaterial({
    color: 0xd4a76a,
    roughness: 0.95,
  });
  const dunesMesh = new THREE.Mesh(dunesGeo, dunesMat);
  dunesMesh.rotation.x = -Math.PI / 2;
  dunesMesh.position.y = -0.1;
  cityGroup.add(dunesMesh);

  // 2. Palace Courtyard Star Mosaic Floor (raised slightly by 0.02 to avoid Z-fight)
  const courtyardGeo = new THREE.PlaneGeometry(36, 36);
  const courtyardMesh = new THREE.Mesh(courtyardGeo, courtyardTileMat);
  courtyardMesh.rotation.x = -Math.PI / 2;
  courtyardMesh.position.set(0, 0.02, 0);
  courtyardMesh.receiveShadow = true;
  cityGroup.add(courtyardMesh);

  // 3. GRAND ROYAL PALACE & THRONE ROOM (Positioned along Z = -28)
  const palaceGroup = new THREE.Group();
  palaceGroup.position.set(0, 0, -28);
  cityGroup.add(palaceGroup);

  // Raised Palace Terrace (Plinth)
  const plinthGeo = new THREE.BoxGeometry(40, 1.2, 22);
  const plinthMesh = new THREE.Mesh(plinthGeo, sandstoneMat);
  plinthMesh.position.set(0, 0.6, 0);
  plinthMesh.receiveShadow = true;
  plinthMesh.castShadow = true;
  palaceGroup.add(plinthMesh);
  collision.addBox(-20, 20, -39, -17);

  // Main Palace Hall Facade & Back Wall
  const backWallGeo = new THREE.BoxGeometry(38, 11, 2);
  const backWall = new THREE.Mesh(backWallGeo, sandstoneMat);
  backWall.position.set(0, 6.7, -9.5);
  backWall.castShadow = true;
  palaceGroup.add(backWall);

  const leftWingGeo = new THREE.BoxGeometry(10, 11, 18);
  const leftWing = new THREE.Mesh(leftWingGeo, sandstoneMat);
  leftWing.position.set(-14, 6.7, 0);
  leftWing.castShadow = true;
  palaceGroup.add(leftWing);

  const rightWingGeo = new THREE.BoxGeometry(10, 11, 18);
  const rightWing = new THREE.Mesh(rightWingGeo, sandstoneMat);
  rightWing.position.set(14, 6.7, 0);
  rightWing.castShadow = true;
  palaceGroup.add(rightWing);

  // Grand Palace Central Horseshoe Archway
  const archRoofGeo = new THREE.BoxGeometry(18, 3, 14);
  const archRoof = new THREE.Mesh(archRoofGeo, sandstoneMat);
  archRoof.position.set(0, 10.5, 0);
  archRoof.castShadow = true;
  palaceGroup.add(archRoof);

  // Golden Fluted Onion Dome over Central Hall
  const domeBaseGeo = new THREE.CylinderGeometry(5.2, 5.8, 1.8, 18);
  const domeBase = new THREE.Mesh(domeBaseGeo, sandstoneMat);
  domeBase.position.set(0, 12.8, 0);
  palaceGroup.add(domeBase);

  // Onion Dome shape
  const domeGeo = new THREE.SphereGeometry(5.4, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7);
  domeGeo.scale(1, 1.35, 1);
  const domeMesh = new THREE.Mesh(domeGeo, goldDomeMat);
  domeMesh.position.set(0, 13.5, 0);
  domeMesh.castShadow = true;
  palaceGroup.add(domeMesh);

  // Dome Spire / Finial with Crescent
  const spireGeo = new THREE.CylinderGeometry(0.12, 0.4, 3.5, 8);
  const spireMesh = new THREE.Mesh(spireGeo, goldDomeMat);
  spireMesh.position.set(0, 20.2, 0);
  palaceGroup.add(spireMesh);

  const crescentGeo = new THREE.TorusGeometry(0.6, 0.12, 8, 16, Math.PI * 1.5);
  const crescentMesh = new THREE.Mesh(crescentGeo, goldDomeMat);
  crescentMesh.position.set(0, 21.8, 0);
  crescentMesh.rotation.z = Math.PI / 4;
  palaceGroup.add(crescentMesh);

  // Marble Columns in the Throne Portico
  const colPositions = [
    [-6, 1], [-6, 6],
    [6, 1], [6, 6],
  ];
  for (const [cx, cz] of colPositions) {
    const colGroup = new THREE.Group();
    colGroup.position.set(cx, 1.2, cz);

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), whiteMarbleMat);
    baseMesh.position.y = 0.25;
    colGroup.add(baseMesh);

    const shaftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 7.5, 14), whiteMarbleMat);
    shaftMesh.position.y = 4.25;
    shaftMesh.castShadow = true;
    colGroup.add(shaftMesh);

    const capitalMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), goldDomeMat);
    capitalMesh.position.y = 8.3;
    colGroup.add(capitalMesh);

    palaceGroup.add(colGroup);
    collision.addCylinder(cx, -28 + cz, 0.6);
  }

  // 4. THRONE ROOM DAIS & ROYAL FURNISHINGS
  // Royal Carpet on the throne dais
  const carpetMat = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.7,
  });
  const throneCarpet = new THREE.Mesh(new THREE.PlaneGeometry(7, 10), carpetMat);
  throneCarpet.rotation.x = -Math.PI / 2;
  throneCarpet.position.set(0, 1.23, -2);
  throneCarpet.receiveShadow = true;
  palaceGroup.add(throneCarpet);

  // Elevated Throne Platform
  const throneDais = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 3.8), whiteMarbleMat);
  throneDais.position.set(0, 1.45, -5.5);
  throneDais.castShadow = true;
  palaceGroup.add(throneDais);

  // Grand Imperial Throne Chair
  const throneChairGroup = new THREE.Group();
  throneChairGroup.position.set(0, 1.68, -5.5);

  const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.4), emeraldTileMat);
  seatMesh.position.y = 0.4;
  seatMesh.castShadow = true;
  throneChairGroup.add(seatMesh);

  const backrestMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.35), goldDomeMat);
  backrestMesh.position.set(0, 1.3, -0.6);
  backrestMesh.castShadow = true;
  throneChairGroup.add(backrestMesh);

  // Cushion
  const cushionMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.2), emeraldTileMat);
  cushionMesh.position.set(0, 0.65, -0.05);
  throneChairGroup.add(cushionMesh);

  palaceGroup.add(throneChairGroup);
  collision.addBox(-2.5, 2.5, -35.5, -31);

  // Register Throne Room Council Interactable
  collision.addInteractable({
    id: 'throne_council',
    name: 'Imperial Throne & Council Dais',
    prompt: '[E] Convene Royal Court with Advisors',
    x: 0,
    z: -31,
    radius: 3.5,
    actionType: 'court',
  });

  // Royal Divan & Management Ledger Desk
  const ledgerDesk = new THREE.Mesh(new THREE.BoxGeometry(2, 0.75, 1.1), woodBeamMat);
  ledgerDesk.position.set(-4.5, 1.58, -3);
  ledgerDesk.castShadow = true;
  palaceGroup.add(ledgerDesk);

  const ledgerScroll = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.6), whiteMarbleMat);
  ledgerScroll.position.set(-4.5, 2.0, -3);
  palaceGroup.add(ledgerScroll);

  collision.addInteractable({
    id: 'royal_ledger',
    name: 'Royal Divan Ledger',
    prompt: '[E] Open Kingdom Management Ledger',
    x: -4.5,
    z: -31,
    radius: 2.8,
    actionType: 'management',
  });

  // 5. THREE ADVISOR 3D NPC MESHES AT THRONE ROOM
  // 1) Grand Vizier Tariq (Blue/Ivory robe with scroll)
  const vizierNpc = createAdvisorNpcMesh(0x204a87, 0xf5eedb, 'Grand Vizier Tariq');
  vizierNpc.position.set(-2.4, 1.2, -4.5);
  vizierNpc.rotation.y = 0.4;
  palaceGroup.add(vizierNpc);

  // 2) General Qasim (Armor breastplate & crimson sash)
  const generalNpc = createAdvisorNpcMesh(0x8a2323, 0xd4af37, 'General Qasim');
  generalNpc.position.set(2.4, 1.2, -4.5);
  generalNpc.rotation.y = -0.4;
  palaceGroup.add(generalNpc);

  // 3) Merchant Guildmaster Bilal (Saffron gold robe & turban)
  const merchantNpc = createAdvisorNpcMesh(0xc88718, 0x1b5e3f, 'Guildmaster Bilal');
  merchantNpc.position.set(3.8, 1.2, -1.8);
  merchantNpc.rotation.y = -0.8;
  palaceGroup.add(merchantNpc);

  // Torch Braziers with flame particles
  const braziers: THREE.Mesh[] = [];
  const brazierPositions = [
    [-3.2, 1.2, 1.2],
    [3.2, 1.2, 1.2],
  ];
  for (const [bx, by, bz] of brazierPositions) {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 8), darkSandstoneMat);
    stand.position.set(bx, by + 0.55, bz);
    stand.castShadow = true;
    palaceGroup.add(stand);

    const flameGeo = new THREE.ConeGeometry(0.22, 0.5, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(bx, by + 1.35, bz);
    palaceGroup.add(flame);
    braziers.push(flame);
  }

  // 6. GRAND COURTYARD OCTAGONAL FOUNTAIN (Center at 0, 0)
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0, 0);
  cityGroup.add(fountainGroup);

  // Fountain Outer Basin (Octagonal)
  const basinRimGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.75, 8);
  const basinRim = new THREE.Mesh(basinRimGeo, whiteMarbleMat);
  basinRim.position.y = 0.38;
  basinRim.castShadow = true;
  basinRim.receiveShadow = true;
  fountainGroup.add(basinRim);
  collision.addCylinder(0, 0, 3.8);

  // Fountain Water Surface
  const waterGeo = new THREE.CircleGeometry(3.3, 16);
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = 0.65;
  fountainGroup.add(waterMesh);

  // Central Tiered Fountain Pedestal & Spout
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.2, 8), emeraldTileMat);
  tier1.position.y = 1.0;
  tier1.castShadow = true;
  fountainGroup.add(tier1);

  const tier2Basin = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.8, 0.4, 8), whiteMarbleMat);
  tier2Basin.position.y = 1.8;
  fountainGroup.add(tier2Basin);

  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.9, 8), goldDomeMat);
  spout.position.y = 2.45;
  fountainGroup.add(spout);

  // Water droplets / spray particle mesh
  const dropletCount = 24;
  const dropletGeo = new THREE.DodecahedronGeometry(0.08);
  const dropletMat = new THREE.MeshBasicMaterial({ color: 0x88e0ff });
  const droplets: THREE.Mesh[] = [];
  for (let i = 0; i < dropletCount; i++) {
    const d = new THREE.Mesh(dropletGeo, dropletMat);
    fountainGroup.add(d);
    droplets.push(d);
  }

  collision.addInteractable({
    id: 'fountain',
    name: 'Courtyard Fountain of Serenity',
    prompt: '[E] Reflect upon Royal Blessings',
    x: 0,
    z: 0,
    radius: 4.8,
    actionType: 'fountain',
  });

  // 7. SOUK / TRADITIONAL MARKETPLACE (Positioned along X = -24 to -12, Z = 6 to 28)
  const soukGroup = new THREE.Group();
  cityGroup.add(soukGroup);

  const canopyColors = [0x991b1b, 0x0284c7, 0xd97706, 0x059669, 0x7c2d12];
  const stallData = [
    { x: -16, z: 8, rot: 0.1, color: canopyColors[0], name: 'Damask Silk Merchant' },
    { x: -22, z: 12, rot: 0.3, color: canopyColors[1], name: 'Caravan Spice Depot' },
    { x: -15, z: 20, rot: -0.2, color: canopyColors[2], name: 'Royal Persian Rugs' },
    { x: -23, z: 24, rot: 0.05, color: canopyColors[3], name: 'Arabian Brass & Lamps' },
    { x: -16, z: 30, rot: -0.15, color: canopyColors[4], name: 'Oasis Dates & Grain' },
  ];

  stallData.forEach((s) => {
    const stall = createMarketStall(s.color, woodBeamMat, darkSandstoneMat);
    stall.position.set(s.x, 0, s.z);
    stall.rotation.y = s.rot;
    soukGroup.add(stall);
    collision.addBox(s.x - 2.2, s.x + 2.2, s.z - 1.8, s.z + 1.8);
  });

  // Souk Interactivity
  collision.addInteractable({
    id: 'souk_market',
    name: 'Madinat al-Ayaan Grand Souk',
    prompt: '[E] Inspect Market Caravans & Supplies',
    x: -18,
    z: 16,
    radius: 4.5,
    actionType: 'souk',
  });

  // 8. RESIDENTIAL DISTRICT (Multi-story sandstone buildings with mashrabiya windows)
  // Along X = 16 to 34, Z = 6 to 34
  const housesGroup = new THREE.Group();
  cityGroup.add(housesGroup);

  const houseConfigs = [
    { x: 18, z: 8, w: 9, h: 7, d: 8, col: 0xdec6a2 },
    { x: 26, z: 18, w: 10, h: 8.5, d: 9, col: 0xd4ba94 },
    { x: 17, z: 27, w: 8.5, h: 6.5, d: 8, col: 0xe2ccab },
    { x: 28, z: 32, w: 9.5, h: 8, d: 8.5, col: 0xd9c09d },
    { x: -28, z: -8, w: 10, h: 8, d: 9, col: 0xd2b892 },
    { x: 28, z: -10, w: 11, h: 9, d: 9, col: 0xdebfa0 },
  ];

  houseConfigs.forEach((h) => {
    const house = createSandstoneHouse(h.w, h.h, h.d, h.col, mashrabiyaTex, woodBeamMat);
    house.position.set(h.x, 0, h.z);
    housesGroup.add(house);
    collision.addBox(h.x - h.w / 2, h.x + h.w / 2, h.z - h.d / 2, h.z + h.d / 2);
  });

  // 9. IMPERIAL GARDENS (Date Palms, Cypress Trees, Planters)
  // Palm tree positions (clustered around courtyard & garden walks)
  const palmPositions = [
    [-10, -12], [10, -12],
    [-12, -2], [12, -2],
    [-8, 14], [8, 14],
    [-2, 22], [4, 22],
    [-8, -22], [8, -22],
    [-30, 2], [30, 0],
    [-12, 38], [12, 38],
  ];

  palmPositions.forEach(([px, pz]) => {
    const palm = createDatePalmTree(woodBeamMat);
    palm.position.set(px, 0, pz);
    cityGroup.add(palm);
    collision.addCylinder(px, pz, 0.45);
  });

  // Cypress trees (formal geometric garden rows)
  const cypressPositions = [
    [-6, -7], [6, -7],
    [-6, 7], [6, 7],
    [-18, -14], [18, -14],
  ];
  cypressPositions.forEach(([cx, cz]) => {
    const cypress = createCypressTree();
    cypress.position.set(cx, 0, cz);
    cityGroup.add(cypress);
    collision.addCylinder(cx, cz, 0.4);
  });

  // 10. FORTIFIED CITY WALLS, CORNER WATCHTOWERS & GRAND SOUTH GATE
  const wallsGroup = new THREE.Group();
  cityGroup.add(wallsGroup);

  const wallMat = darkSandstoneMat;

  // City Wall Segments (Perimeter at ±50)
  // North Wall (Behind palace)
  buildWallSegment(wallsGroup, 0, -48, 100, 8, 3, 0, wallMat);
  collision.addBox(-50, 50, -50, -46);

  // West Wall
  buildWallSegment(wallsGroup, -48, 0, 100, 8, 3, Math.PI / 2, wallMat);
  collision.addBox(-50, -46, -50, 50);

  // East Wall
  buildWallSegment(wallsGroup, 48, 0, 100, 8, 3, Math.PI / 2, wallMat);
  collision.addBox(46, 50, -50, 50);

  // South Wall (Left and Right wings of Grand City Gate)
  buildWallSegment(wallsGroup, -28, 48, 44, 8, 3, 0, wallMat);
  collision.addBox(-50, -6, 46, 50);

  buildWallSegment(wallsGroup, 28, 48, 44, 8, 3, 0, wallMat);
  collision.addBox(6, 50, 46, 50);

  // Grand City Gate Portal (South Gate at 0, 48)
  const gatePortalGroup = new THREE.Group();
  gatePortalGroup.position.set(0, 0, 48);

  // Flanking Gate Towers
  const leftGateTower = createWatchtower(sandstoneMat, goldDomeMat);
  leftGateTower.position.set(-6, 0, 0);
  gatePortalGroup.add(leftGateTower);
  collision.addCylinder(-6, 48, 2.4);

  const rightGateTower = createWatchtower(sandstoneMat, goldDomeMat);
  rightGateTower.position.set(6, 0, 0);
  gatePortalGroup.add(rightGateTower);
  collision.addCylinder(6, 48, 2.4);

  // Arch Lintol above Gate
  const gateArch = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 3.2), sandstoneMat);
  gateArch.position.set(0, 9.5, 0);
  gateArch.castShadow = true;
  gatePortalGroup.add(gateArch);

  // Royal Sultanate Banner Standards
  const bannerLeft = createRoyalBannerMesh();
  bannerLeft.position.set(-4.5, 7.5, 1.8);
  gatePortalGroup.add(bannerLeft);

  const bannerRight = createRoyalBannerMesh();
  bannerRight.position.set(4.5, 7.5, 1.8);
  gatePortalGroup.add(bannerRight);

  wallsGroup.add(gatePortalGroup);

  // Gate Interactivity: Review Outlying Realm & Caravans
  collision.addInteractable({
    id: 'south_gate',
    name: 'Bab al-Ayaan (Grand Imperial Gate)',
    prompt: '[E] Survey Caravan Routes & Missions',
    x: 0,
    z: 44,
    radius: 4.5,
    actionType: 'missions',
  });

  // 11. NPC CITIZENS IDLING IN PLAZA
  const citizenGroup = new THREE.Group();
  const citizenData = [
    { x: -5, z: 9, rot: 1.2, color: 0x854d0e },
    { x: 5, z: 10, rot: -0.9, color: 0x155e75 },
    { x: -14, z: 15, rot: 2.1, color: 0x3f3f46 },
    { x: 12, z: 18, rot: -1.7, color: 0x713f12 },
    { x: 0, z: -14, rot: 0.1, color: 0x14532d },
  ];
  citizenData.forEach((c) => {
    const cit = createCitizenMesh(c.color);
    cit.position.set(c.x, 0, c.z);
    cit.rotation.y = c.rot;
    citizenGroup.add(cit);
    collision.addCylinder(c.x, c.z, 0.4);
  });
  cityGroup.add(citizenGroup);

  // Animation Update function
  const animatedMeshes = {
    update: (time: number, dt: number) => {
      // 1. Water ripple & fountain droplets
      for (let i = 0; i < droplets.length; i++) {
        const angle = (i / droplets.length) * Math.PI * 2 + time * 0.4;
        const progress = (time * 2.2 + i * 0.35) % 1;
        const r = 0.3 + progress * 2.2;
        const y = 2.45 + Math.sin(progress * Math.PI) * 1.1 - progress * 1.5;
        droplets[i].position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      }

      // 2. Torch braziers flicker
      braziers.forEach((b, idx) => {
        const scale = 1.0 + Math.sin(time * 12 + idx * 3) * 0.15;
        b.scale.set(scale, scale * (1 + Math.cos(time * 14) * 0.1), scale);
      });
    },
  };

  return {
    group: cityGroup,
    animatedMeshes,
  };
}

/**
 * Creates an Advisor NPC mesh in distinctive royal attire
 */
function createAdvisorNpcMesh(robeColor: number, accentColor: number, name: string): THREE.Group {
  const g = new THREE.Group();

  const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.7 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.4, metalness: 0.3 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc4936d, roughness: 0.6 });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.3, 10), robeMat);
  body.position.y = 0.65;
  body.castShadow = true;
  g.add(body);

  // Sash
  const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.14, 10), accentMat);
  sash.position.y = 0.65;
  g.add(sash);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), skinMat);
  head.position.y = 1.45;
  head.castShadow = true;
  g.add(head);

  // Turban
  const turban = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), accentMat);
  turban.scale.set(1.15, 0.8, 1.15);
  turban.position.set(0, 1.58, -0.02);
  turban.castShadow = true;
  g.add(turban);

  return g;
}

/**
 * Creates a Market Stall with striped fabric awning and merchandise
 */
function createMarketStall(
  awningColor: number,
  woodMat: THREE.Material,
  counterMat: THREE.Material
): THREE.Group {
  const g = new THREE.Group();

  // Wooden counter table
  const counter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.85, 1.6), counterMat);
  counter.position.y = 0.42;
  counter.castShadow = true;
  counter.receiveShadow = true;
  g.add(counter);

  // 4 corner timber posts
  const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6);
  const postCoords = [
    [-1.7, -0.7], [1.7, -0.7],
    [-1.7, 0.7], [1.7, 0.7],
  ];
  for (const [px, pz] of postCoords) {
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.set(px, 1.4, pz);
    post.castShadow = true;
    g.add(post);
  }

  // Slanted Canopy Awning
  const awningGeo = new THREE.BoxGeometry(3.9, 0.12, 2.2);
  const awningMat = new THREE.MeshStandardMaterial({
    color: awningColor,
    roughness: 0.8,
  });
  const awning = new THREE.Mesh(awningGeo, awningMat);
  awning.position.set(0, 2.8, 0);
  awning.rotation.x = 0.18;
  awning.castShadow = true;
  g.add(awning);

  // Goods on counter (urns and crates)
  const jarGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.45, 8);
  const jarMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
  const jar1 = new THREE.Mesh(jarGeo, jarMat);
  jar1.position.set(-1.1, 1.05, 0);
  g.add(jar1);

  const jar2 = new THREE.Mesh(jarGeo, jarMat);
  jar2.position.set(-0.7, 1.05, 0.2);
  g.add(jar2);

  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.55), woodMat);
  crate.position.set(0.9, 1.02, 0);
  g.add(crate);

  return g;
}

/**
 * Creates an Islamic medieval sandstone house with flat roof & mashrabiya windows
 */
function createSandstoneHouse(
  w: number,
  h: number,
  d: number,
  colorHex: number,
  mashrabiyaTex: THREE.Texture,
  woodMat: THREE.Material
): THREE.Group {
  const g = new THREE.Group();

  const houseMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.9,
    metalness: 0.05,
  });

  // Main block
  const houseMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), houseMat);
  houseMesh.position.y = h / 2;
  houseMesh.castShadow = true;
  houseMesh.receiveShadow = true;
  g.add(houseMesh);

  // Roof Parapet / Battlements
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.65, d + 0.3), houseMat);
  parapet.position.y = h + 0.32;
  g.add(parapet);

  // Wooden Arched Entrance Door
  const doorGeo = new THREE.BoxGeometry(1.6, 2.5, 0.2);
  const door = new THREE.Mesh(doorGeo, woodMat);
  door.position.set(0, 1.25, d / 2 + 0.05);
  g.add(door);

  // Mashrabiya Window Bay (Projecting wooden lattice)
  const windowBayGeo = new THREE.BoxGeometry(2.4, 1.8, 0.8);
  const windowMat = new THREE.MeshStandardMaterial({
    map: mashrabiyaTex,
    roughness: 0.75,
  });
  const windowBay = new THREE.Mesh(windowBayGeo, windowMat);
  windowBay.position.set(0, h * 0.65, d / 2 + 0.35);
  windowBay.castShadow = true;
  g.add(windowBay);

  return g;
}

/**
 * Creates an authentic Date Palm Tree with ringed trunk and lush crown
 */
function createDatePalmTree(woodMat: THREE.Material): THREE.Group {
  const g = new THREE.Group();

  // Curved Trunk using segmented cylinders
  const trunkSegments = 7;
  let currY = 0;
  let currX = 0;
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x6e4b2d,
    roughness: 0.92,
  });

  for (let i = 0; i < trunkSegments; i++) {
    const segH = 0.95;
    const rTop = 0.26 - i * 0.015;
    const rBot = 0.3 - i * 0.015;
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, segH, 8), trunkMat);
    seg.position.set(currX, currY + segH / 2, 0);
    seg.rotation.z = i * 0.035; // gentle curve
    seg.castShadow = true;
    g.add(seg);

    currY += segH;
    currX += 0.08;
  }

  // Date Palm Fronds (Lush arched emerald fans)
  const frondCount = 10;
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x226b38,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });

  const frondGeo = new THREE.PlaneGeometry(0.8, 3.4);
  frondGeo.translate(0, 1.7, 0);

  for (let i = 0; i < frondCount; i++) {
    const angle = (i / frondCount) * Math.PI * 2;
    const frond = new THREE.Mesh(frondGeo, frondMat);
    frond.position.set(currX, currY - 0.2, 0);
    frond.rotation.y = angle;
    frond.rotation.x = 0.75 + (i % 2) * 0.2; // drooping arch
    frond.castShadow = true;
    g.add(frond);
  }

  return g;
}

/**
 * Creates a conical Cypress tree
 */
function createCypressTree(): THREE.Group {
  const g = new THREE.Group();
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1a4529, roughness: 0.85 });

  const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.5, 8), foliageMat);
  cone1.position.y = 2.2;
  cone1.castShadow = true;
  g.add(cone1);

  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.8, 8), foliageMat);
  cone2.position.y = 3.6;
  cone2.castShadow = true;
  g.add(cone2);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.9, 6),
    new THREE.MeshStandardMaterial({ color: 0x4a3319 })
  );
  trunk.position.y = 0.45;
  g.add(trunk);

  return g;
}

/**
 * Creates a Fortified Watchtower with battlements
 */
function createWatchtower(wallMat: THREE.Material, roofMat: THREE.Material): THREE.Group {
  const g = new THREE.Group();

  const towerBody = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.6, 12, 12), wallMat);
  towerBody.position.y = 6;
  towerBody.castShadow = true;
  towerBody.receiveShadow = true;
  g.add(towerBody);

  const battlement = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.4, 1.4, 12), wallMat);
  battlement.position.y = 12.5;
  battlement.castShadow = true;
  g.add(battlement);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), roofMat);
  dome.scale.set(1, 1.4, 1);
  dome.position.y = 13.2;
  dome.castShadow = true;
  g.add(dome);

  return g;
}

/**
 * Helper to build a defensive stone wall segment with crenellations
 */
function buildWallSegment(
  parent: THREE.Group,
  x: number,
  z: number,
  length: number,
  height: number,
  thickness: number,
  rotY: number,
  mat: THREE.Material
) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(length, height, thickness), mat);
  wall.position.set(x, height / 2, z);
  wall.rotation.y = rotY;
  wall.castShadow = true;
  wall.receiveShadow = true;
  parent.add(wall);

  // Parapet rim
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(length, 0.8, thickness + 0.4), mat);
  parapet.position.set(x, height + 0.4, z);
  parapet.rotation.y = rotY;
  parent.add(parapet);
}

/**
 * Creates an Imperial Royal Silk Banner Standard with Sultanate Crescent
 */
function createRoyalBannerMesh(): THREE.Group {
  const g = new THREE.Group();

  const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
  const bannerMat = new THREE.MeshStandardMaterial({
    color: 0x145a32,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.5, 8), poleMat);
  g.add(pole);

  const bannerPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.8), bannerMat);
  bannerPlane.position.set(0.85, -0.6, 0);
  g.add(bannerPlane);

  return g;
}

/**
 * Creates a simple citizen NPC mesh in medieval robes
 */
function createCitizenMesh(robeColor: number): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.8 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xb58055, roughness: 0.6 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 1.25, 8), mat);
  body.position.y = 0.62;
  body.castShadow = true;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), skin);
  head.position.y = 1.35;
  g.add(head);

  const turban = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), mat);
  turban.scale.set(1.1, 0.75, 1.1);
  turban.position.y = 1.46;
  g.add(turban);

  return g;
}
