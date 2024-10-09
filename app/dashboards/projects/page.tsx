'use client';

import React from 'react';
import { ProjectsTable } from '@/components/ProjectsTable';
import { ProjectProvider } from '@/components/ProjectContext';

const ProjectsPage: React.FC = () => {
  return (
    <ProjectProvider>
      <div>
        <ProjectsTable />
      </div>
    </ProjectProvider>
  );
};

export default ProjectsPage;