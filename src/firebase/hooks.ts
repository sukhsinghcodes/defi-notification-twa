import { getAuth, signInAnonymously } from 'firebase/auth';
import { ref, get, child, set, push } from 'firebase/database';
import { database } from './firebase-config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { ProjectResponse, SubscribeForm, Subscription } from './types';

export function useSignIn({ enabled = true }) {
  return useQuery({
    queryKey: ['signIn'],
    queryFn: async () => {
      try {
        const auth = getAuth();
        const { user } = await signInAnonymously(auth);
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          throw new Error('No user data available');
        }

        const settings = await get(child(userRef, 'settings'));

        const isServerDev = Boolean(settings.val().isServerDev);

        const lastLogon = new Date().getTime();
        await set(child(userRef, 'lastLogon'), lastLogon);

        return {
          userId: user.uid,
          isServerDev,
          lastLogon,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    enabled,
  });
}

export function useProjects({ enabled = true }) {
  const functions = getFunctions();
  const getProjects = httpsCallable(functions, 'getProjects');

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        // use firebase functions to get projects using httpsCallable
        const { data } = await getProjects();

        const projectsData = data as ProjectResponse[];

        console.log('projectsData', projectsData);

        const projects = projectsData.map((project) => {
          return {
            ...project,
            background: !Array.isArray(project.background)
              ? [project.background]
              : project.background,
            notificationDefinitions: project.notificationDefinitions
              ? Object.values(project.notificationDefinitions).map((def) => {
                  return {
                    ...def,
                    subscribeForm: def.subscribeForm
                      ? def.subscribeForm.controls.sort(
                          (a, b) => a.index - b.index
                        )
                      : null,
                    subscriptions: def.subscriptions
                      ? Object.values(def.subscriptions)
                      : [],
                  };
                })
              : [],
          };
        });

        console.log('parsed', projects);
        return projects;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    enabled,
  });
}

type UseSubscribeFormArgs = {
  enabled: boolean;
  projectId: string;
  notificationId: string;
  address: string;
};

export function useSubscribeForm({
  enabled = true,
  projectId,
  notificationId,
  address,
}: UseSubscribeFormArgs) {
  const functions = getFunctions();
  const getSubscribeForm = httpsCallable(functions, 'getSubscribeForm');

  return useQuery({
    queryKey: ['subscribeForm'],
    queryFn: async () => {
      try {
        const { data } = await getSubscribeForm({
          projectId,
          notificationId,
          address: address.toLowerCase(),
        });

        const subscribeFormData = data as SubscribeForm;
        console.log('subscribeFormData', subscribeFormData);

        return {
          controls: Object.values(subscribeFormData.controls).sort(
            (a, b) => a.index - b.index
          ),
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    enabled,
  });
}

type UseAddOrUpdateSubscription = {
  userId: string;
  telegramId: number;
  subscription: Subscription;
};

export function useAddOrUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['addOrUpdateSubscription'],
    mutationFn: async ({
      userId,
      telegramId,
      subscription,
    }: UseAddOrUpdateSubscription) => {
      try {
        const userRef = ref(database, `users/${userId}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          throw new Error('No user data available');
        }

        await set(child(userRef, 'telegramId'), telegramId);

        const subscriptionRef = ref(database, 'subscriptions');

        console.log('subscription', subscription);

        if (subscription.uid) {
          await set(child(subscriptionRef, subscription.uid), subscription);
          return true;
        }

        const pushRef = push(subscriptionRef);
        await set(pushRef, {
          ...subscription,
          uid: pushRef.key,
        });

        // TODO: needs to be more efficient and only invalidate the project + have a get project query
        await queryClient.invalidateQueries({ queryKey: ['projects'] });

        return true;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
}
