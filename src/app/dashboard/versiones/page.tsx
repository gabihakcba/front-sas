'use client';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { versionReports } from '@/data/version-reports';

export default function VersionesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="m-0 text-2xl font-semibold">Reportes de version</h1>
        <p className="m-0">
          Historial funcional del frontend, ordenado de la version mas reciente a la mas antigua.
        </p>
      </div>

      {versionReports.map((report) => (
        <Card
          key={report.version}
          title={report.title}
          subTitle={`Version ${report.version} · ${report.date}`}
        >
          <div className="flex flex-col gap-4">
            <Tag value={`v${report.version}`} severity="info" />
            <p className="m-0">{report.summary}</p>

            {report.sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <h2 className="m-0 text-lg font-semibold">{section.title}</h2>
                <ul className="m-0 pl-4">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
