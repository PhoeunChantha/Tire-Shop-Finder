import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import SocialLoginButtons from '@/components/social-login-buttons';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Welcome back" description="Sign in to your account to continue">
            <Head title="Log in" />

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        Log in to your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email and password below to log in
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    
                    <Form method="post" action={route('login')} resetOnSuccess={['password']} className="space-y-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="remember" name="remember" tabIndex={3} />
                                        <Label htmlFor="remember">Remember me</Label>
                                    </div>

                                    <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        Log in
                                    </Button>
                                </div>

                                <SocialLoginButtons />

                                {/* <div className="text-center text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <TextLink href={route('register')} tabIndex={6}>
                                        Sign up
                                    </TextLink>
                                </div> */}
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
