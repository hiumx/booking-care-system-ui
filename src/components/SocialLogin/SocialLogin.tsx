import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useFacebookAuth } from '@/hooks/useFacebookAuth';
import GoogleIcon from '@/assets/img/icons/google-icon.svg';
import FacebookIcon from '@/assets/img/icons/facebook-icon.svg';
import FullScreenSpinner from '../FullScreenSpinner';

export interface SocialLoginProps {
    /**
     * Callback function called when social login is successful
     */
    onSuccess: () => void;

    /**
     * Callback function called when social login fails
     */
    onError: (error: any) => void;

    /**
     * Whether the social login buttons should be disabled
     */
    isDisabled?: boolean;

    /**
     * Whether to show the divider line with "or" text
     */
    showDivider?: boolean;

    /**
     * Text to display in the divider (optional, uses i18n by default)
     */
    dividerText?: string;

    /**
     * Text for the Google login button (optional, uses i18n by default)
     */
    googleText?: string;

    /**
     * Text for the Facebook login button (optional, uses i18n by default)
     */
    facebookText?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
    onSuccess,
    onError,
    isDisabled = false,
    showDivider = true,
    dividerText,
    googleText,
    facebookText,
}) => {
    const { t } = useTranslation('auth');
    const { login: googleLogin, isLoading: isGoogleLoading } = useGoogleAuth(onSuccess, onError);
    const { login: facebookLogin, isLoading: isFacebookLoading } = useFacebookAuth(
        onSuccess,
        onError
    );

    const isSocialLoading = isGoogleLoading || isFacebookLoading;

    return (
        <>
            {showDivider && (
                <div className="login-or">
                    <span className="or-line"></span>
                    <span className="span-or">{dividerText || t('socialLogin.or')}</span>
                </div>
            )}

            <div className="social-login-btn">
                <button
                    type="button"
                    className="btn w-100"
                    onClick={googleLogin}
                    disabled={isDisabled}
                >
                    <img src={GoogleIcon} alt="google-icon" />{' '}
                    {googleText || t('socialLogin.google')}
                </button>
                <button
                    type="button"
                    className="btn w-100"
                    onClick={facebookLogin}
                    disabled={isDisabled}
                >
                    <img src={FacebookIcon} alt="fb-icon" />{' '}
                    {facebookText || t('socialLogin.facebook')}
                </button>
                <FullScreenSpinner isVisible={isSocialLoading} />
            </div>
        </>
    );
};

export default SocialLogin;
