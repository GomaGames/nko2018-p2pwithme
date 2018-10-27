export interface HostConnection {
  id: string;
  access_token: string;
  display_name: string;
  entry_url: string;
}

export type HostRegistrationOffer = {
  display_name: string;
  entry_url: string;
};
