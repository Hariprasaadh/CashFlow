import {useState, useEffect, useRef} from 'react'
import { Text, TextInput, TouchableOpacity, View, Animated, Easing } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {styles} from "@/assets/styles/auth.styles.js"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getClerkErrorMessage, validateEmail, validatePassword, validateVerificationCode } from "../../lib/errorHandling";


export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const verificationFadeAnim = useRef(new Animated.Value(0)).current
  const verificationSlideAnim = useRef(new Animated.Value(30)).current
  const buttonScaleAnim = useRef(new Animated.Value(1)).current

  // Timer effect for resend functionality
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    }, [resendTimer])

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  };

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Verification screen animations
  useEffect(() => {
    if (pendingVerification) {
      // Reset and animate verification screen
      verificationFadeAnim.setValue(0);
      verificationSlideAnim.setValue(30);
      
      Animated.parallel([
        Animated.timing(verificationFadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(verificationSlideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pendingVerification, verificationFadeAnim, verificationSlideAnim]);

  // Shake animation for errors
  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Clear previous errors
    setError("");

    // Validate email
    const emailError = validateEmail(emailAddress);
    if (emailError) {
      setError(emailError);
      triggerShakeAnimation();
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      triggerShakeAnimation();
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
      setResendTimer(60) // Set 60 second timer for resend
    } catch (err) {
      const errorMessage = getClerkErrorMessage(err);
      setError(errorMessage);
      triggerShakeAnimation();
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    // Clear previous errors
    setError("");

    // Validate verification code
    const codeError = validateVerificationCode(code);
    if (codeError) {
      setError(codeError);
      triggerShakeAnimation();
      return;
    }

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError("Verification incomplete. Please try again or contact support.");
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const errorMessage = getClerkErrorMessage(err);
      setError(errorMessage);
      triggerShakeAnimation();
    }
  }

  // Handle resending verification code
  const onResendPress = async () => {
    if (!isLoaded || resendTimer > 0) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setError(""); // Clear any existing errors
      setResendTimer(60); // Set 60 second timer
    } catch (err) {
      const errorMessage = getClerkErrorMessage(err);
      setError(errorMessage);
      triggerShakeAnimation();
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={50}
      >
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: verificationFadeAnim,
              transform: [{ translateY: verificationSlideAnim }]
            }
          ]}
        >
          <Animated.Image 
            source={require("../../assets/images/revenue-i2.png")} 
            style={[
              styles.illustration,
              {
                transform: [{ scale: verificationFadeAnim }]
              }
            ]} 
          />
          
          <Animated.Text 
            style={[
              styles.title,
              {
                opacity: verificationFadeAnim,
                transform: [{ translateY: verificationSlideAnim }]
              }
            ]}
          >
            Verify Your Email
          </Animated.Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a 6-digit verification code to {emailAddress}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.codeInputContainer}>
            <Text style={styles.codeLabel}>Enter 6-digit code</Text>
            <View style={styles.codeInputWrapper}>
              <TextInput
                style={[
                  styles.codeInput, 
                  error && styles.errorInput,
                  code.length === 6 && styles.codeInputComplete
                ]}
                value={code}
                placeholder="• • • • • •"
                placeholderTextColor="#C8C8C8"
                onChangeText={(code) => setCode(code)}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
                autoFocus={true}
                autoComplete="one-time-code"
              />
              {code.length === 6 && (
                <View style={styles.codeCompleteIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.income} />
                </View>
              )}
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity 
              onPress={() => {
                animateButton();
                onVerifyPress();
              }} 
              style={[
                styles.button,
                code.length === 6 && styles.buttonActive
              ]}
              disabled={code.length !== 6}
            >
              <Text style={styles.buttonText}>
                {code.length === 6 ? 'Verify Email' : `Enter Code (${code.length}/6)`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Didn&apos;t receive the code?</Text>
            <TouchableOpacity 
              onPress={onResendPress}
              disabled={resendTimer > 0}
              style={[resendTimer > 0 && styles.disabledButton]}
            >
              <Text style={[styles.linkText, resendTimer > 0 && styles.disabledText]}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setPendingVerification(false)} 
            style={[styles.footerContainer, { marginTop: 20 }]}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={[styles.linkText, { marginLeft: 5 }]}>Back to Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
    )
  }

  return (

    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
    >

    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
            { translateX: shakeAnim }
          ]
        }
      ]}
    >
        <View style={styles.container}>

            <Animated.Image 
              source={require("../../assets/images/revenue-i2.png")} 
              style={[
                styles.illustration,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]} 
            />

            <Animated.Text 
              style={[
                styles.title,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              Create Account
            </Animated.Text>

            {error ? (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError("")}>
                    <Ionicons name="close" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>
            ) : null} 

            <TextInput
                style={[styles.input, error && styles.errorInput]}
                autoCapitalize="none"
                value={emailAddress}
                placeholderTextColor="#9A8478"
                placeholder="Enter email"
                onChangeText={(email) => setEmailAddress(email)}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                  style={[styles.passwordInput, error && styles.errorInput]}
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor="#9A8478"
                  secureTextEntry={!showPassword}
                  onChangeText={(password) => setPassword(password)}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                  animateButton();
                  onSignUpPress();
                }}
              >
                  <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.linkText}>Sign in</Text>
                </TouchableOpacity>
            </View>

        </View>
    </Animated.View>

    </KeyboardAwareScrollView>
  )
}