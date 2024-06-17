import React from "react";
import { Route } from "react-router-dom";
import EncountersPage from "./pages/EncountersPage";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

export const versionRoutes = (versions: Version[]) =>
  versions.map((version: Version) => (
    <Route
      key={version.id}
      path={`/${version.identifier}`}
      element={
        <EncountersPage
          version={version.identifier}
          version_id={version.id.toString()}
        />
      }
    />
  ));
