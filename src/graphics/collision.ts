export interface BoxCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface CylinderCollider {
  x: number;
  z: number;
  radius: number;
}

export interface InteractableZone {
  id: string;
  name: string;
  prompt: string;
  x: number;
  z: number;
  radius: number;
  actionType: 'court' | 'management' | 'fountain' | 'souk' | 'missions';
}

export class CollisionSystem {
  private boxes: BoxCollider[] = [];
  private cylinders: CylinderCollider[] = [];
  private interactables: InteractableZone[] = [];
  public worldRadius: number = 72;

  public addBox(minX: number, maxX: number, minZ: number, maxZ: number) {
    this.boxes.push({ minX, maxX, minZ, maxZ });
  }

  public addCylinder(x: number, z: number, radius: number) {
    this.cylinders.push({ x, z, radius });
  }

  public addInteractable(zone: InteractableZone) {
    this.interactables.push(zone);
  }

  public getInteractables(): InteractableZone[] {
    return this.interactables;
  }

  public checkPlayerCollision(x: number, z: number, playerRadius: number = 0.45): { x: number; z: number } {
    let newX = x;
    let newZ = z;

    // 1. World perimeter boundary
    const distSq = newX * newX + newZ * newZ;
    const maxR = this.worldRadius - playerRadius;
    if (distSq > maxR * maxR) {
      const angle = Math.atan2(newZ, newX);
      newX = Math.cos(angle) * maxR;
      newZ = Math.sin(angle) * maxR;
    }

    // 2. Box colliders
    for (const b of this.boxes) {
      // Check if player circle overlaps AABB expanded by playerRadius
      if (
        newX + playerRadius > b.minX &&
        newX - playerRadius < b.maxX &&
        newZ + playerRadius > b.minZ &&
        newZ - playerRadius < b.maxZ
      ) {
        // Resolve along smallest penetration axis
        const pushLeft = b.minX - (newX + playerRadius);
        const pushRight = b.maxX - (newX - playerRadius);
        const pushTop = b.minZ - (newZ + playerRadius);
        const pushBottom = b.maxZ - (newZ - playerRadius);

        const absL = Math.abs(pushLeft);
        const absR = Math.abs(pushRight);
        const absT = Math.abs(pushTop);
        const absB = Math.abs(pushBottom);

        const minPush = Math.min(absL, absR, absT, absB);
        if (minPush === absL) newX += pushLeft;
        else if (minPush === absR) newX += pushRight;
        else if (minPush === absT) newZ += pushTop;
        else newZ += pushBottom;
      }
    }

    // 3. Cylinder colliders
    for (const c of this.cylinders) {
      const dx = newX - c.x;
      const dz = newZ - c.z;
      const minDist = c.radius + playerRadius;
      const dSq = dx * dx + dz * dz;

      if (dSq < minDist * minDist) {
        const d = Math.sqrt(dSq) || 0.001;
        const overlap = minDist - d;
        newX += (dx / d) * overlap;
        newZ += (dz / d) * overlap;
      }
    }

    return { x: newX, z: newZ };
  }

  public findNearestInteractable(x: number, z: number): InteractableZone | null {
    let nearest: InteractableZone | null = null;
    let minDistSq = Infinity;

    for (const item of this.interactables) {
      const dx = x - item.x;
      const dz = z - item.z;
      const distSq = dx * dx + dz * dz;
      if (distSq <= item.radius * item.radius && distSq < minDistSq) {
        minDistSq = distSq;
        nearest = item;
      }
    }

    return nearest;
  }
}
