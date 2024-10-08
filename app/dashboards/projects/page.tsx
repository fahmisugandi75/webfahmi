'use client';

import React from 'react';
import { ProjectsTable } from '@/components/ProjectsTable';
import { ProjectProvider } from '@/components/ProjectContext';

const ProjectsPage: React.FC = () => {
  return (
    <ProjectProvider>
      <div>
        <div className="mx-auto space-y-4">
          <h1 className="text-3xl font-bold mb-6 pt-2">Projects</h1>
        </div>
        <ProjectsTable />
      </div>
    </ProjectProvider>
  );
};

export default ProjectsPage;