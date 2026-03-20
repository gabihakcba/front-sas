'use client';

import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { useAuth } from '@/context/AuthContext';
import { CuentaDineroFormDialog } from '@/components/cuentas-dinero/CuentaDineroFormDialog';
import { useCuentasDineroHook } from '@/hooks/useCuentasDineroHooks';
import { hasDeveloperAccess } from '@/lib/authorization';
import { CuentaDinero } from '@/types/cuentas-dinero';

export default function CuentasDineroPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cuentasDinero,
    selectedCuentaDinero,
    setSelectedCuentaDinero,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    closeDialog,
    submitForm,
  } = useCuentasDineroHook();
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const filterControls = (
    <IconField iconPosition="right" className="w-full">
      <InputText
        className="w-full"
        value={filters.q}
        onChange={(event) =>
          setFilters({
            ...filters,
            q: event.target.value,
          })
        }
        placeholder="Buscar cuenta"
      />
      <InputIcon className="pi pi-search" />
    </IconField>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        crudActions={[
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            onClick: () => void openCreateDialog(),
          },
          {
            label: 'Detalles',
            icon: 'pi pi-eye',
            onClick: () => {
              if (selectedCuentaDinero) {
                router.push(`/dashboard/cuentas/dinero/${selectedCuentaDinero.id}`);
              }
            },
            disabled: !selectedCuentaDinero,
          },
        ]}
      />
    </div>
  );

  const areaHeader = (
    <Dropdown
      value={filters.idArea}
      options={options.areas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idArea: (event.value as number | null) ?? null,
        })
      }
      placeholder="Área"
      showClear
    />
  );

  const ramaHeader = (
    <Dropdown
      value={filters.idRama}
      options={options.ramas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idRama: (event.value as number | null) ?? null,
        })
      }
      placeholder="Rama"
      showClear
    />
  );

  const miembroHeader = (
    <Dropdown
      value={filters.idMiembro}
      options={options.miembros}
      optionLabel="apellidos"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idMiembro: (event.value as number | null) ?? null,
        })
      }
      placeholder="Miembro"
      showClear
      itemTemplate={(miembro) =>
        miembro
          ? `${miembro.apellidos}, ${miembro.nombre} (${miembro.dni})`
          : null
      }
      valueTemplate={(miembro) =>
        miembro
          ? `${miembro.apellidos}, ${miembro.nombre} (${miembro.dni})`
          : 'Miembro'
      }
    />
  );

  return (
    <div className="h-full w-full">
      <Card title="Cuentas de Dinero" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={cuentasDinero}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedCuentaDinero}
          onSelectionChange={(event) =>
            setSelectedCuentaDinero((event.value as CuentaDinero | null) ?? null)
          }
          onRowDoubleClick={(event) =>
            router.push(`/dashboard/cuentas/dinero/${(event.data as CuentaDinero).id}`)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay cuentas de dinero disponibles para tu scope actual."
          tableStyle={{ minWidth: '52rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column
            header="Descripción"
            body={(cuenta: CuentaDinero) => cuenta.descripcion || '-'}
          />
          <Column field="monto_actual" header="Monto actual" />
          <Column
            header={areaHeader}
            body={(cuenta: CuentaDinero) => cuenta.Area?.nombre ?? '-'}
          />
          <Column
            header={ramaHeader}
            body={(cuenta: CuentaDinero) => cuenta.Rama?.nombre ?? '-'}
          />
          <Column
            header={miembroHeader}
            body={(cuenta: CuentaDinero) =>
              cuenta.Miembro
                ? `${cuenta.Miembro.apellidos}, ${cuenta.Miembro.nombre}`
                : '-'
            }
          />
          <Column
            header="Pagos asociados"
            body={(cuenta: CuentaDinero) => cuenta._count.Pago}
          />
          <Column
            header="Movimientos"
            body={(cuenta: CuentaDinero) => cuenta._count.MovimientoCuenta}
          />
        </DataTable>
      </Card>

      <CuentaDineroFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        options={options}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
    </div>
  );
}
