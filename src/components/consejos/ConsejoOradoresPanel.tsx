'use client';

import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import {
  ConsejoAsistenciaItem,
  ConsejoRealtimeHand,
  ConsejoRealtimeSpeaker,
} from '@/types/consejos';

interface ConsejoOradoresPanelProps {
  isConnected: boolean;
  isModerator: boolean;
  canRaiseHand: boolean;
  hasRaisedHand: boolean;
  speakers: ConsejoRealtimeSpeaker[];
  raisedHands: ConsejoRealtimeHand[];
  currentModeradorName: string | null;
  onRaiseHand: () => void;
  onCancelRaiseHand: () => void;
  onAddSpeaker: (memberId: number) => void;
  onRemoveSpeaker: (memberId: number) => void;
  onReorderSpeakers: (memberIds: number[]) => void;
  attendance: ConsejoAsistenciaItem[];
}

const resolveAttendanceDescription = (
  attendance: ConsejoAsistenciaItem[],
  memberId: number,
) => attendance.find((item) => item.Miembro.id === memberId)?.descripcion ?? '';

export function ConsejoOradoresPanel({
  isConnected,
  isModerator,
  canRaiseHand,
  hasRaisedHand,
  speakers,
  raisedHands,
  currentModeradorName,
  onRaiseHand,
  onCancelRaiseHand,
  onAddSpeaker,
  onRemoveSpeaker,
  onReorderSpeakers,
  attendance,
}: ConsejoOradoresPanelProps) {
  const panelOffsetRef = useRef({ x: 0, y: 0 });
  const [selectedAttendanceMemberId, setSelectedAttendanceMemberId] = useState<
    number | null
  >(null);
  const [draggingSpeakerId, setDraggingSpeakerId] = useState<number | null>(null);
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
  const [canDesktopInteract, setCanDesktopInteract] = useState(false);

  const availableAttendanceOptions = useMemo(() => {
    const speakerIds = new Set(speakers.map((item) => item.memberId));

    return attendance
      .filter((item) => !speakerIds.has(item.Miembro.id))
      .map((item) => ({
        label: `${item.Miembro.apellidos}, ${item.Miembro.nombre}`,
        value: item.Miembro.id,
        description: item.descripcion,
      }));
  }, [attendance, speakers]);

  const normalizedSelectedAttendanceMemberId = availableAttendanceOptions.some(
    (item) => item.value === selectedAttendanceMemberId,
  )
    ? selectedAttendanceMemberId
    : null;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncViewport = () => {
      setCanDesktopInteract(window.matchMedia('(pointer: fine)').matches);
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  useEffect(() => {
    panelOffsetRef.current = panelOffset;
  }, [panelOffset]);

  const handleSpeakerDrop = (targetMemberId: number) => {
    if (!isModerator || draggingSpeakerId === null || draggingSpeakerId === targetMemberId) {
      return;
    }

    const sourceIndex = speakers.findIndex(
      (speaker) => speaker.memberId === draggingSpeakerId,
    );
    const targetIndex = speakers.findIndex(
      (speaker) => speaker.memberId === targetMemberId,
    );

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    const reordered = [...speakers];
    const [movedSpeaker] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedSpeaker);
    onReorderSpeakers(reordered.map((speaker) => speaker.memberId));
    setDraggingSpeakerId(null);
  };

  const handlePanelPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!canDesktopInteract) {
      return;
    }

    const originX = event.clientX;
    const originY = event.clientY;
    const startX = panelOffsetRef.current.x;
    const startY = panelOffsetRef.current.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      setPanelOffset({
        x: startX + (moveEvent.clientX - originX),
        y: startY + (moveEvent.clientY - originY),
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-20 w-[calc(100vw-2rem)] max-w-sm"
      style={
        canDesktopInteract
          ? {
              transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`,
            }
          : undefined
      }
    >
      <div
        className="overflow-auto"
        style={
          canDesktopInteract
            ? {
                minWidth: '20rem',
                minHeight: '20rem',
                resize: 'both',
              }
            : undefined
        }
      >
        <Card>
          <div
            onPointerDown={handlePanelPointerDown}
            className={
              canDesktopInteract
                ? 'mb-3 cursor-move select-none font-semibold'
                : 'mb-3 font-semibold'
            }
            style={canDesktopInteract ? { touchAction: 'none' } : undefined}
          >
            Lista de oradores
          </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm text-color-secondary">
            {isConnected
              ? `Conectado al consejo${currentModeradorName ? ` · Moderador: ${currentModeradorName}` : ''}`
              : 'Conectando al consejo...'}
          </div>

          {isModerator ? null : (
            <div className="flex justify-end">
              {hasRaisedHand ? (
                <Button
                  type="button"
                  label="Bajar la mano"
                  icon="pi pi-minus-circle"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={onCancelRaiseHand}
                  disabled={!canRaiseHand}
                />
              ) : (
                <Button
                  type="button"
                  label="Levantar la mano"
                  icon="pi pi-arrow-up"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={onRaiseHand}
                  disabled={!canRaiseHand}
                />
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="font-semibold">Oradores</div>
            {speakers.length === 0 ? (
              <div className="text-sm text-color-secondary">
                No hay oradores cargados.
              </div>
            ) : (
              speakers.map((speaker, index) => (
                <div
                  key={speaker.memberId}
                  draggable={isModerator}
                  onDragStart={() => setDraggingSpeakerId(speaker.memberId)}
                  onDragEnd={() => setDraggingSpeakerId(null)}
                  onDragOver={(event) => {
                    if (isModerator) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={() => handleSpeakerDrop(speaker.memberId)}
                  className="flex items-start justify-between gap-2 rounded border px-3 py-2"
                >
                  <div>
                    <div className="font-medium">
                      {speakers.length - index}. {speaker.fullName}
                    </div>
                    <div className="text-sm text-color-secondary">
                      {speaker.description ||
                        resolveAttendanceDescription(attendance, speaker.memberId)}
                    </div>
                  </div>
                  {isModerator ? (
                    <Button
                      type="button"
                      icon="pi pi-times"
                      outlined
                      size="small"
                      aria-label={`Quitar a ${speaker.fullName}`}
                      onClick={() => onRemoveSpeaker(speaker.memberId)}
                    />
                  ) : null}
                </div>
              ))
            )}
          </div>

          {isModerator ? (
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Manos levantadas</div>
              {raisedHands.length === 0 ? (
                <div className="text-sm text-color-secondary">
                  No hay manos levantadas en este momento.
                </div>
              ) : (
                raisedHands.map((hand) => (
                  <div
                    key={hand.memberId}
                    className="flex items-start justify-between gap-2 rounded border px-3 py-2"
                  >
                    <div>
                      <div className="font-medium">{hand.fullName}</div>
                      <div className="text-sm text-color-secondary">
                        {hand.description ||
                          resolveAttendanceDescription(attendance, hand.memberId)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      label="Agregar"
                      icon="pi pi-plus"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => onAddSpeaker(hand.memberId)}
                    />
                  </div>
                ))
              )}
            </div>
          ) : null}

          {isModerator ? (
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Agregar desde asistencia</div>
              {availableAttendanceOptions.length === 0 ? (
                <div className="text-sm text-color-secondary">
                  No hay asistentes disponibles para sumar como oradores.
                </div>
              ) : (
                <>
                  <Dropdown
                    value={normalizedSelectedAttendanceMemberId}
                    options={availableAttendanceOptions}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(event: DropdownChangeEvent) =>
                      setSelectedAttendanceMemberId(
                        (event.value as number | null) ?? null,
                      )
                    }
                    placeholder="Seleccionar asistente"
                    filter
                    className="w-full"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      label="Agregar orador"
                      icon="pi pi-plus"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => {
                        if (normalizedSelectedAttendanceMemberId === null) {
                          return;
                        }

                        onAddSpeaker(normalizedSelectedAttendanceMemberId);
                        setSelectedAttendanceMemberId(null);
                      }}
                      disabled={normalizedSelectedAttendanceMemberId === null}
                    />
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
        </Card>
      </div>
    </div>
  );
}
