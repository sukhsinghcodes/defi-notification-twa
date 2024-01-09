export type SelectOption = {
  label: string;
  value: string;
};

export type Control = {
  readonly id: string;
  readonly type: string;
  readonly label: string;
  readonly suffix?: string | null;
  readonly description?: string | null;
  readonly defaultValue?: string | null;
  readonly value?: string | null;
  readonly index: number;
  readonly internal: boolean;
  readonly isOptional: boolean;
  readonly selectOptions: SelectOption[] | null;
};

export type SubscribeForm = {
  controls: Control[];
};

export type Subscription = {
  uid?: string | null;
  userId: string;
  projectId: string;
  readonly notificationId: string;
  address: string;
  displayName?: string | null;
  readonly subscriptionValues: { [key: string]: string | null };
};

export type NotificationDefinition = {
  notificationId: string;
  displayName: string;
  description: string;
  network?: string;
  displayIcon?: string;
  subscribeForm?: SubscribeForm;
  subscriptions?: Subscription[];
};

export type ProjectResponse = {
  name: string;
  category: string;
  website: string;
  logo: string;
  background: string[] | string;
  foreground: string;
  network: string;
  notificationDefinitions: { [key: string]: NotificationDefinition };
  id: string;
};

export type Project = {
  name: string;
  category: string;
  website: string;
  logo: string;
  background: string[];
  foreground: string;
  network: string;
  notificationDefinitions: {
    subscriptions: Subscription[];
    notificationId: string;
    displayName: string;
    description: string;
    network?: string | undefined;
    displayIcon?: string | undefined;
  }[];
  id: string;
};
