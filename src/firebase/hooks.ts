import { getAuth, signInAnonymously } from 'firebase/auth';
import { ref, get, child, set } from 'firebase/database';
import { database } from './firebase-config';
import { useQuery } from '@tanstack/react-query';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { Project } from './types';

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

        const projectsData = data as Project[];

        console.log(projectsData);

        const projects = projectsData.map((project) => {
          return {
            ...project,
            background: !Array.isArray(project.background)
              ? [project.background]
              : project.background,
            notificationDefinitions: Boolean(project.notificationDefinitions)
              ? Object.values(project.notificationDefinitions).map((def) => {
                  return {
                    ...def,
                    subscribeForm: def.subscribeForm
                      ? def.subscribeForm.controls.sort(
                          (a, b) => a.index - b.index
                        )
                      : null,
                  };
                })
              : [],
          };
        });
        console.log(projects);
        return projects;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    enabled,
  });
}
