import React, { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import "../../App.css"
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { toastErrorMessage, toastSuccessMessage } from "../../commonFunction/toastFunctions"


function Header() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [wantToRegister, setWantToRegister] = useState(false)

  useEffect(() => {
    if (readCookie("isRemember") !== null) {
      form.setFieldsValue({
        username: atob(`${readCookie("userName")}`),
        password: atob(`${readCookie("password")}`),
        remember: Boolean(`${readCookie("isRemember")}`),
      });
    }
  }, [])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const signupResponseGoogle = async (response) => {
    let { tokenId } = response
    const headers = {
      'token': tokenId,
    }

    await axios.post("/auth/googleRegister", { data: "" }, { headers: headers }).then((res) => {
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        navigate("/kyc")
        toastSuccessMessage(res.data.message);
      } else {
        toastErrorMessage(res.data.message);
      }
    })
  }

  const loginResponseGoogle = async (response) => {
    let { tokenId } = response
    const headers = {
      'token': tokenId,
    }

    await axios.post("/auth/googleLogin", { data: "" }, { headers }).then(async (res) => {
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)

        await axios.get("/user/fetchOneUserData", { headers: { token: res.data.token } }).then((result) => {
          localStorage.setItem("UserType", result.data.data.userType)
          navigate('/dashboard')
        })
        toastSuccessMessage(res.data.message);
      } else {
        toastSuccessMessage(res.data.message);
      }
    })
  }
  const requestGoogleAuth = () => {
    console.log("Start Google Auth")
  }
  const errorResponseGoogle = (response) => {
    console.log("errorResponse", response);
  }

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const readCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const onFinishLogin = async (values) => {
    if (values) {
      axios.post("/auth/login", {
        email: values.username, password: values.password
      }).then(async (res) => {

        if (res.data.success) {
          if (values.remember) {
            document.cookie = `userName = ${btoa(values.username)}`;
            document.cookie = `password = ${btoa(values.password)}`;
            document.cookie = `isRemember = ${values.remember}`;
          } else {
            deleteAllCookies();
          }

          toastSuccessMessage(res.data.message)
          form.resetFields();
          localStorage.setItem("token", res.data.token)

          await axios.get("/user/fetchOneUserData", { headers: { token: res.data.token } }).then((result) => {
            localStorage.setItem("UserType", result.data.data.userType)
            navigate('/dashboard')
          })

        } else {
          toastErrorMessage(res.data.message);
        }
      })
    } else {
      toastErrorMessage("please enter valid value");
    }
  };
  const onFinishSignUp = (values) => {
    axios.post("/auth/register", {
      email: values.username, password: values.password
    }).then((res) => {
      if (res.data.success) {
        form.resetFields();
        localStorage.setItem("token", res.data.token)
        navigate("/kyc")
        toastSuccessMessage(res.data.message);
      } else {
        form.resetFields();
        toastSuccessMessage(res.data.message);
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <header id="header">
        <h1 id="logo" className="logo">
          <a onClick={() => navigate("/")}>Landed</a>
        </h1>
        <nav id="nav">
          <ul>
            <li className="opener">
              <a onClick={() => navigate("/detail")}>know more?</a>
            </li>
            <li>
              <a className="button primary" onClick={showModal}>Login / Sign Up</a>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        {wantToRegister ?
          (<Modal title="Sign Up" visible={isModalVisible} onCancel={() => handleCancel()} footer={null} >
            <div >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin className='google'
                  clientId="84247836273-ihlo47j2lbhm9p25qv086pkga8sdo0un.apps.googleusercontent.com"
                  onRequest={requestGoogleAuth}
                  onSuccess={signupResponseGoogle}
                  onFailure={errorResponseGoogle}
                  isSignedIn={false}
                />

              </div>
              <div className="google-signin-divider"><span className="line"></span><span className="divider-or">or</span></div>
              <div >
                <Form
                  form={form}
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinishSignUp}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      SignUp
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div>
                <div className="other-cta"><span className="other-text">Already have an account?</span><a href="#" onClick={() => setWantToRegister(false)} ><span className="other-button">Login</span></a></div>
              </div>
            </div>
          </Modal>) :
          (<Modal title="Login" visible={isModalVisible} onCancel={() => handleCancel()} footer={null} >
            <div >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin className='google'
                  clientId="84247836273-ihlo47j2lbhm9p25qv086pkga8sdo0un.apps.googleusercontent.com"
                  onRequest={requestGoogleAuth}
                  onSuccess={loginResponseGoogle}
                  onFailure={errorResponseGoogle}
                  isSignedIn={false}
                />
              </div>
              <div className="google-signin-divider"><span className="line"></span><span className="divider-or">or</span></div>
              <div >
                <Form
                  form={form}
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinishLogin}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div>
                <div className="other-cta"><span className="other-text">Don't have an account yet?</span><a href="#" onClick={() => setWantToRegister(true)}><span className="other-button">Sign up</span></a></div>
              </div>
            </div>
          </Modal>)}

      </div>
    </>
  );
}

export default Header;
