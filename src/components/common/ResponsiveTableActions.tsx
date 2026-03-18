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
}

export function ResponsiveTableActions({
  crudActions = [],
  specialActions = [],
  relatedActions = [],
  filtersContent,
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

  return (
    <>
      <div className="hidden md:flex md:items-start md:justify-between md:gap-3">
        <div className="flex flex-wrap gap-2">
          {renderActionButtons(relatedActions)}
          {renderActionButtons(specialActions)}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {renderActionButtons(crudActions)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:hidden">
        {filtersContent ? (
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
        {groups.map((group) => (
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
        ))}
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
