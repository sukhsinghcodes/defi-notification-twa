import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  Image,
  FormControl,
  Input,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Project, Subscription } from '../../../firebase/types';
import { useCallback, useMemo } from 'react';
import { Card, DataDisplayItem, MainButton } from '../../../twa-ui-kit';
import {
  useAddOrUpdateSubscription,
  useSubscribeForm,
} from '../../../firebase';
import { useUser } from '../../../user';
import { CustomFormControl } from './CustomFormControl';
import { Control, UseFormRegister, useForm } from 'react-hook-form';
import { formatAddress } from '../../../utils';

export function NotificationPage() {
  const { selectedAddress, userId, telegramUser } = useUser();
  const { project } = useOutletContext<{ project: Project }>();
  const { notificationId } = useParams<{ notificationId: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const notification = useMemo(() => {
    if (!project) {
      return null;
    }

    return project.notificationDefinitions.find(
      (noti) => noti.notificationId === notificationId
    );
  }, [project, notificationId]);

  const { data: subscribeForm } = useSubscribeForm({
    notificationId: notificationId || '',
    enabled: !!notificationId,
    projectId: project.id,
    address: selectedAddress || '',
  });

  const fields = useMemo(() => {
    if (!subscribeForm) {
      return [];
    }

    return subscribeForm.controls.reduce(
      (prev, control) => ({
        ...prev,
        [control.id]: control.value || control.defaultValue || '',
      }),
      {}
    );
  }, [subscribeForm]);

  console.log(fields);

  const form = useForm({
    defaultValues: {
      title: '',
      ...fields,
    },
  });

  const { mutateAsync, isPending } = useAddOrUpdateSubscription();

  const onSubmit = useCallback(
    (values: { title: string; [key: string]: string }) => {
      async function submit() {
        if (
          !notification ||
          !subscribeForm ||
          !userId ||
          !selectedAddress ||
          !telegramUser?.id
        ) {
          return;
        }

        const { title, ...rest } = values;

        const subscription: Subscription = {
          displayName: title !== '' ? title : formatAddress(selectedAddress),
          notificationId: notification.notificationId,
          projectId: project.id,
          address: selectedAddress,
          userId,
          subscriptionValues: {
            ...rest,
          },
        };
        try {
          await mutateAsync({
            userId,
            telegramId: telegramUser.id,
            subscription,
          });

          toast({
            title: 'Subscribed',
            status: 'success',
            duration: 2000,
          });

          form.reset();
          //redirect to project page
          navigate(`/project/${project.id}`);
        } catch (err) {
          console.log(err);
          toast({
            title: 'Something went wrong',
            status: 'error',
            duration: 2000,
          });
        }
      }
      submit();
    },
    [
      notification,
      subscribeForm,
      userId,
      selectedAddress,
      telegramUser?.id,
      project.id,
      mutateAsync,
      toast,
      form,
      navigate,
    ]
  );

  if (!notification || !subscribeForm) {
    return (
      <VStack justifyContent="center" alignItems="center">
        <Spinner />
      </VStack>
    );
  }

  return (
    <form>
      <VStack spacing={4} mb={8} pt={8} alignItems="stretch">
        <DataDisplayItem
          StartTextSlot={
            <Box>
              <Heading as="h1" size="md">
                {notification?.displayName}
              </Heading>
              <Text>{notification?.description}</Text>
            </Box>
          }
          EndIconSlot={
            <Image
              src={`/networks/${
                notification.network ? notification.network : project.network
              }.png`}
              minW={10}
              width={10}
              height={10}
              fallbackSrc="/networks/generic.png"
            />
          }
        />
        <Card>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Title"
              {...form.register('title')}
            />
          </FormControl>
        </Card>
        {subscribeForm.controls.map((control) => (
          <CustomFormControl
            key={control.id}
            control={control}
            rhfControl={form.control as unknown as Control}
            register={
              form.register as unknown as UseFormRegister<{
                [name: string]: string;
              }>
            }
          />
        ))}
        <MainButton
          text="Save"
          onClick={form.handleSubmit(onSubmit)}
          progress={isPending}
          disabled={isPending}
        />
      </VStack>
    </form>
  );
}
