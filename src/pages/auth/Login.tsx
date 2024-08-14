import { LoadingButton } from "@mui/lab";
import { useMutation } from "@tanstack/react-query";
import { dataService } from "@services/dataService";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { FormElements } from "@components/forms/FormElements";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Credential } from "@models/business";
import { globalStateService } from "@services/globalStateService";

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {isPending, mutateAsync: login} = useMutation({
    mutationFn: async (value: Credential) => {
      const data = await dataService.login(value);
      localStorage.setItem('token', data.access_token);
      const user = await dataService.getSelf();
      globalStateService.set(prev => ({...prev, user}));
    }
  });

  const onSubmit = async (value: Credential) => {
    try {
      await login(value);
      navigate(searchParams.get('return') ?? '/');
    } catch {
    }
  }

  return (
      <Grid container sx={{height: '100vh'}}>
        <Grid item xs={12} sm={8} md={5}>
          <FormElements.Container onSuccess={onSubmit}>
            <Container maxWidth="xs">
              <Typography sx={{mt: 10, mb: 8}} component="h1" variant="h3" textAlign="center">
                ورود
              </Typography>
              <Stack spacing={2} maxWidth="xs">
                <FormElements.TextField
                    fullWidth
                    label="ایمیل"
                    name="email"
                    rules={{required: 'این مورد الزامیست'}}/>
                <FormElements.TextField
                    fullWidth
                    name="password"
                    label="رمز عبور"
                    type="password"
                    rules={{required: 'این مورد الزامیست'}}/>
                <LoadingButton fullWidth sx={{mt: 3, mb: 2}} loading={isPending} type="submit" variant="contained">
                  ورود
                </LoadingButton>
              </Stack>
            </Container>
          </FormElements.Container>
        </Grid>
        <Grid item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(/images/login-bg.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  background: '-webkit-linear-gradient(left,rgba(0,168,255,0.5),rgba(185,0,255,0.5))',
                  pointerEvents: 'none',
                }
              }}/>
      </Grid>
  )
}
