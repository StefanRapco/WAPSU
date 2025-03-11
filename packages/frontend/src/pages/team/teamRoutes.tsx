import { Route, Routes } from 'react-router-dom';
import { TeamIndex } from '.';
import { Identity } from '../../hooks/useIdentity';
import { TeamList } from './teamList';

interface TeamRoutesProps {
  readonly identity: NonNullable<Identity>;
}

export function TeamRoutes(props: TeamRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<TeamList />} />
      <Route path=":id/*" element={<TeamIndex />} />
    </Routes>
  );
}
