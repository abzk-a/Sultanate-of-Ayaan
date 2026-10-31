import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../audio/soundSystem';

interface MobileControlsProps {
  joystickVectorRef: React.MutableRefObject<{ x: number; y: number }>;
  isSprintingRef: React.MutableRefObject<boolean>;
  onTriggerInteract: () => void;
  onOpenLedger: () => void;
  hasInteractable: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  joystickVectorRef,
  isSprintingRef,
  onTriggerInteract,
  onOpenLedger,
  hasInteractable,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);

  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        joystickVectorRef.current = { x: 0, y: 0 };
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2 - 10;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      joystickVectorRef.current = {
        x: dx / maxRadius,
        y: dy / maxRadius,
      };
    } else {
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * maxRadius;
      const clampedY = Math.sin(angle) * maxRadius;
      setKnobPos({ x: clampedX, y: clampedY });
      joystickVectorRef.current = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    }
  };

  const toggleSprint = () => {
    const next = !isSprinting;
    setIsSprinting(next);
    isSprintingRef.current = next;
    sound.playClick();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-4 pb-20 sm:hidden select-none">
      {/* Virtual Joystick (Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-stone-900/60 border-2 border-[#d4af37]/60 pointer-events-auto relative flex items-center justify-center touch-none shadow-lg"
      >
        <div
          className="w-12 h-12 rounded-full bg-[#14532d] border-2 border-[#d4af37] absolute shadow-md transition-transform"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex flex-col gap-2 pointer-events-auto items-end">
        {/* Interact Button */}
        {hasInteractable && (
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              sound.playClick();
              onTriggerInteract();
            }}
            className="w-14 h-14 rounded-full bg-[#14532d] border-2 border-[#d4af37] text-[#fef9c3] font-serif font-bold text-sm shadow-xl flex items-center justify-center cursor-pointer animate-pulse"
          >
            E
          </button>
        )}

        {/* Sprint Toggle */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            toggleSprint();
          }}
          className={`w-12 h-12 rounded-full border text-xs font-mono font-bold flex items-center justify-center shadow-md cursor-pointer transition-colors ${
            isSprinting
              ? 'bg-amber-600 border-amber-300 text-stone-950 font-bold'
              : 'bg-stone-900/70 border-stone-600 text-stone-300'
          }`}
        >
          RUN
        </button>

        {/* Ledger Quick Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            sound.playClick();
            onOpenLedger();
          }}
          className="w-12 h-12 rounded-full bg-[#241a12]/80 border border-[#d4af37]/60 text-[#fde047] text-xs font-serif flex items-center justify-center shadow-md cursor-pointer"
        >
          📜
        </button>
      </div>
    </div>
  );
};
