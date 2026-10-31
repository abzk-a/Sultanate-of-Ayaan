import * as THREE from 'three';

export interface PlayerCharacter {
  group: THREE.Group;
  update: (dt: number, isMoving: boolean, isRunning: boolean, moveSpeed: number) => void;
  playStepSound: () => void;
}

export function createSultanCharacter(): PlayerCharacter {
  const root = new THREE.Group();

  // Materials with varying roughness and metalness
  const emeraldRobeMat = new THREE.MeshStandardMaterial({
    color: 0x175c38,
    roughness: 0.65,
    metalness: 0.1,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  });

  const creamTurbanMat = new THREE.MeshStandardMaterial({
    color: 0xf4eedb,
    roughness: 0.75,
    metalness: 0.05,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xbe8c63,
    roughness: 0.55,
    metalness: 0.0,
  });

  const darkLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x24180f,
    roughness: 0.5,
    metalness: 0.2,
  });

  const rubyJewelMat = new THREE.MeshStandardMaterial({
    color: 0x108044, // Royal Emerald
    roughness: 0.1,
    metalness: 0.9,
  });

  // 1. Contact shadow disc (CircleGeometry at floorY + 0.015)
  const shadowGeo = new THREE.CircleGeometry(0.55, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x0a0705,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.015;
  root.add(shadowMesh);

  // 2. Torso and Pelvis Group
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.y = 0.95;
  root.add(pelvisGroup);

  // Torso (Main Royal Tunic)
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.65, 12);
  const torsoMesh = new THREE.Mesh(torsoGeo, emeraldRobeMat);
  torsoMesh.position.y = 0.32;
  torsoMesh.castShadow = true;
  pelvisGroup.add(torsoMesh);

  // Gold Collar & Trim
  const collarGeo = new THREE.TorusGeometry(0.18, 0.035, 8, 16);
  const collarMesh = new THREE.Mesh(collarGeo, goldTrimMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 0.64;
  pelvisGroup.add(collarMesh);

  // Gold Waist Sash / Belt
  const beltGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.12, 14);
  const beltMesh = new THREE.Mesh(beltGeo, goldTrimMat);
  beltMesh.position.y = 0.05;
  beltMesh.castShadow = true;
  pelvisGroup.add(beltMesh);

  // Flowing Royal Robe Lower Kaftan
  const kaftanGeo = new THREE.ConeGeometry(0.38, 0.55, 12, 1, true);
  const kaftanMesh = new THREE.Mesh(kaftanGeo, emeraldRobeMat);
  kaftanMesh.rotation.x = Math.PI;
  kaftanMesh.position.y = -0.15;
  kaftanMesh.castShadow = true;
  pelvisGroup.add(kaftanMesh);

  // 3. Head & Royal Turban
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.75;
  pelvisGroup.add(headGroup);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.12, 10);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.y = -0.05;
  headGroup.add(neckMesh);

  // Face
  const faceGeo = new THREE.SphereGeometry(0.16, 14, 14);
  faceGeo.scale(1, 1.15, 0.95);
  const faceMesh = new THREE.Mesh(faceGeo, skinMat);
  faceMesh.position.y = 0.08;
  faceMesh.castShadow = true;
  headGroup.add(faceMesh);

  // Royal Beard (Trimmed black/dark brown)
  const beardGeo = new THREE.ConeGeometry(0.14, 0.18, 8);
  const beardMesh = new THREE.Mesh(beardGeo, darkLeatherMat);
  beardMesh.position.set(0, 0.02, 0.1);
  beardMesh.rotation.x = 0.3;
  headGroup.add(beardMesh);

  // Grand Imperial Turban
  const turbanBaseGeo = new THREE.SphereGeometry(0.25, 16, 12);
  turbanBaseGeo.scale(1.15, 0.9, 1.1);
  const turbanMesh = new THREE.Mesh(turbanBaseGeo, creamTurbanMat);
  turbanMesh.position.set(0, 0.2, -0.02);
  turbanMesh.castShadow = true;
  headGroup.add(turbanMesh);

  // Golden Turban Brooch & Emerald Jewel
  const broochGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10);
  const broochMesh = new THREE.Mesh(broochGeo, goldTrimMat);
  broochMesh.rotation.x = Math.PI / 2;
  broochMesh.position.set(0, 0.22, 0.24);
  headGroup.add(broochMesh);

  const jewelGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const jewelMesh = new THREE.Mesh(jewelGeo, rubyJewelMat);
  jewelMesh.position.set(0, 0.22, 0.255);
  headGroup.add(jewelMesh);

  // 4. Arms
  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(0.32, 0.58, 0);
  pelvisGroup.add(leftArmGroup);

  const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.38, 8);
  const leftArmMesh = new THREE.Mesh(armGeo, emeraldRobeMat);
  leftArmMesh.position.y = -0.19;
  leftArmMesh.castShadow = true;
  leftArmGroup.add(leftArmMesh);

  const handGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const leftHandMesh = new THREE.Mesh(handGeo, skinMat);
  leftHandMesh.position.y = -0.4;
  leftArmGroup.add(leftHandMesh);

  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(-0.32, 0.58, 0);
  pelvisGroup.add(rightArmGroup);

  const rightArmMesh = new THREE.Mesh(armGeo, emeraldRobeMat);
  rightArmMesh.position.y = -0.19;
  rightArmMesh.castShadow = true;
  rightArmGroup.add(rightArmMesh);

  const rightHandMesh = new THREE.Mesh(handGeo, skinMat);
  rightHandMesh.position.y = -0.4;
  rightArmGroup.add(rightHandMesh);

  // 5. Ceremonial Scimitar at Left Hip
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0.3, 0.05, 0.05);
  swordGroup.rotation.set(0.3, 0.2, -0.4);
  pelvisGroup.add(swordGroup);

  // Scabbard (Curved)
  const scabbardGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.65, 8);
  const scabbardMesh = new THREE.Mesh(scabbardGeo, goldTrimMat);
  scabbardMesh.position.y = -0.28;
  scabbardMesh.castShadow = true;
  swordGroup.add(scabbardMesh);

  // Hilt and Guard
  const hiltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 6);
  const hiltMesh = new THREE.Mesh(hiltGeo, darkLeatherMat);
  hiltMesh.position.y = 0.1;
  swordGroup.add(hiltMesh);

  const pommelGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const pommelMesh = new THREE.Mesh(pommelGeo, goldTrimMat);
  pommelMesh.position.y = 0.2;
  swordGroup.add(pommelMesh);

  // 6. Legs
  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(0.14, 0, 0);
  pelvisGroup.add(leftLegGroup);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.55, 8);
  const leftLegMesh = new THREE.Mesh(legGeo, emeraldRobeMat);
  leftLegMesh.position.y = -0.28;
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);

  const bootGeo = new THREE.BoxGeometry(0.12, 0.14, 0.26);
  const leftBootMesh = new THREE.Mesh(bootGeo, darkLeatherMat);
  leftBootMesh.position.set(0, -0.58, 0.04);
  leftBootMesh.castShadow = true;
  leftLegGroup.add(leftBootMesh);

  // Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(-0.14, 0, 0);
  pelvisGroup.add(rightLegGroup);

  const rightLegMesh = new THREE.Mesh(legGeo, emeraldRobeMat);
  rightLegMesh.position.y = -0.28;
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);

  const rightBootMesh = new THREE.Mesh(bootGeo, darkLeatherMat);
  rightBootMesh.position.set(0, -0.58, 0.04);
  rightBootMesh.castShadow = true;
  rightLegGroup.add(rightBootMesh);

  // Animation cycle variables
  let walkPhase = 0;
  let idleTime = 0;

  const update = (dt: number, isMoving: boolean, isRunning: boolean, moveSpeed: number) => {
    idleTime += dt;

    if (isMoving) {
      const freq = isRunning ? 11 : 7;
      walkPhase += dt * freq;

      const legAngle = Math.sin(walkPhase) * (isRunning ? 0.65 : 0.45);
      const armAngle = -legAngle * 0.75;

      leftLegGroup.rotation.x = legAngle;
      rightLegGroup.rotation.x = -legAngle;

      leftArmGroup.rotation.x = armAngle;
      rightArmGroup.rotation.x = -armAngle;

      // Vertical bounce
      pelvisGroup.position.y = 0.95 + Math.abs(Math.sin(walkPhase * 2)) * (isRunning ? 0.08 : 0.04);
      // Torso tilt
      torsoMesh.rotation.x = isRunning ? 0.12 : 0.04;
      torsoMesh.rotation.y = Math.sin(walkPhase) * 0.06;
      headGroup.rotation.y = -Math.sin(walkPhase) * 0.05;
      kaftanMesh.rotation.z = Math.sin(walkPhase) * 0.08;
    } else {
      // Idle breathing and relaxed pose
      walkPhase = 0;
      const breath = Math.sin(idleTime * 2.2) * 0.02;
      pelvisGroup.position.y = 0.95 + breath;
      headGroup.position.y = 0.75 + breath * 0.5;
      headGroup.rotation.y = Math.sin(idleTime * 0.8) * 0.08;

      leftLegGroup.rotation.x = THREE.MathUtils.damp(leftLegGroup.rotation.x, 0, 8, dt);
      rightLegGroup.rotation.x = THREE.MathUtils.damp(rightLegGroup.rotation.x, 0, 8, dt);
      leftArmGroup.rotation.x = THREE.MathUtils.damp(leftArmGroup.rotation.x, 0, 8, dt);
      rightArmGroup.rotation.x = THREE.MathUtils.damp(rightArmGroup.rotation.x, 0, 8, dt);
      torsoMesh.rotation.x = THREE.MathUtils.damp(torsoMesh.rotation.x, 0, 8, dt);
      torsoMesh.rotation.y = THREE.MathUtils.damp(torsoMesh.rotation.y, 0, 8, dt);
    }
  };

  return {
    group: root,
    update,
    playStepSound: () => {},
  };
}
