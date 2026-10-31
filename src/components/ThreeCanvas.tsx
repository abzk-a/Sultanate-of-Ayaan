import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildCapitalCity } from '../graphics/cityBuilder';
import { createSultanCharacter, PlayerCharacter } from '../graphics/playerCharacter';
import { CollisionSystem, InteractableZone } from '../graphics/collision';
import { sound } from '../audio/soundSystem';
import { GraphicsQuality } from '../types/game';

interface ThreeCanvasProps {
  gameState: 'title' | 'playing' | 'paused' | 'gameover';
  cameraMode: 'follow' | 'panoramic' | 'tactical';
  graphicsQuality: GraphicsQuality;
  onInteractableChange: (zone: InteractableZone | null) => void;
  onOpenInteractable: (zone: InteractableZone) => void;
  joystickVectorRef: React.MutableRefObject<{ x: number; y: number }>;
  isSprintingRef: React.MutableRefObject<boolean>;
  onStaminaChange?: (stamina: number) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  gameState,
  cameraMode,
  graphicsQuality,
  onInteractableChange,
  onOpenInteractable,
  joystickVectorRef,
  isSprintingRef,
  onStaminaChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({
    gameState,
    cameraMode,
    graphicsQuality,
    onInteractableChange,
    onOpenInteractable,
    onStaminaChange,
  });

  callbacksRef.current = {
    gameState,
    cameraMode,
    graphicsQuality,
    onInteractableChange,
    onOpenInteractable,
    onStaminaChange,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Three.js Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl && callbacksRef.current.graphicsQuality !== 'low',
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const getPixelRatio = () => {
      if (isSoftwareGl) return 1;
      if (callbacksRef.current.graphicsQuality === 'low') return 1;
      if (callbacksRef.current.graphicsQuality === 'medium') return Math.min(window.devicePixelRatio, 1.5);
      return Math.min(window.devicePixelRatio, 2.0);
    };

    const initialWidth = container.clientWidth || window.innerWidth || 1440;
    const initialHeight = container.clientHeight || window.innerHeight || 900;

    renderer.setPixelRatio(getPixelRatio());
    renderer.setSize(initialWidth, initialHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';

    const enableShadows = !isSoftwareGl && callbacksRef.current.graphicsQuality !== 'low';
    renderer.shadowMap.enabled = enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene, Camera & Atmospheric Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xecd8be); // Desert golden dawn/day
    scene.fog = new THREE.FogExp2(0xecd8be, 0.012);

    const camera = new THREE.PerspectiveCamera(
      52,
      initialWidth / initialHeight,
      0.1,
      300
    );

    // Procedural Studio Environment for metallic reflections (gold domes, armor)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm Directional Sun Key Light
    const sunLight = new THREE.DirectionalLight(0xfff3db, 2.2);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = enableShadows;
    if (enableShadows) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 160;
      const d = 45;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    // Cool Hemisphere Fill Light (Sky / Desert Sand contrast)
    const hemiLight = new THREE.HemisphereLight(0xbfe0f7, 0xd4a76a, 0.95);
    scene.add(hemiLight);

    // Soft Ambient Fill Light
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.4);
    scene.add(ambientLight);

    // Palace Courtyard Point Light (Warm lantern glow)
    const palaceLantern = new THREE.PointLight(0xffb84d, 2.5, 25);
    palaceLantern.position.set(0, 5, -28);
    scene.add(palaceLantern);

    // 4. Build Capital City and Collision System
    const collision = new CollisionSystem();
    const city = buildCapitalCity(collision);
    scene.add(city.group);

    // 5. Create Sultan Character
    const player: PlayerCharacter = createSultanCharacter();
    // Spawn Sultan on the courtyard path facing the grand palace
    const playerPos = new THREE.Vector3(0, 0, 14);
    player.group.position.copy(playerPos);
    player.group.rotation.y = Math.PI; // Facing north toward the palace
    scene.add(player.group);

    // 6. Camera Orbit & Follow Variables
    // cameraYaw = 0 places camera behind player (+Z) looking toward North (-Z)
    let cameraYaw = 0;
    let cameraPitch = 0.18; // Flatter, cinematic elevation showing the palace facade and dome
    let currentCamTarget = new THREE.Vector3(0, 1.5, 14);
    let currentCamPos = new THREE.Vector3(0, 3.6, 22.5);

    // Player Movement & Stamina State
    let playerRot = Math.PI; // Facing North
    let stamina = 100;
    let lastStepTime = 0;

    // Input Tracking
    const keysPressed = new Set<string>();
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.code);

      // Handle interaction hotkey [E]
      if (e.code === 'KeyE') {
        const nearest = collision.findNearestInteractable(playerPos.x, playerPos.z);
        if (nearest) {
          sound.playClick();
          callbacksRef.current.onOpenInteractable(nearest);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
    };

    const onMouseDown = (e: MouseEvent) => {
      // Allow rotation when clicking outside HUD buttons
      if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
        isMouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      cameraYaw -= dx * 0.006;
      cameraPitch = Math.max(0.05, Math.min(1.2, cameraPitch + dy * 0.005));
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWindowBlur = () => {
      keysPressed.clear();
      isMouseDown = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onWindowBlur);

    // Touch controls for camera rotation when dragging right half of screen
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchLook = false;

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth * 0.45) {
          touchStartX = t.clientX;
          touchStartY = t.clientY;
          isTouchLook = true;
          break;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouchLook) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth * 0.4) {
          const dx = t.clientX - touchStartX;
          const dy = t.clientY - touchStartY;
          touchStartX = t.clientX;
          touchStartY = t.clientY;

          cameraYaw -= dx * 0.008;
          cameraPitch = Math.max(0.05, Math.min(1.2, cameraPitch + dy * 0.006));
          break;
        }
      }
    };

    const onTouchEnd = () => {
      isTouchLook = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(getPixelRatio());
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // 7. Main 60fps Simulation & Render Loop
    let lastTime = performance.now();
    let frameId = 0;
    let titleAngle = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 60);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      let pollCount = 0;
      const poll = () => {
        pollCount++;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED && pollCount < 10) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const currentGameState = callbacksRef.current.gameState;
      const currentCameraMode = callbacksRef.current.cameraMode;

      if (currentGameState === 'paused') {
        renderer.render(scene, camera);
        frameId = window.setTimeout(tick, 200);
        return;
      }

      // Update City Animations (Fountain water droplets, torch flame flicker)
      city.animatedMeshes.update(now * 0.001, dt);

      if (currentGameState === 'title') {
        // LIVE WORLD CAMERA TOUR on Title Screen
        titleAngle += dt * 0.2;
        const camX = Math.sin(titleAngle) * 38;
        const camZ = Math.cos(titleAngle) * 38 - 10;
        const camY = 16 + Math.sin(titleAngle * 0.6) * 4;

        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 3, -12); // Looking toward Grand Palace & Courtyard fountain

        player.update(dt, false, false, 0);
      } else if (currentGameState === 'playing' || currentGameState === 'paused') {
        let isMoving = false;
        let isRunning = false;
        let moveX = 0;
        let moveZ = 0;

        if (currentGameState === 'playing') {
          // Read Keyboard Inputs
          if (keysPressed.has('KeyW') || keysPressed.has('ArrowUp')) moveZ -= 1;
          if (keysPressed.has('KeyS') || keysPressed.has('ArrowDown')) moveZ += 1;
          if (keysPressed.has('KeyA') || keysPressed.has('ArrowLeft')) moveX -= 1;
          if (keysPressed.has('KeyD') || keysPressed.has('ArrowRight')) moveX += 1;

          // Virtual Joystick (Mobile)
          if (Math.abs(joystickVectorRef.current.x) > 0.1 || Math.abs(joystickVectorRef.current.y) > 0.1) {
            moveX = joystickVectorRef.current.x;
            moveZ = -joystickVectorRef.current.y;
          }

          const wantsRun = keysPressed.has('ShiftLeft') || keysPressed.has('ShiftRight') || isSprintingRef.current;
          if (wantsRun && stamina > 5 && (moveX !== 0 || moveZ !== 0)) {
            isRunning = true;
            stamina = Math.max(0, stamina - dt * 25);
          } else {
            isRunning = false;
            stamina = Math.min(100, stamina + dt * 18);
          }

          if (callbacksRef.current.onStaminaChange) {
            callbacksRef.current.onStaminaChange(stamina);
          }

          const inputLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
          if (inputLen > 0.05) {
            isMoving = true;
            // Normalize direction in camera space
            const normX = moveX / inputLen;
            const normZ = moveZ / inputLen;

            // Camera-relative forward and right vectors
            const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw)).normalize();
            const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw)).normalize();

            const worldDir = new THREE.Vector3()
              .addScaledVector(forward, -normZ)
              .addScaledVector(right, normX)
              .normalize();

            const baseSpeed = isRunning ? 9.5 : 4.8;
            const stepDist = baseSpeed * dt;

            const targetX = playerPos.x + worldDir.x * stepDist;
            const targetZ = playerPos.z + worldDir.z * stepDist;

            // Perform Collision Checking & Wall Sliding
            const resolved = collision.checkPlayerCollision(targetX, targetZ, 0.45);
            playerPos.x = resolved.x;
            playerPos.z = resolved.z;

            // Smooth Character Heading Rotation
            const targetAngle = Math.atan2(worldDir.x, worldDir.z);
            let angleDiff = targetAngle - playerRot;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            playerRot += angleDiff * Math.min(1, dt * 14);

            // Footstep audio on sandstone
            if (now - lastStepTime > (isRunning ? 260 : 420)) {
              sound.playFootstep(isRunning);
              lastStepTime = now;
            }
          }

          // Check for nearby interactable zones
          const nearZone = collision.findNearestInteractable(playerPos.x, playerPos.z);
          callbacksRef.current.onInteractableChange(nearZone);
        }

        // Apply Position & Rotation to Sultan mesh
        player.group.position.set(playerPos.x, 0, playerPos.z);
        player.group.rotation.y = playerRot;
        player.update(dt, isMoving, isRunning, isRunning ? 9.5 : 4.8);

        // 8. Dynamic Camera Positioning based on Camera Mode
        const targetAnchor = new THREE.Vector3(playerPos.x, playerPos.y + 1.4, playerPos.z);
        currentCamTarget.lerp(targetAnchor, 1 - Math.exp(-12 * dt));

        if (currentCameraMode === 'panoramic') {
          // Elevated overview of the palace and courtyard
          const panoPos = new THREE.Vector3(0, 18, 30);
          currentCamPos.lerp(panoPos, 1 - Math.exp(-6 * dt));
          camera.position.copy(currentCamPos);
          camera.lookAt(0, 4, -10);
        } else if (currentCameraMode === 'tactical') {
          // Top-down tactical drone view
          const topPos = new THREE.Vector3(playerPos.x, 24, playerPos.z + 4);
          currentCamPos.lerp(topPos, 1 - Math.exp(-8 * dt));
          camera.position.copy(currentCamPos);
          camera.lookAt(playerPos.x, 0, playerPos.z);
        } else {
          // Standard Third-person follow camera with landmark-framing vista
          const camDist = 7.5;
          const desiredCamOffset = new THREE.Vector3(
            Math.sin(cameraYaw) * Math.cos(cameraPitch) * camDist,
            Math.sin(cameraPitch) * camDist + 1.8,
            Math.cos(cameraYaw) * Math.cos(cameraPitch) * camDist
          );

          const desiredPos = currentCamTarget.clone().add(desiredCamOffset);
          desiredPos.y = Math.max(0.8, desiredPos.y);

          currentCamPos.lerp(desiredPos, 1 - Math.exp(-14 * dt));
          camera.position.copy(currentCamPos);

          // Look ahead along view direction so Sultan is in bottom third and Palace vista frames above
          const lookTarget = currentCamTarget.clone().add(
            new THREE.Vector3(-Math.sin(cameraYaw) * 3.5, 0.5, -Math.cos(cameraYaw) * 3.5)
          );
          camera.lookAt(lookTarget);
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full select-none" />;
};
