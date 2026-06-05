'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';

export interface ResponsiveTableActionItem {
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast';
}

interface ActionGroupConfig {
  key: 'related' | 'special' | 'crud';
  label: string;
  icon: string;
  actions: ResponsiveTableActionItem[];
}

interface ResponsiveTableActionsProps {
  crudActions?: ResponsiveTableActionItem[];
  specialActions?: ResponsiveTableActionItem[];
  relatedActions?: ResponsiveTableActionItem[];
  filtersContent?: ReactNode;
  inlineFiltersMobile?: boolean;
  inlineActionsMobile?: boolean;
  breakpoint?: 'xxl' | 'xxla' | 'xxlb' | 'xxlc' | 'xxxl' | 'xxxxl';
  iconLimitBreakpoint?: 'sm' | 'icon-limit';
}

export function ResponsiveTableActions({
  crudActions = [],
  specialActions = [],
  relatedActions = [],
  filtersContent,
  inlineFiltersMobile = false,
  inlineActionsMobile = false,
  breakpoint = 'xxl',
  iconLimitBreakpoint = 'sm',
}: ResponsiveTableActionsProps) {
  const [openGroupKey, setOpenGroupKey] = useState<ActionGroupConfig['key'] | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const groups = useMemo<ActionGroupConfig[]>(
    () => {
      const baseGroups: ActionGroupConfig[] = [
        {
          key: 'related',
          label: 'Relacionadas',
          icon: 'pi pi-share-alt',
          actions: relatedActions,
        },
        {
          key: 'special',
          label: 'Especiales',
          icon: 'pi pi-sliders-h',
          actions: specialActions,
        },
        {
          key: 'crud',
          label: 'CRUD',
          icon: 'pi pi-pencil',
          actions: crudActions,
        },
      ];

      return baseGroups.filter((group) => group.actions.length > 0);
    },
    [crudActions, relatedActions, specialActions],
  );

  const activeGroup = groups.find((group) => group.key === openGroupKey) ?? null;

  const renderActionButtons = (actions: ResponsiveTableActionItem[]) =>
    actions.map((action) => (
      <Button
        key={`${action.label}-${action.icon}`}
        type="button"
        label={action.label}
        icon={action.icon}
        iconPos="right"
        outlined
        size="small"
        severity={action.severity}
        disabled={action.disabled}
        onClick={() => {
          action.onClick();
          setOpenGroupKey(null);
        }}
      />
    ));

  const desktopClass =
    breakpoint === 'xxxxl'
      ? 'hidden xxxxl:flex xxxxl:items-start xxxxl:justify-between xxxxl:gap-3'
      : breakpoint === 'xxxl'
      ? 'hidden xxxl:flex xxxl:items-start xxxl:justify-between xxxl:gap-3'
      : breakpoint === 'xxlc'
      ? 'hidden xxlc:flex xxlc:items-start xxlc:justify-between xxlc:gap-3'
      : breakpoint === 'xxlb'
      ? 'hidden xxlb:flex xxlb:items-start xxlb:justify-between xxlb:gap-3'
      : breakpoint === 'xxla'
      ? 'hidden xxla:flex xxla:items-start xxla:justify-between xxla:gap-3'
      : 'hidden xxl:flex xxl:items-start xxl:justify-between xxl:gap-3';

  const mobileClass =
    breakpoint === 'xxxxl'
      ? 'flex flex-col gap-2 w-full xxxxl:hidden'
      : breakpoint === 'xxxl'
      ? 'flex flex-col gap-2 w-full xxxl:hidden'
      : breakpoint === 'xxlc'
      ? 'flex flex-col gap-2 w-full xxlc:hidden'
      : breakpoint === 'xxlb'
      ? 'flex flex-col gap-2 w-full xxlb:hidden'
      : breakpoint === 'xxla'
      ? 'flex flex-col gap-2 w-full xxla:hidden'
      : 'flex flex-col gap-2 w-full xxl:hidden';

  const mobileBtnClass = iconLimitBreakpoint === 'icon-limit'
    ? 'icon-limit:!hidden'
    : 'sm:!hidden';

  const desktopBtnClass = iconLimitBreakpoint === 'icon-limit'
    ? '!hidden icon-limit:!inline-flex icon-limit:w-auto'
    : '!hidden sm:!inline-flex sm:w-auto';

  return (
    <>
      <div className={desktopClass}>
        <div className="flex flex-wrap gap-2">
          {renderActionButtons(relatedActions)}
          {renderActionButtons(specialActions)}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {renderActionButtons(crudActions)}
        </div>
      </div>

      <div className={mobileClass}>
        {filtersContent && inlineFiltersMobile ? (
          <div className="w-full flex flex-col gap-2">{filtersContent}</div>
        ) : null}

        <div className="flex flex-wrap gap-2 items-center">
          {filtersContent && !inlineFiltersMobile ? (
            <Button
              type="button"
              label="Filtros"
              icon="pi pi-filter"
              iconPos="right"
              outlined
              size="small"
              onClick={() => setFiltersVisible(true)}
            />
          ) : null}

          {inlineActionsMobile ? (
            <div className="flex flex-row justify-between gap-2 w-full">
              {[...relatedActions, ...specialActions, ...crudActions].map((action) => (
                <div key={`${action.label}-${action.icon}`} className="contents">
                  {/* Mobile icon-only button */}
                  <Button
                    type="button"
                    icon={action.icon}
                    outlined
                    size="small"
                    severity={action.severity}
                    disabled={action.disabled}
                    className={mobileBtnClass}
                    onClick={action.onClick}
                  />
                  {/* Desktop button with text */}
                  <Button
                    type="button"
                    label={action.label}
                    icon={action.icon}
                    iconPos="right"
                    outlined
                    size="small"
                    severity={action.severity}
                    disabled={action.disabled}
                    className={desktopBtnClass}
                    onClick={action.onClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            groups.map((group) => (
              <Button
                key={group.key}
                type="button"
                label={group.label}
                icon={group.icon}
                iconPos="right"
                outlined
                size="small"
                onClick={() => setOpenGroupKey(group.key)}
              />
            ))
          )}
        </div>
      </div>

      <Dialog
        header={activeGroup?.label}
        visible={Boolean(activeGroup)}
        onHide={() => setOpenGroupKey(null)}
        style={{ width: 'min(32rem, calc(100vw - 2rem))' }}
      >
        <div className="flex flex-col gap-2">
          {activeGroup ? renderActionButtons(activeGroup.actions) : null}
        </div>
      </Dialog>

      <Sidebar
        visible={filtersVisible}
        position="right"
        onHide={() => setFiltersVisible(false)}
        header="Filtros"
        className="w-full sm:w-30rem"
      >
        <div className="flex flex-col gap-3 p-2">{filtersContent}</div>
      </Sidebar>
    </>
  );
}
