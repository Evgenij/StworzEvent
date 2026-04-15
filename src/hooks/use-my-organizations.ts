import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/actions/organizations/get-my-organizations.action";

export const MY_ORGANIZATIONS_QUERY_KEY = ["my-organizations"] as const;

export function useMyOrganizations() {
	return useQuery({
		queryKey: MY_ORGANIZATIONS_QUERY_KEY,
		queryFn: async () => {
			const members = await getMyOrganizations();
			return members.map((m) => m.organizations);
		},
	});
}
