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
  Select,
  VisuallyHiddenInput,
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
import { formatAddress } from '../../../utils';
import { CustomNumberInput } from './CustomNumberInput';
import { Form, Formik, FormikHelpers } from 'formik';

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

  const fields: { [name: string]: string } = useMemo(() => {
    if (!subscribeForm) {
      return {};
    }

    return subscribeForm.controls.reduce(
      (prev, control) => ({
        ...prev,
        [control.id]: control.value || control.default || '',
      }),
      {}
    );
  }, [subscribeForm]);

  console.log('fields', fields);

  const { mutateAsync, isPending } = useAddOrUpdateSubscription();

  const handleSubmit = useCallback(
    (
      values: { title: string } & { [name: string]: string },
      {
        resetForm,
      }: FormikHelpers<{ title: string } & { [name: string]: string }>
    ) => {
      console.log('handleSubmit', values);

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

        console.log('submit values', values);

        const subscription: Subscription = {
          displayName:
            values.title !== '' ? values.title : formatAddress(selectedAddress),
          notificationId: notification.notificationId,
          projectId: project.id,
          address: selectedAddress,
          userId,
          subscriptionValues: {
            ...(values as { [key: string]: string }),
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

          resetForm();
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
    <Formik
      initialValues={{
        title: '',
        ...fields,
      }}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <Form>
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
                    notification.network
                      ? notification.network
                      : project.network
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
                  {...form.getFieldProps('title')}
                />
              </FormControl>
            </Card>
            {subscribeForm.controls.map((control) => {
              let Comp = null;

              switch (control.type) {
                case 'input-text':
                case 'input-address':
                  Comp = (
                    <Card>
                      <FormControl>
                        <FormLabel>{control.label}</FormLabel>
                        <Input
                          type="text"
                          placeholder={control.label}
                          {...form.getFieldProps(control.id)}
                        />
                      </FormControl>
                    </Card>
                  );
                  break;
                case 'input-select':
                  Comp = (
                    <Card>
                      <FormControl>
                        <FormLabel>{control.label}</FormLabel>
                        <Select {...form.getFieldProps(control.id)}>
                          {control.selectOptions?.map((option) => (
                            <option value={option.value}>{option.label}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </Card>
                  );
                  break;
                case 'input-number':
                  Comp = (
                    <Card>
                      <FormControl>
                        <FormLabel>{control.label}</FormLabel>
                        <CustomNumberInput
                          {...form.getFieldProps(control.id)}
                        />
                      </FormControl>
                    </Card>
                  );
                  break;
                case 'hidden':
                  Comp = (
                    <VisuallyHiddenInput {...form.getFieldProps(control.id)} />
                  );
                  break;
                default:
                  return null;
              }
              return Comp;
            })}
            <MainButton
              text="Save"
              onClick={form.submitForm}
              progress={isPending}
              disabled={isPending}
            />
          </VStack>
        </Form>
      )}
    </Formik>
  );
}
