import React, {useState, useContext} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosWithAuth from "../utils/axiosWithAuth";
import CurrentUserContext from "../contexts/CurrentUserContext";

/* admin login is admin1@gmail.com and password, volunteer login is volunteer1@gmail.com and password, student login is jakegilman@gmail.com and password */

const Login = (props) => {

 const {setUser, currentUser} = useContext(CurrentUserContext);

 let loginFunc = (values) => {

  //  console.log("loginFunc");
  //  console.log("passed values", values);

   axiosWithAuth()
   .post("https://upgrade-tutor.herokuapp.com/auth/login", values)
   .then((res) => {
    //  console.log(res);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    //Redirects after logging in

    if(res.data.user.accountType == "volunteer") {
      props.history.push("/volunteer-home");
      console.log("Login redirect", props.history);
    }
    else if(res.data.user.accountType == "admin") {
      props.history.push("/admin-home");
    }
    else if(res.data.user.accountType == "student") {
      props.history.push("/student-home");
    }
   })
   .catch((err) => console.log(err));
 }

  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      // console.log("values email", values.email);
      loginFunc(values);
    },
  });
  return (
    <form class='login' onSubmit={formik.handleSubmit}>
        <h1>LOGIN</h1>
    
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" {...formik.getFieldProps('email')} />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
<div>
<label htmlFor="password">Password</label>
      <input id="password" type="text" {...formik.getFieldProps('password')} />
      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login

