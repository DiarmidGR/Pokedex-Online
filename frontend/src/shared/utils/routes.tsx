import { Route } from "react-router-dom";
import TrackingPage from "../../features/TrackingPage/TrackingPage";

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
      element={<TrackingPage version_id={version.id.toString()} />}
    />
  ));
