export interface User {
  username: string;
  subscribed_for_newsletter: boolean;
  forename: string;
  surname: string;
  shop_name?: string | null;
  purchases?: (string | null)[] | null;
}
