import React, { useReducer, useCallback, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineGoogle,
  AiOutlineGithub,
  AiOutlineFacebook,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { SpinnerCircular } from "spinners-react";
import { getAdditionalUserInfo } from "firebase/auth";
import { NotificationManager } from "react-notifications";

import { useAuth } from "../../Context/UserAuthContext";
import Input from "../../components/Input/Input";
import "./_UserAuthBox.scss";

const formReducer = (state, action) => {

  if (action.type === "FORM_INPUT_UPDATE") {

    const updatedValues = {
      ...state.inputValues, 
      [action.input]: action.value, 
    };
    const updateValidities = {

      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = false; 
    for (const key in updateValidities) {
      
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state; 
};

function UserAuthbox({ containerAuth, handleContainerLogin }) {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [SignUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    SignupUser,
    LogInUser,
    isAuthenticated,
    SignInWithGoogle,
    CreateFireStoreUser,
  } = useAuth();

  if (isAuthenticated) {
    navigate(location.state?.from ?? "/");
  }

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const AuthHandler = async () => {
    seterror(null);
    setloading(true);
    try {
      if (SignUp) {
        await SignupUser(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.name
        );
      } else {
        await LogInUser(
          formState.inputValues.email,
          formState.inputValues.password
        );
      }
      setloading(false);
    } catch (e) {
      seterror(e.message);
      setloading(false);
    }
  };

  const [formState, dispatchformState] = useReducer(formReducer, {

    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(

    (inputIdentifier, inputvalue, inputisValid) => {
      dispatchformState({
        type: "FORM_INPUT_UPDATE",
        value: inputvalue,
        isValid: inputisValid,
        input: inputIdentifier,
      });
    },
    [dispatchformState]
  );

  const LeftSidevariants = (Side) => {
    return {
      hidden: { opacity: 0, x: Side == "Left" ? -700 : 700 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.15,
          duration: 0.95,
          type: "spring",
        },
      },
    };
  };

  const SignIn_Button_Varient = {
    hover: {
      scale: 1.2,
      transition: {
        yoyo: Infinity,
      },
    },
    pressed: {
      scale: 0.9,
    },
  };

  const onclickHandler = () => {
    handleContainerLogin();
  };

  return (
    <div className="mainboxContainer">
      {containerAuth ? (
        <>
          <motion.div
            variants={LeftSidevariants("Left")}
            initial="hidden"
            animate="visible"
            className="mainboxContainer_LeftSide"
          >
            <h1>Вітаю</h1>
            <p>
              Щоб спробувати додаток увійдіть
              <br></br>
              Залогуйтесь в систему
            </p>
            <motion.button
              variants={SignIn_Button_Varient}
              whileHover="hover"
              whileTap="pressed"
              type="button"
              className="SignIn_Button"
              onClick={onclickHandler}
            >
              Автентифікувати
            </motion.button>
          </motion.div>
          <motion.div
            variants={LeftSidevariants()}
            initial="hidden"
            animate="visible"
            className="mainboxContainer_RightSide"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/640px-Flag_of_Ukraine.svg.png"
            />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            variants={LeftSidevariants("Left")}
            initial="hidden"
            whileInView="visible"
            className="mainboxContainer_Form"
          >
            <h1>Увійдіть використовуючи</h1>
            <div className="mainboxContainer_Form_signin-icons">
              <div
                className="mainboxContainer_Form_signin-icons_icon google"
                onClick={() => {
                  SignInWithGoogle()
                    .then((result) => {
                      if (getAdditionalUserInfo(result).isNewUser) {
                        const user = result.user;
                        CreateFireStoreUser(
                          result.user,
                          user.displayName,
                          user.photoURL
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              >
                <AiOutlineGoogle size={23} />
              </div>
            </div>
            <p>Або використайте вашу пошту</p>
            <form autoComplete="off">
              <Input
                id="email" 
                type="email"
                label="Email" 
                initialvalue="" 
                required 
                email="true" // custom email validation
                inputchange={inputChangeHandler}
                initiallyvalid="false"
                Icon={AiOutlineMail}
              />

              <Input
                id="password" 
                label="Password" 
                initialvalue="" 
                minLength={5} // minimum length
                required
                type="Password"
                inputchange={inputChangeHandler} 
                initiallyvalid="false"
                Icon={AiOutlineLock}
              />

              {SignUp && (
                <Input
                  id="name"
                  label="Your Name"
                  inputchange={inputChangeHandler} 
                  initialvalue="" 
                  initiallyvalid="false"
                  required
                  minLength={3}
                  Icon={AiOutlineUser}
                />
              )}

              <div className="SignUp">
                <p>
                  {SignUp
                    ? "У вас вже є аккаунт?"
                    : "У вас немає аккаунта??"}
                </p>
                <Link
                  className="link"
                  to="#"
                  onClick={() => {
                    setSignUp(!SignUp);
                  }}
                >
                  {SignUp ? "Login" : "Sign Up"}
                </Link>
              </div>
              {!SignUp && (
                <motion.div
                  variants={{
                    hover: {
                      scale: 1.1,
                    },
                  }}
                  whileHover="hover"
                  className="forgor_passw"
                >
                  <Link to="/forgot-password" className="forgor_passw_link">
                    Забули пароль?
                  </Link>
                </motion.div>
              )}

              <br></br>
              {!loading ? (
                <motion.button
                  variants={SignIn_Button_Varient}
                  whileHover="hover"
                  whileTap="pressed"
                  type="button"
                  className="SignIn_Button"
                  onClick={() => {
                    AuthHandler();
                  }}
                >
                  Увійти
                </motion.button>
              ) : (
                <SpinnerCircular color="#00BFFF" />
              )}
            </form>
          </motion.div>
          <motion.div
            variants={LeftSidevariants()}
            initial="hidden"
            whileInView="visible"
            className="mainboxContainer_FormRightside"
          >
            <h1>Привіт</h1>
            <p></p>
            <div className="mainboxContainer_FormRightside_img">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/640px-Flag_of_Ukraine.svg.png"
                alt=""
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default UserAuthbox;
