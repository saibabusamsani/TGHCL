import { ProjectDetails } from "../analytics.typ";

const MOCK: ProjectDetails = {
  applicationNo: 'TGHB-Bandlaguda (LIG Colony)-ST-227701',
  name: 'MEGAVATH KAVITHA',
  category: 'ST',
  division: 'South',
  ac: 'Ibrahimpatnam',
  project: 'Bandlaguda (LIG Colony) + Tattiannaram (Bandlaguda)',
  site: 'Bandlaguda (LIG Colony)',
  allotmentNo: 2,
  allotmentType: 'REGULAR',
  vcHcApprovedAt: '2026-09-26T10:38:17.000Z',
  virtualAccount: 'TGHBBDGST0227701',
  mobile: '7306556337',
  aadhaar: 'XXXXXXXX6333',
};

export const useBeneficiaryProject = () => ({
  data: MOCK,
  isLoading: false,
});