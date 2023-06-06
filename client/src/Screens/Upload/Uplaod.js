import React, { useReducer, useCallback, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineProfile } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./_upload.scss";
import * as VideoActions from "../../Store/actions/Videos";
import Input from "../../components/Input/Input";
import { categories } from "../../categories";

const Private = [
  { value: "Public", label: "Публічне" },
  { value: "Private", label: "Приватне" },
];

const formReducer = (state, action) => {

  if (action.type === "FORM_INPUT_UPDATE") {

    const updatedValues = {
      // Change our inputValues state
      ...state.inputValues, // Return all other inputs values
      [action.input]: action.value, // But change the value of that specific input
    };
    const updateValidities = {
      // Change our inputValidities state
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = false; // Initiallt its false
    for (const key in updateValidities) {
      //  If all inputs are valid then change it to true
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state; // return our state
};

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function Uplaod() {
  const animatedComponents = makeAnimated();
  const [publicity, setpublicity] = useState();
  const [Categories, setCategories] = useState();
  const [Files, setFiles] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Userinfo = useSelector((state) => state.auth.userInfo);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    maxSize: 800000000,
    onDrop: (acceptedfile) => {
      setFiles(acceptedfile);
    },
    accept: { "video/*": [] },
  });

  const [formState, dispatchformState] = useReducer(formReducer, {
 
    inputValues: {
      Title: "",
      descriptions: "",
    },
    inputValidities: {
      Title: false,
      descriptions: false,
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

  const UplaodHandler = async () => {
    let variable;
    let thumbnail;
    let duration;
    let formData = new FormData();
    formData.append("file", Files[0]);

    axios({
      method: "POST",
      url: "http://localhost:5000/api/video/uploadfiles",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    }).then((response) => {
      if (response.data.success) {
        variable = {
          filePath: response.data.filepath,
          fileName: response.data.fileName,
        };
        NotificationManager.success(
          "Файл завантажено....Генерація мініатюри...",
          "успіх"
        );
        axios({
          method: "POST",
          url: "http://localhost:5000/api/video/thumbnail",
          data: variable,
        })
          .then((response) => {
            if (response.data.success) {
              thumbnail = response.data.Thumbsfilepath;
              duration = response.data.fileDuration;
              NotificationManager.success(
                "Мініатюру згенеровано успішно!",
                "успіх"
              );
            } else {
              NotificationManager.error(response.data.err, "Error", 10000);
            }
          })
          .finally(() => {
            onclickHandler(variable, thumbnail, duration);
          });
      } else {
        NotificationManager.error(response.data.err, "Error", 10000);
      }
    });
  };

  const onclickHandler = async (variable, thumbnail, duration) => {
    let categories = Categories.map((category) => category["label"]);
    await dispatch(
      VideoActions.Create_Video(
        formState.inputValues.Title,
        formState.inputValues.descriptions,
        publicity,
        categories,
        duration,
        `http://localhost:5000/${thumbnail}`,
        variable.filePath,
        Userinfo.name,
        Userinfo.profileImage
      )
    );
    navigate("/", { replace: true });
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="main">
      <div className="main_Container">
        <section>
          <div
            {...getRootProps({ style })}
            className="main_file-upload-wrapper"
          >
            <input {...getInputProps()} />
            {!isDragReject &&
              "Перетягніть сюди файл або натисніть та виберіть"}
            {isDragReject && "увага! формат файлу не підтримується"}
          </div>

          <ul className="list-group mt-2">
            {acceptedFiles.length > 0 &&
              acceptedFiles.map((acceptedFile) => (
                <li className="list-group-item list-group-item-success">
                  {acceptedFile.name}
                </li>
              ))}
          </ul>
          <Input
            id="Title" 
            label="Введіть назву" 
            minLength={5} 
            initialvalue="" 
            required 
            inputchange={inputChangeHandler} 
            initiallyvalid="false"
            Icon={AiOutlineProfile}
          />

          <Input
            id="descriptions" 
            label="Напишіть опис, не менше 15 символів" 
            textarea
            initialvalue="" 
            minLength={15} 
            required 
            inputchange={inputChangeHandler} 
            initiallyvalid="false"
            Icon={AiOutlineProfile}
          />
          <div className="main_selections">
            <Select
              options={Private}
              placeholder="Оберіть доступність ..."
              className="main_SelectContainer"
              defaultValue="Public"
              onChange={(selectedoption) => {
                setpublicity(selectedoption);
              }}
            />
            <Select
              placeholder="Оберіть категорію ..."
              className="main_SelectContainer"
              options={categories}
              components={animatedComponents}
              isMulti
              onChange={(selectedoption) => {
                setCategories(selectedoption);
              }}
            />
            <button onClick={UplaodHandler}>Завантажити</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Uplaod;
