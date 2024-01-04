type NotificationDefinition = {
  notificationId: string;
  displayName: string;
  description: string;
};

type Project = {
  name: string;
  category: string;
  website: string;
  logo: string;
  background: string[];
  foreground: string;
  network: string;
  notificationDefinitions: { [key: string]: NotificationDefinition };
  id: string;
};
